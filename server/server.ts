import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

connectDatabase()
  .then(() => app.listen(env.port, () => console.log(`BioStack API listening on :${env.port}`)))
  .catch((error) => {
    console.error("Unable to connect to MongoDB", error);
    process.exit(1);
  });
