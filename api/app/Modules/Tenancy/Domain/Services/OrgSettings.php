<?php

namespace App\Modules\Tenancy\Domain\Services;

use App\Modules\Tenancy\Domain\Models\Tenant;

/**
 * Structured read/write over a Tenant's `settings` JSON — the per-org slice of
 * the setup wizard (branding, feature flags, AI tier preference, completion).
 * Tenancy owns this data; no cross-module dependency.
 */
final class OrgSettings
{
    public const FEATURES = ['crud_builder', 'agents', 'rag', 'connectors'];

    /** Normalised settings with defaults applied. */
    public function view(Tenant $tenant): array
    {
        $s = (array) ($tenant->settings ?? []);
        $branding = (array) ($s['branding'] ?? []);

        return [
            'branding' => [
                'display_name' => $branding['display_name'] ?? $tenant->name,
                'primary_color' => $branding['primary_color'] ?? null,
                'logo_url' => $branding['logo_url'] ?? null,
            ],
            'features' => $this->features((array) ($s['features'] ?? [])),
            'ai_default_tier' => $s['ai_default_tier'] ?? config('sprintos.ai.default_tier'),
            'setup_completed' => (bool) ($s['setup_completed'] ?? false),
        ];
    }

    /** Merge a partial update into the tenant's settings. */
    public function update(Tenant $tenant, array $changes): array
    {
        $current = (array) ($tenant->settings ?? []);

        foreach (['branding', 'features'] as $key) {
            if (isset($changes[$key])) {
                $current[$key] = array_merge($current[$key] ?? [], $changes[$key]);
            }
        }
        foreach (['ai_default_tier', 'setup_completed'] as $key) {
            if (array_key_exists($key, $changes)) {
                $current[$key] = $changes[$key];
            }
        }

        $tenant->update(['settings' => $current]);

        return $this->view($tenant->fresh());
    }

    private function features(array $given): array
    {
        return collect(self::FEATURES)
            ->mapWithKeys(fn ($f) => [$f => (bool) ($given[$f] ?? false)])
            ->all();
    }
}
