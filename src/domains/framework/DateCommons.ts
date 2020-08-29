import moment from "moment";

export default class DateCommons {

    public static parseDate(date: number): string {
        return moment(date).format("MMMM Do YYYY, hh:mm");
    }

}