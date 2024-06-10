import { baseexpenses, defaultexpenses, fixedexpenses, installmentexpenses } from "@prisma/client"
import { BaseSection } from "@/base/baseSection";
import { BaseExpensesUseCases } from "./BaseExpensesUseCases"
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases";

export class GenerateFullBaseExpenseChild extends BaseSection<BaseExpensesUseCases> {

    async run(month: number, year: number, options?: GenerateFullBaseExpenseChildOptions) {

        let baseExpenses = await this.getFullBaseExpense(month, year, options)

        return baseExpenses.map<FullBaseExpenseChild>((item) => {
            return Object.assign(item, {
                child: item.defaultexpenses || item.fixedexpenses.at(0) || item.installmentexpenses.at(0),
                defaultexpenses: undefined,
                fixedexpenses: undefined,
                installmentexpenses: undefined,
            })
        })
    }

    private getFullBaseExpense(month: number, year: number, options?: GenerateFullBaseExpenseChildOptions): Promise<FullBaseExpense[]> {
        let dateFilter = {
            gte: clientUtilsUseCases.monthAndYearToMoment(month, year).toDate(),
            lt: clientUtilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
        }

        return this.instance.prisma.baseexpenses.findMany({
            where: {
                OR: [
                    {
                        EntryDate: dateFilter
                    },
                    {
                        fixedexpenses: {
                            some: {
                                OR: [
                                    {
                                        EndDate: null
                                    },
                                    {
                                        EndDate: {
                                            gte: dateFilter.gte
                                        },
                                    }
                                ]
                            }
                        }
                    },
                    {
                        installmentexpenses: {
                            some: {
                                ExpectedDate: dateFilter
                            }
                        }
                    }
                ],
                IdBank: options?.IdBank || undefined,
                IdExpenseCategory: options?.IdExpenseCategory || undefined,
                IdDestiny: options?.IdDestiny || undefined,
            },
            include: {
                defaultexpenses: true,
                fixedexpenses: {
                    where: {
                        OR: [
                            {
                                EndDate: null
                            },
                            {
                                StartDate: {
                                    gte: dateFilter.gte
                                }
                            },
                            {
                                EndDate: {
                                    lte: dateFilter.lt
                                }
                            }
                        ]
                    }
                },
                installmentexpenses: {
                    where: {
                        ExpectedDate: dateFilter
                    }
                },
            }
        })
    }
}

//#region Interfaces / Types 

interface GenerateFullBaseExpenseChildOptions {
    IdBank?: number
    IdDestiny?: number
    IdExpenseCategory?: number
}

interface FullBaseExpense extends baseexpenses {
    defaultexpenses: defaultexpenses | null
    fixedexpenses: fixedexpenses[]
    installmentexpenses: installmentexpenses[]
}

export interface FullBaseExpenseChild extends baseexpenses {
    child: defaultexpenses | fixedexpenses | installmentexpenses | undefined
}

export interface DefaultExpenseChild extends baseexpenses {
    child: defaultexpenses
}

export interface FixedExpenseChild extends baseexpenses {
    child: fixedexpenses
}

export interface InstallmentExpenseChild extends baseexpenses {
    child: installmentexpenses
}

//#endregion