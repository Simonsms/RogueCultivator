import app from './app'
import { config } from './config'
import prisma from './config/prisma'

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected')

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`)
      console.log(`📝 Environment: ${config.nodeEnv}`)
      console.log(`🔐 CORS Origin: ${config.corsOrigin}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

startServer()
