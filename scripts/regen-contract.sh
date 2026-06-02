#!/usr/bin/env bash
set -euo pipefail
# Emit OpenAPI from the API, then generate the TS client. Wire to your tooling
# (e.g. scramble/dedoc or l5-swagger for the spec; openapi-typescript for the client).
( cd api && php artisan openapi:generate --output=../packages/contracts-openapi/openapi.yaml )
( cd app && npm run gen:client )
