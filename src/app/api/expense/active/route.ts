import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { NextRequest, NextResponse } from "next/server";
import { expenseController } from "../controller/controller";

export const PUT = expenseController.UpdateActives.run