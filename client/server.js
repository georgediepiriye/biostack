const express = require("express");
const next = require("next");
const apiApp = require("../dist/server/app").default;
const { connectDatabase } = require("../dist/server/config/database");

async function start() {
  await connectDatabase();

  const nextApp = next({ dev: false, dir: __dirname });
  await nextApp.prepare();
  const handleNext = nextApp.getRequestHandler();

  const app = express();
  app.use(apiApp);
  app.all("*", (request, response) => handleNext(request, response));

  const port = Number(process.env.PORT || 3000);
  app.listen(port, "0.0.0.0", () => console.log(`BioStack listening on :${port}`));
}

start().catch((error) => {
  console.error("Unable to start BioStack", error);
  process.exit(1);
});
