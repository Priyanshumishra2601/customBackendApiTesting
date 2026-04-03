import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDb();
  const app = createApp();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Finance dashboard API listening on port ${PORT}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Server failed to start:", error);
  process.exit(1);
});

