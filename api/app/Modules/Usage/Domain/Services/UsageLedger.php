<?php

namespace App\Modules\Usage\Domain\Services;

use App\Modules\Usage\Domain\Models\UsageEvent;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * Read-side of the ledger: rollups for dashboards, alerts and invoicing.
 * The public query surface other modules (e.g. Billing) depend on.
 */
final class UsageLedger
{
    /** Total billable cost for a tenant over a period (optionally only unbilled). */
    public function billableTotal(string $tenantId, ?CarbonInterface $from = null, ?CarbonInterface $to = null, bool $unbilledOnly = false): float
    {
        return (float) $this->scopedQuery($tenantId, $from, $to, $unbilledOnly)->sum('billable_cost');
    }

    /** Per-service rollup: [service => ['raw' => x, 'billable' => y, 'quantity' => q]]. */
    public function rollupByService(string $tenantId, ?CarbonInterface $from = null, ?CarbonInterface $to = null, bool $unbilledOnly = false): Collection
    {
        return $this->scopedQuery($tenantId, $from, $to, $unbilledOnly)
            ->selectRaw('service, SUM(raw_cost) as raw, SUM(billable_cost) as billable, SUM(quantity) as quantity')
            ->groupBy('service')
            ->get()
            ->keyBy('service')
            ->map(fn ($r) => [
                'raw' => (float) $r->getAttribute('raw'),
                'billable' => (float) $r->getAttribute('billable'),
                'quantity' => (float) $r->getAttribute('quantity'),
            ]);
    }

    /** Unbilled events for a tenant (used by invoice generation). */
    public function unbilledEvents(string $tenantId, ?CarbonInterface $from = null, ?CarbonInterface $to = null): Collection
    {
        return $this->scopedQuery($tenantId, $from, $to, true)->get();
    }

    /**
     * Stamp all unbilled events in the window with an invoice id. Keeps the
     * usage_events write inside Usage so Billing never touches the model.
     * Returns the number of events assigned.
     */
    public function assignUnbilledToInvoice(string $tenantId, ?CarbonInterface $from, ?CarbonInterface $to, string $invoiceId): int
    {
        return $this->scopedQuery($tenantId, $from, $to, true)->update(['invoice_id' => $invoiceId]);
    }

    private function scopedQuery(string $tenantId, ?CarbonInterface $from, ?CarbonInterface $to, bool $unbilledOnly): Builder
    {
        return UsageEvent::query()
            ->where('tenant_id', $tenantId)
            ->when($from, fn ($q) => $q->where('created_at', '>=', $from))
            ->when($to, fn ($q) => $q->where('created_at', '<=', $to))
            ->when($unbilledOnly, fn ($q) => $q->whereNull('invoice_id'));
    }
}
