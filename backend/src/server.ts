import app from "./app";
import { connectDB, disconnectDB } from "./config/database";
import { env } from "./config/env";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Plutus Media Backend running on port ${env.PORT}`);
      console.log(`🌐 Health check: http://localhost:${env.PORT}/health`);
    });

    process.on("SIGTERM", () => {
      server.close(async () => {
        await disconnectDB();
        console.log("🔒 Server closed");
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
