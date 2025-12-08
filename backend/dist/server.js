"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const prisma_1 = __importDefault(require("./config/prisma"));
const startServer = async () => {
    try {
        // Test database connection
        await prisma_1.default.$connect();
        console.log('✅ Database connected');
        // Start server
        app_1.default.listen(config_1.config.port, () => {
            console.log(`🚀 Server running on http://localhost:${config_1.config.port}`);
            console.log(`📝 Environment: ${config_1.config.nodeEnv}`);
            console.log(`🔐 CORS Origin: ${config_1.config.corsOrigin}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down gracefully...');
    await prisma_1.default.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n👋 Shutting down gracefully...');
    await prisma_1.default.$disconnect();
    process.exit(0);
});
startServer();
//# sourceMappingURL=server.js.map