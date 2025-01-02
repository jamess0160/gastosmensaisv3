import { logsController } from "./controller/controller";

export const POST = logsController.Log.run.bind(logsController.Log)