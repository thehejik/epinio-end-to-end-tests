#!/bin/bash

set -ex

# Patch the epinio-ui deployment with latest dev image
# The image is building by https://github.com/epinio/ui-backend/actions/workflows/release-next.yml
kubectl set image -n epinio deployment/epinio-ui epinio-ui=ghcr.io/epinio/epinio-ui:latest-next
