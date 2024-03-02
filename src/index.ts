import { runDB } from "./repositories/db";
import { app, port } from "./app";

const startApp = async () => {
  await runDB();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
