import fs from 'node:fs/promises'
import { spawn } from 'node:child_process'

const FRONTEND = 'http://127.0.0.1:5173'
const OUT = new URL('../docs/screenshots/final/', import.meta.url)

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function connectPage() {
  const chrome = spawn('google-chrome-stable', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--user-data-dir=/tmp/stages-pfe-visual-validation',
    'about:blank',
  ], { stdio: 'ignore' })

  for (let i = 0; i < 50; i += 1) {
    try {
      const tabs = await fetch('http://127.0.0.1:9222/json').then((res) => res.json())
      const tab = tabs.find((item) => item.type === 'page')
      if (tab?.webSocketDebuggerUrl) return { chrome, wsUrl: tab.webSocketDebuggerUrl }
    } catch {}
    await wait(200)
  }
  chrome.kill()
  throw new Error('Chrome DevTools endpoint unavailable')
}

function createCdp(wsUrl) {
  const ws = new WebSocket(wsUrl)
  let id = 0
  const pending = new Map()
  const listeners = new Map()

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message)
      pending.delete(message.id)
      return
    }
    if (message.method && listeners.has(message.method)) {
      for (const listener of listeners.get(message.method)) listener(message.params)
    }
  }

  const opened = new Promise((resolve) => { ws.onopen = resolve })

  return {
    async send(method, params = {}) {
      await opened
      const messageId = ++id
      ws.send(JSON.stringify({ id: messageId, method, params }))
      const response = await new Promise((resolve) => pending.set(messageId, resolve))
      if (response.error) throw new Error(`${method}: ${response.error.message}`)
      return response.result
    },
    once(method) {
      return new Promise((resolve) => {
        const listener = (params) => {
          listeners.set(method, (listeners.get(method) || []).filter((item) => item !== listener))
          resolve(params)
        }
        listeners.set(method, [...(listeners.get(method) || []), listener])
      })
    },
    close() { ws.close() },
  }
}

async function navigate(cdp, path) {
  const loaded = cdp.once('Page.loadEventFired')
  await cdp.send('Page.navigate', { url: `${FRONTEND}${path}` })
  await loaded
  await wait(1200)
}

async function setAuth(cdp, auth) {
  if (!auth) return
  await cdp.send('Runtime.evaluate', {
    expression: `localStorage.setItem('stages_pfe_token', ${JSON.stringify(auth.token)}); localStorage.setItem('stages_pfe_user', ${JSON.stringify(JSON.stringify(auth.user))});`,
  })
}

async function screenshot(cdp, name) {
  const result = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  await fs.writeFile(new URL(`${name}.png`, OUT), Buffer.from(result.data, 'base64'))
}

async function main() {
  const auth = JSON.parse(process.env.VISUAL_AUTH_JSON || '{}')
  await fs.mkdir(OUT, { recursive: true })
  const { chrome, wsUrl } = await connectPage()
  const cdp = createCdp(wsUrl)

  try {
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })

    await navigate(cdp, '/login')
    await cdp.send('Runtime.evaluate', { expression: 'localStorage.clear(); sessionStorage.clear();' })
    await navigate(cdp, '/login')
    await screenshot(cdp, '01-login')

    const pages = [
      ['student', '/student', '02-dashboard-etudiant'],
      ['company', '/company', '03-dashboard-entreprise'],
      ['supervisor', '/supervisor', '04-dashboard-encadrant'],
      ['admin', '/admin', '05-dashboard-admin'],
      ['student', '/student/stages', '06-stages'],
      ['student', '/student/applications', '07-candidatures'],
      ['student', '/student/pfe', '08-pfe'],
      ['student', '/student/ai', '09-ia-matching-cv'],
    ]

    for (const [role, path, name] of pages) {
      await navigate(cdp, '/login')
      await setAuth(cdp, auth[role])
      await navigate(cdp, path)
      await screenshot(cdp, name)
    }

    await navigate(cdp, '/login')
    await setAuth(cdp, auth.student)
    await navigate(cdp, '/student')
    await cdp.send('Runtime.evaluate', { expression: "document.querySelector('header button.relative')?.click()" })
    await wait(500)
    await screenshot(cdp, '10-notifications')
  } finally {
    cdp.close()
    chrome.kill()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
