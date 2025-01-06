import { banks, baseexpenses, defaultexpenses, destinys, expensedestinys, fixedexpenses, installmentexpenses, nfeexpenses, nfeitems } from "@prisma/client"
import { BaseSection } from "@/base/baseSection";
import { BaseExpensesUseCases } from "./BaseExpensesUseCases"
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { AutoGetExpenseType } from "../Utils/ClientUtilsUseCases/sections/getExpensePrice";

export class GenerateFullBaseExpenseChild extends BaseSection<BaseExpensesUseCases> {

    async run(month: number, year: number, IdUser: number, options?: GenerateFullBaseExpenseChildOptions) {

        let baseExpenses = await this.getFullBaseExpense(month, year, IdUser, options)

        let result = baseExpenses
            .map<FullBaseExpenseChild>((item) => {
                return {
                    ...item,
                    child: item.defaultexpenses || item.nfeexpenses || item.fixedexpenses.at(0) || item.installmentexpenses.at(0),
                    defaultexpenses: undefined,
                    nfeexpenses: undefined,
                    fixedexpenses: undefined,
                    installmentexpenses: undefined,
                }
            })
            .sort(this.sortExpensesDescription)
            .sort(this.sortExpensesDates)
            .sort(this.sortExpensesTypes)

        if (options?.sortDestinys) {
            return result.sort(this.sortDestinysQuantity)
        }

        return result
    }

    private getFullBaseExpense(month: number, year: number, IdUser: number, options?: GenerateFullBaseExpenseChildOptions): Promise<FullBaseExpense[]> {
        let dateFilter = {
            gte: clientUtilsUseCases.monthAndYearToMoment(month, year).subtract(3, "hours").toDate(),
            lt: clientUtilsUseCases.monthAndYearToMoment(month, year).subtract(3, "hours").add(1, 'month').toDate(),
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
                    some: {
                        IdDestiny: options?.IdDestiny || undefined,
                    }
                },
                IdUser: IdUser
            },
            include: {
                defaultexpenses: true,
                nfeexpenses: {
                    include: {
                        nfeitems: true
                    }
                },
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

    private sortExpensesDescription(a: FullBaseExpenseChild, b: FullBaseExpenseChild) {
        let aType = clientUtilsUseCases.GetExpenseType.auto(a)
        let bType = clientUtilsUseCases.GetExpenseType.auto(b)

        if (aType === "default" || bType === "default") {
            return 0
        }

        return a.Description.localeCompare(b.Description)
    }

    private sortExpensesDates(a: FullBaseExpenseChild, b: FullBaseExpenseChild) {

        if (!clientUtilsUseCases.GetExpenseType.isDefault(a) || !clientUtilsUseCases.GetExpenseType.isDefault(b)) {
            return 0
        }

        return new Date(a.child.ExpenseDate).getTime() - new Date(b.child.ExpenseDate).getTime()
    }

    private sortExpensesTypes(a: FullBaseExpenseChild, b: FullBaseExpenseChild) {
        let values: Record<AutoGetExpenseType, number> = {
            none: 0,
            default: 1,
            nfe: 1,
            installment: 2,
            fixed: 3,
        }

        let aType = clientUtilsUseCases.GetExpenseType.auto(a)
        let bType = clientUtilsUseCases.GetExpenseType.auto(b)

        let aValue = values[aType]
        let bValue = values[bType]

        return bValue - aValue
    }

    private sortDestinysQuantity(a: FullBaseExpenseChild, b: FullBaseExpenseChild) {
        return b.expensedestinys.length - a.expensedestinys.length
    }
}

//#region Interfaces / Types 

export interface GenerateFullBaseExpenseChildOptions {
    IdBank?: number
    IdDestiny?: number
    IdExpenseCategory?: number
    sortDestinys?: boolean
}

interface FullBaseExpense extends baseexpenses {
    expensedestinys: ExpenseDestinys[]
    banks: banks | null
    defaultexpenses: defaultexpenses | null
    nfeexpenses: nfeexpenses | null
    fixedexpenses: fixedexpenses[]
    installmentexpenses: installmentexpenses[]
}

interface NfeExpense extends nfeexpenses {
    nfeitems: nfeitems[]
}

export interface FullBaseExpenseChild extends baseexpenses {
    expensedestinys: ExpenseDestinys[]
    banks: banks | null
    child: defaultexpenses | fixedexpenses | installmentexpenses | nfeexpenses | undefined
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

export interface NfeExpenseChild extends FullBaseExpenseChild {
    child: NfeExpense
}

//#endregion