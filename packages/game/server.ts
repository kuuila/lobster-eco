// Socket.io 服务端入口
// 在 Next.js 中需要使用自定义服务器或 API Routes

import { createServer } from 'http'
import next from 'next'
import { initSocketServer } from './socket/server'

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)
  
  // 初始化 Socket.io
  initSocketServer(httpServer)
  
  // Socket.io 服务端口（与 Next.js 分开）
  const socketPort = parseInt(process.env.SOCKET_PORT || '3001', 10)
  
  httpServer.listen(port, () => {
    console.log(`> Next.js ready on http://${hostname}:${port}`)
    console.log(`> Socket.io ready on http://${hostname}:${socketPort}`)
  })
})
