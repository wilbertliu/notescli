#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

export TZ=UTC

VERSION="$(node -p "require('./package.json').version")"

rm -rf dist/darwin-arm64 dist/darwin-x64 release
mkdir -p dist/darwin-arm64 dist/darwin-x64 release

package_one() {
  local arch_dir="$1"
  local out_base="release/notescli-${VERSION}-${arch_dir}"

  # Stabilize tar/gzip output across machines (Homebrew needs a fixed sha256).
  # - Normalize mtime
  # - Disable macOS extended attribute metadata
  # - Use numeric owners (uid/gid 0) and omit user/group names
  touch -t 200001010000 "dist/${arch_dir}/notescli"
  COPYFILE_DISABLE=1 bsdtar --format ustar --uid 0 --gid 0 --uname "" --gname "" \
    -cf - -C "dist/${arch_dir}" notescli | gzip -n > "${out_base}.tar.gz"
  shasum -a 256 "${out_base}.tar.gz" > "${out_base}.sha256"
}

bun run build:bin:darwin-arm64
package_one darwin-arm64

bun run build:bin:darwin-x64
package_one darwin-x64

echo "Wrote:"
ls -1 release
