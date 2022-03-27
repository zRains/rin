import express from 'express'
import compression from 'compression'
import { createPageRenderer } from 'vite-plugin-ssr'
import type { ViteDevServer } from 'vite'

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`

async function startServer() {
  const app = express()
  const port = process.env.PORT || 3000
  let viteDevServer!: ViteDevServer

  app.use(compression())

  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    const vite = await import('vite')
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: 'ssr' }
    })
    app.use(viteDevServer.middlewares)
  }

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root })

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const pageContextInit = {
      url
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType).send(body)
    return next()
  })

  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

startServer()
