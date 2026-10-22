#!/usr/bin/env bash

set -euo pipefail

aws \
  --profile ledger-local \
  --endpoint-url=http://localhost:4566 \
  --region us-west-2 \
  "$@"
  