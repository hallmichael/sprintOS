<?php

namespace App\Modules\Billing\Http\Controllers;

use App\Modules\Billing\Domain\Models\Invoice;
use App\Modules\Billing\Domain\Services\BillingConfigService;
use App\Modules\Billing\Domain\Services\InvoiceService;
use App\Modules\Billing\Domain\Services\PaymentService;
use App\Modules\Billing\Domain\Services\SpendGuard;
use App\Modules\Billing\Http\Requests\AddCardRequest;
use App\Modules\Billing\Http\Requests\UpdateBillingSettingsRequest;
use App\Modules\Billing\Http\Resources\BillingSettingResource;
use App\Modules\Billing\Http\Resources\InvoiceResource;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use App\Shared\Http\Controller;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Billing dashboard + management for the active org (Build Guide 2.5).
 * Settings/card/charging are org-admin actions (gated at the route layer).
 */
final class BillingController extends Controller
{
    public function __construct(
        private readonly TenantContext $context,
        private readonly BillingConfigService $config,
        private readonly InvoiceService $invoices,
        private readonly PaymentService $payments,
        private readonly SpendGuard $guard,
    ) {}

    /** GET /api/billing/settings — settings, card status and live cap state. */
    public function settings(): JsonResponse
    {
        $tenantId = $this->context->require()->id;
        $setting = $this->config->forTenant($tenantId);

        return response()->json([
            'settings' => BillingSettingResource::make($setting),
            'current_spend' => $this->guard->currentSpend($tenantId),
            'alerting' => $this->guard->shouldAlert($tenantId),
        ]);
    }

    /** PATCH /api/billing/settings — update markup / cap / cycle. */
    public function updateSettings(UpdateBillingSettingsRequest $request): BillingSettingResource
    {
        return BillingSettingResource::make(
            $this->config->update($this->context->require()->id, $request->validated()),
        );
    }

    /** POST /api/billing/card — attach a tokenised card. */
    public function addCard(AddCardRequest $request): JsonResponse
    {
        $setting = $this->payments->addCard(
            $this->context->require()->id,
            $request->validated('payment_method_id'),
            $request->user()->email,
        );

        // Explicit 200 — attaching a card is an update, not a resource creation
        // (a billing_settings row may have just been auto-provisioned, which would
        // otherwise make the API Resource report 201).
        return BillingSettingResource::make($setting)->response()->setStatusCode(200);
    }

    /** GET /api/billing/invoices — list invoices for the org. */
    public function invoices(): AnonymousResourceCollection
    {
        return InvoiceResource::collection(Invoice::latest()->paginate());
    }

    /** GET /api/billing/invoices/{id} */
    public function showInvoice(string $id): InvoiceResource
    {
        return InvoiceResource::make(Invoice::with('lines')->findOrFail($id));
    }

    /** POST /api/billing/invoices/generate — roll current-month usage into an invoice. */
    public function generate(): JsonResponse
    {
        $tenantId = $this->context->require()->id;
        $from = CarbonImmutable::now()->startOfMonth();
        $to = CarbonImmutable::now();

        $invoice = $this->invoices->generateForPeriod($tenantId, $from, $to);

        return $invoice
            ? response()->json(InvoiceResource::make($invoice->load('lines')), 201)
            : response()->json(['message' => 'No unbilled usage for this period.'], 200);
    }

    /** POST /api/billing/invoices/{id}/charge — charge an open invoice. */
    public function charge(string $id): InvoiceResource
    {
        $invoice = Invoice::findOrFail($id);

        return InvoiceResource::make($this->payments->chargeInvoice($invoice));
    }
}
