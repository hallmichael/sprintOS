<?php

namespace App\Shared\Http;

use Illuminate\Routing\Controller as BaseController;

/** Base controller. Keep controllers thin: validate -> call action/service -> return resource. */
abstract class Controller extends BaseController {}
