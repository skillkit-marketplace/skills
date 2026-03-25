import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { log } from '@clack/prompts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'))

export async function checkForUpdates() {
  if (process.env.npm_execpath?.includes('npx')) return

  try {
    const res = await fetch(`https://registry.npmjs.org/@rfxlamia/sm/latest`)
    if (!res.ok) return
    const { version: latest } = await res.json()

    if (latest !== pkg.version) {
      log.warn(`Update available: ${pkg.version} → ${latest}`)
      log.info(`Run: npx @rfxlamia/sm@latest`)
    }
  } catch {}
}

export function isNpxExecution() {
  return process.env.npm_execpath?.includes('npx') ?? false
}
