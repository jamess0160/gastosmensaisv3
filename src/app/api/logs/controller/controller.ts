import { Log } from "./sections/POST/log";

class LogsController {
    public readonly Log = new Log()
}

export const logsController = new LogsController()