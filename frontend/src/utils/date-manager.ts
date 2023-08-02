export class DateManager {
    readonly todayDate: Date;
    readonly todayDateDay: number;
    readonly todayDateMonth: number;
    readonly todayDateYear: number;
    private todayNewDate: string | null = null;

    constructor() {
        this.todayDate = new Date();
        this.todayDateDay = this.todayDate.getDate();
        this.todayDateMonth = this.todayDate.getMonth();
        this.todayDateYear = this.todayDate.getFullYear();
    }

    public init(): string {
        this.todayNewDate = this.todayDateYear + '-' + ("0" + (this.todayDateMonth + 1)).slice(-2) + '-' + ("0" + this.todayDateDay).slice(-2);
        return this.todayNewDate;
    }

}