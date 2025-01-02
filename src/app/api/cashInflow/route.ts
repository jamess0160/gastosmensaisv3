import { cashInFlowController } from "./controller/controller";

export const POST = cashInFlowController.Create.run.bind(cashInFlowController.Create)

export const PUT = cashInFlowController.Update.run.bind(cashInFlowController.Update)

export const DELETE = cashInFlowController.Remove.run.bind(cashInFlowController.Remove)