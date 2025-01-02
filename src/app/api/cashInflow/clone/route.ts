import { cashInFlowController } from "../controller/controller";

export async function POST() {
    return cashInFlowController.Clone.run()
}