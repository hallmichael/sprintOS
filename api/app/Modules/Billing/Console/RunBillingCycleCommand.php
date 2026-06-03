<?php

namespace App\Modules\Billing\Console;

use App\Modules\Billing\Domain\Services\InvoiceService;
use App\Modules\Billing\Domain\Services\PaymentService;
use App\Modules\Tenancy\Domain\Models\Tenant;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;

/**
 * Rolls each active org's unbilled usage for the period into an invoice, and
 * (with --charge) charges it to the stored card. Scheduled monthly; see
 * routes/console.php. Run ad hoc: `php artisan billing:run-cycle --charge`.
 */
final class RunBillingCycleCommand extends Command
{
    protected $signature = 'billing:run-cycle {--charge : Also charge generated invoices} {--month= : YYYY-MM (defaults to current)}';

    protected $description = 'Generate (and optionally charge) invoices for all active organisations';

    public function handle(InvoiceService $invoices, PaymentService $payments): int
    {
        $month = $this->option('month')
            ? CarbonImmutable::createFromFormat('Y-m', $this->option('month'))
            : CarbonImmutable::now();

        $from = $month->startOfMonth();
        $to = $month->endOfMonth();

        $generated = 0;
        $charged = 0;

        foreach (Tenant::withoutGlobalScopes()->where('is_active', true)->cursor() as $tenant) {
            $invoice = $invoices->generateForPeriod($tenant->id, $from, $to);
            if ($invoice === null) {
                continue;
            }

            $generated++;
            $this->line("  {$tenant->name}: {$invoice->number} — {$invoice->currency} {$invoice->total}");

            if ($this->option('charge')) {
                $result = $payments->chargeInvoice($invoice);
                if ($result->status === 'paid') {
                    $charged++;
                }
            }
        }

        $this->info("Billing cycle complete: {$generated} invoice(s) generated, {$charged} charged.");

        return self::SUCCESS;
    }
}
