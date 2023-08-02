import {DateManager} from "../utils/date-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {OperationsWordType} from "../types/operations-word.type";
import {GetOperationsType} from "../types/get-operations.type";
import {DefaultResponseType} from "../types/default-response.type";
import {TypeWordType} from "../types/type-word.type";
import Chart from "chart.js/auto";


export class Grafika {
    readonly ctx: HTMLCanvasElement | null;
    readonly ctx1: HTMLCanvasElement | null;
    private myLineChart: any = [];
    private myLineChart1: any = [];
    readonly todayDay: string;
    readonly todayButton: HTMLElement | null;
    readonly weekButton: HTMLElement | null;
    readonly monthButton: HTMLElement | null;
    readonly yearButton: HTMLElement | null;
    readonly allButton: HTMLElement | null;
    readonly intervalButton: HTMLElement | null;
    readonly dateFrom: HTMLInputElement | null;
    readonly dateTo: HTMLInputElement | null;

    constructor() {
        this.ctx = document.getElementById('myChart') as HTMLCanvasElement;
        this.ctx1 = document.getElementById('myChart1') as HTMLCanvasElement;

        this.todayDay = new DateManager().init();

        this.init('?period=interval&dateFrom=' + this.todayDay + '&dateTo=' + this.todayDay);

        this.todayButton = document.getElementById('today-button');
        this.weekButton = document.getElementById('week-button');
        this.monthButton = document.getElementById('month-button');
        this.yearButton = document.getElementById('year-button');
        this.allButton = document.getElementById('all-button');
        this.intervalButton = document.getElementById('interval-button');

        this.dateFrom = document.getElementById('date-from') as HTMLInputElement;
        this.dateTo = document.getElementById('date-to') as HTMLInputElement;

        const that: Grafika = this;

        if (this.todayButton) {
            this.todayButton.onclick = function () {
                that.getWeekInfo.call(that, <HTMLElement>this, OperationsWordType.today);
            }
        }

        if (this.weekButton) {
            this.weekButton.onclick = function () {
                that.getWeekInfo.call(that, <HTMLElement>this, OperationsWordType.week);
            }
        }

        if (this.monthButton) {
            this.monthButton.onclick = function () {
                that.getWeekInfo.call(that, <HTMLElement>this, OperationsWordType.month);
            }
        }

        if (this.yearButton) {
            this.yearButton.onclick = function () {
                that.getWeekInfo.call(that, <HTMLElement>this, OperationsWordType.year);
            }
        }

        if (this.allButton) {
            this.allButton.onclick = function () {
                that.getWeekInfo.call(that, <HTMLElement>this, OperationsWordType.all);
            }
        }

        if (this.intervalButton) {
            this.intervalButton.onclick = function () {
                that.getWeekInfo.call(that, <HTMLElement>this, OperationsWordType.interval);
            }
        }

    }

    private chart(arrayIncomeCategory: Array<string>, arrayIncomeAmount: Array<number>, arrayExpensesCategory: Array<string>, arrayExpensesAmount: Array<number>): void {
        if (!this.ctx || !this.ctx1) return;
         this.myLineChart = new Chart(this.ctx, {
            type: 'pie',
            data: {
                labels: arrayIncomeCategory,
                datasets: [{
                    label: '# of Votes',
                    data: arrayIncomeAmount,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },

        });

        this.myLineChart1 = new Chart(this.ctx1, {
            type: 'pie',
            data: {
                labels: arrayExpensesCategory,
                datasets: [{
                    label: '# of Votes',
                    data: arrayExpensesAmount,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        });
    }

    private async init(operation: string): Promise<void> {
        try {
            const result: GetOperationsType[] | [] | DefaultResponseType = await CustomHttp.request(config.hostOperations + operation);
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

                const allExpensesItem: GetOperationsType[] = (result as GetOperationsType[]).filter((item: GetOperationsType) => {
                    return item.type === TypeWordType.expense;
                });

                const allExpensesItemCategory: Array<string> = allExpensesItem.map((item: GetOperationsType) => {
                    return item.category;
                });

                const allExpensesItemAmount: Array<number> = allExpensesItem.map((item: GetOperationsType) => {
                    return item.amount;
                });

                const allIncomeItem: GetOperationsType[] = (result as GetOperationsType[]).filter((item: GetOperationsType) => {
                    return item.type === TypeWordType.income;
                });

                const allIncomeItemCategory: Array<string> = allIncomeItem.map((item: GetOperationsType) => {
                    return item.category;
                });

                const allIncomeItemAmount: Array<number> = allIncomeItem.map((item: GetOperationsType) => {
                    return item.amount;
                });

                this.chart(allIncomeItemCategory, allIncomeItemAmount, allExpensesItemCategory, allExpensesItemAmount);

            }

        } catch (error) {
            console.log(error);
        }

    }

    private getWeekInfo(button: HTMLElement, nameOfButton: string): void {
        const allButtonForCall: HTMLCollection | null = document.getElementsByClassName('btn-common');

        if (allButtonForCall) {
            for (let i = 0; allButtonForCall.length > i; i++) {
                allButtonForCall[i].className = 'btn btn-common btn-outline-secondary fw-semibold';
            }
        }

        button.className = "btn btn-common btn-secondary fw-semibold";

        if (nameOfButton === OperationsWordType.today) {
            this.init('?period=interval&dateFrom=' + this.todayDay + '&dateTo=' + this.todayDay);
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }

        if (nameOfButton === OperationsWordType.week) {
            this.init('?period=week');
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }

        if (nameOfButton === OperationsWordType.month) {
            this.init('?period=month');
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }


        if (nameOfButton === OperationsWordType.year) {
            this.init('?period=year');
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }

        if (nameOfButton === OperationsWordType.all) {
            this.init('?period=all');
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }

        if (nameOfButton === OperationsWordType.interval) {
            this.init('?period=interval&dateFrom='+ this.dateFrom!.value + '&dateTo=' + this.dateTo!.value);
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }

    }

}
