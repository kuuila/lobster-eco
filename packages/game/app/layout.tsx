import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '🦞 龙虾对决',
  description: '深海争霸 · 策略对决',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
          html, body { height: 100%; overflow: hidden; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(180deg, #0c1929 0%, #0f2942 50%, #1a3a5c 100%); color: #ffffff; user-select: none; }
          :root { --primary: #dc2626; --secondary: #f97316; --accent: #fbbf24; --ocean: #0ea5e9; --gold: #fbbf24; --safe-bottom: env(safe-area-inset-bottom, 0px); }
          @keyframes popupAnim { 0% { transform: scale(0.5); opacity: 0; } 20% { transform: scale(1.1); opacity: 1; } 70% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.8); opacity: 0; } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}