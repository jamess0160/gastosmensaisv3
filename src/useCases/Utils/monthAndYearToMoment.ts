import moment from "moment";

export function monthAndYearToMoment(month: number, year: number) {
    return moment().startOf("month").set("month", month).set("year", year)
}