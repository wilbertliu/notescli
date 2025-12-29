import { spawnSync } from 'node:child_process'

export function runOsaScript(script: string, args: string[]): string {
  const result = spawnSync('osascript', ['-e', script, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    const message = result.stderr.trim() || `osascript exited with ${result.status}`
    const error = new Error(message)
    if (typeof result.status === 'number') {
      ;(error as { code?: number }).code = result.status
    }
    throw error
  }

  return result.stdout
}
