<?php

namespace App\Modules\Identity\Domain\Actions;

use App\Modules\Identity\Domain\Models\Membership;

/**
 * Ensures a user has a membership in the given org. Idempotent: if the
 * membership already exists it is returned unchanged (the existing role is
 * preserved). See ADR 0005.
 */
final class ProvisionMembershipAction
{
    public function execute(string $userId, string $tenantId, string $role = 'member'): Membership
    {
        return Membership::firstOrCreate(
            ['tenant_id' => $tenantId, 'user_id' => $userId],
            ['role' => $role],
        );
    }
}
