import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import { seedInitialServicesIfEmpty } from './controllers/service.controller.js';

const startServer = async () => {
  await connectDB();
  await seedInitialServicesIfEmpty();

  const PORT = config.port;

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle generic SIGTERM
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
};

startServer();


