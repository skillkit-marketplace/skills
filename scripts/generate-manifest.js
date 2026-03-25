#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const skills = readdirSync(join(root, 'skills'))
  .filter(d => !d.startsWith('.'))
  .map(name => {
    let description = ''
    let category = 'uncategorized'
    try {
      const content = readFileSync(join(root, 'skills', name, 'SKILL.md'), 'utf8')
      const descMatch = content.match(/^description:\s*[>|]?\s*\n?(.*)/m)
      if (descMatch) description = descMatch[1].trim().replace(/^["']|["']$/g, '')
      const catMatch = content.match(/^category:\s*(\w+)/m)
      if (catMatch) category = catMatch[1].trim()
    } catch {}
    return { name, description, category, type: 'skill', path: `skills/${name}` }
  })

const agents = readdirSync(join(root, 'agents'))
  .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
  .map(file => {
    const name = file.replace(/\.mdx?$/, '')
    let description = ''
    try {
      const content = readFileSync(join(root, 'agents', file), 'utf8')
      const match = content.match(/description:\s*"?([^"\n]+)"?/)
      if (match) description = match[1].trim()
    } catch {}
    return { name, description, type: 'agent', path: `agents/${file}` }
  })

const manifest = { skills, agents }
writeFileSync(join(root, 'installer', 'skills-manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`Generated manifest: ${skills.length} skills, ${agents.length} agents`)
