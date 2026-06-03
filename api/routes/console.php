<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Generate + charge invoices for the prior month on the 1st (billing cycle).
Schedule::command('billing:run-cycle --charge --month='.now()->subMonth()->format('Y-m'))
    ->monthlyOn(1, '02:00')
    ->withoutOverlapping();
