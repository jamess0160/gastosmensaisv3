import { banks, baseexpenses, defaultexpenses, destinys, expensedestinys, fixedexpenses, installmentexpenses } from "@prisma/client"
import { BaseSection } from "@/base/baseSection";
import { BaseExpensesUseCases } from "./BaseExpensesUseCases"
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases";
import { AutoGetExpenseType } from "../Utils/getExpensePrice";

export class GenerateFullBaseExpenseChild extends BaseSection<BaseExpensesUseCases> {

    async run(month: number, year: number, IdUser: number, options?: GenerateFullBaseExpenseChildOptions) {

        let baseExpenses = await this.getFullBaseExpense(month, year, IdUser, options)

        return baseExpenses
            .map<FullBaseExpenseChild>((item) => {
                return {
                    ...item,
                    child: item.defaultexpenses || item.fixedexpenses.at(0) || item.installmentexpenses.at(0),
                    defaultexpenses: undefined,
                    fixedexpenses: undefined,
                    installmentexpenses: undefined,
                }
            })
            .sort(this.sortExpensesDescription)
            .sort(this.sortExpensesDates)
            .sort(this.sortExpensesTypes)
    }

    private getFullBaseExpense(month: number, year: number, IdUser: number, options?: GenerateFullBaseExpenseChildOptions): Promise<FullBaseExpense[]> {
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
                                        EndDate: null,
                                        baseexpenses: {
                                            EntryDate: {
                                                lte: dateFilter.gte
                                            }
                                        }
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
                                ExpectedDate: {
                                    gte: dateFilter.gte
                                },
                                StartDate: {
                                    lt: dateFilter.lt
                                }
                            }
                        }
                    }
                ],
                IdBank: options?.IdBank || undefined,
                IdExpenseCategory: options?.IdExpenseCategory || undefined,
                expensedestinys: {
                    every: {
                        IdDestiny: options?.IdDestiny || undefined,

                    }
                },
                IdUser: IdUser
            },
            include: {
                defaultexpenses: true,
                banks: true,
                expensedestinys: {
                    include: {
                        destinys: true
                    }
                },
                fixedexpenses: {
                    where: {
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
                },
                installmentexpenses: {
                    where: {
                        ExpectedDate: {
                            gte: dateFilter.gte
                        },
                        StartDate: {
                            lt: dateFilter.lt
                        }
                    }
                },
            }
        })
    }

    private sortExpensesTypes(a: FullBaseExpenseChild, b: FullBaseExpenseChild) {
        let values: Record<AutoGetExpenseType, number> = {
            none: 0,
            default: 1,
            installment: 2,
            fixed: 3,
        }

        let aType = clientUtilsUseCases.GetExpenseType.auto(a)
        let bType = clientUtilsUseCases.GetExpenseType.auto(b)

        let aValue = values[aType]
        let bValue = values[bType]

        return bValue - aValue
    }

    private sortExpensesDates(a: FullBaseExpenseChild, b: FullBaseExpenseChild) {

        if (!clientUtilsUseCases.GetExpenseType.isDefault(a) || !clientUtilsUseCases.GetExpenseType.isDefault(b)) {
            return 0
        }

        return new Date(a.child.ExpenseDate).getTime() - new Date(b.child.ExpenseDate).getTime()
    }

    private sortExpensesDescription(a: FullBaseExpenseChild, b: FullBaseExpenseChild) {
        let aType = clientUtilsUseCases.GetExpenseType.auto(a)
        let bType = clientUtilsUseCases.GetExpenseType.auto(b)

        if (aType === "default" || bType === "default") {
            return 0
        }

        return a.Description.localeCompare(b.Description)
    }
}

//#region Interfaces / Types 

export interface GenerateFullBaseExpenseChildOptions {
    IdBank?: number
    IdDestiny?: number
    IdExpenseCategory?: number
}

interface FullBaseExpense extends baseexpenses {
    expensedestinys: ExpenseDestinys[]
    banks: banks | null
    defaultexpenses: defaultexpenses | null
    fixedexpenses: fixedexpenses[]
    installmentexpenses: installmentexpenses[]
}

export interface FullBaseExpenseChild extends baseexpenses {
    expensedestinys: ExpenseDestinys[]
    banks: banks | null
    splitCount?: number
    obs?: string
    child: defaultexpenses | fixedexpenses | installmentexpenses | undefined
}

interface ExpenseDestinys extends expensedestinys {
    destinys: destinys
}

export interface DefaultExpenseChild extends FullBaseExpenseChild {
    child: defaultexpenses
}

export interface FixedExpenseChild extends FullBaseExpenseChild {
    child: fixedexpenses
}

export interface InstallmentExpenseChild extends FullBaseExpenseChild {
    child: installmentexpenses
}

//#endregion