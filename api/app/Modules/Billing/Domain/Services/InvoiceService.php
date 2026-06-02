<?php

namespace App\Modules\Billing\Domain\Services;

use App\Modules\Billing\Domain\Models\Invoice;
use App\Modules\Billing\Domain\Models\InvoiceLine;
use App\Modules\Usage\Domain\Services\UsageLedger;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

/**
 * Rolls unbilled usage into an invoice with the org's markup applied
 * (Build Guide 2.4). Reads usage via the Usage ledger contract only.
 */
final class InvoiceService
{
    public function __construct(
        private readonly UsageLedger $ledger,
        private readonly BillingConfigService $config,
    ) {}

    /**
     * Generate an invoice for the given period from the org's unbilled usage.
     * Returns null when there is nothing to bill.
     */
    public function generateForPeriod(string $tenantId, CarbonInterface $from, CarbonInterface $to): ?Invoice
    {
        return DB::transaction(function () use ($tenantId, $from, $to): ?Invoice {
            $rollup = $this->ledger->rollupByService($tenantId, $from, $to, unbilledOnly: true);

            if ($rollup->isEmpty()) {
                return null;
            }

            $subtotalRaw = (float) $rollup->sum('raw');
            $total = (float) $rollup->sum('billable');
            $setting = $this->config->forTenant($tenantId);

            $invoice = Invoice::create([
                'tenant_id' => $tenantId,
                'number' => $this->nextNumber($tenantId, $from),
                'period_start' => $from->toDateString(),
                'period_end' => $to->toDateString(),
                'status' => Invoice::STATUS_OPEN,
                'subtotal_raw' => $subtotalRaw,
                'markup_total' => $total - $subtotalRaw,
                'total' => $total,
                'currency' => $setting->currency,
            ]);

            foreach ($rollup as $service => $data) {
                InvoiceLine::create([
                    'tenant_id' => $tenantId,
                    'invoice_id' => $invoice->id,
                    'service' => $service,
                    'description' => ucfirst($service).' usage',
                    'quantity' => $data['quantity'],
                    'raw_cost' => $data['raw'],
                    'billable_cost' => $data['billable'],
                ]);
            }

            $this->ledger->assignUnbilledToInvoice($tenantId, $from, $to, $invoice->id);

            return $invoice->load('lines');
        });
    }

    private function nextNumber(string $tenantId, CarbonInterface $from): string
    {
        $seq = Invoice::withoutGlobalScopes()->where('tenant_id', $tenantId)->count() + 1;

        return 'INV-'.CarbonImmutable::parse($from)->format('Ym').'-'.str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }
}
