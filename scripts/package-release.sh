#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

VERSION="$(node -p "require('./package.json').version")"

rm -rf dist/darwin-arm64 dist/darwin-x64 release
mkdir -p dist/darwin-arm64 dist/darwin-x64 release

bun run build:bin:darwin-arm64
tar -C dist/darwin-arm64 -czf "release/notescli-${VERSION}-darwin-arm64.tar.gz" notescli
shasum -a 256 "release/notescli-${VERSION}-darwin-arm64.tar.gz" > "release/notescli-${VERSION}-darwin-arm64.sha256"

bun run build:bin:darwin-x64
tar -C dist/darwin-x64 -czf "release/notescli-${VERSION}-darwin-x64.tar.gz" notescli
shasum -a 256 "release/notescli-${VERSION}-darwin-x64.tar.gz" > "release/notescli-${VERSION}-darwin-x64.sha256"

echo "Wrote:"
ls -1 release

