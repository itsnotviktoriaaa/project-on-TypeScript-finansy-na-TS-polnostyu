import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {DateManager} from "../utils/date-manager";
import {EditIncomeExpenses} from "./editIncomeExpenses";
import {CreateIncomeExpenses} from "./createIncomeExpenses";
import {Balance} from "./balance";
import {GetOperationsType} from "../types/get-operations.type";
import {DefaultResponseType} from "../types/default-response.type";
import {OperationsWordType} from "../types/operations-word.type";
import {CreateWordType} from "../types/create-word.type";

export class IncomeExpenses {
    private operations: GetOperationsType[] | [] = [];
    readonly tableTbody: HTMLElement | null;
    readonly todayDay: string;
    readonly dateFrom: HTMLInputElement | null;
    readonly dateTo: HTMLInputElement | null;
    readonly popForDelete: HTMLElement | null;
    readonly doDelete: HTMLElement | null;
    readonly todayButton: HTMLElement | null;
    readonly weekButton: HTMLElement | null;
    readonly monthButton: HTMLElement | null;
    readonly yearButton: HTMLElement | null;
    readonly allButton: HTMLElement | null;
    readonly intervalButton: HTMLElement | null;
    readonly doNotDelete: HTMLElement | null;
    readonly createIncome: HTMLElement | null;
    readonly createExpenses: HTMLElement | null;

    constructor() {

        this.tableTbody = document.getElementById('table-tbody');

        this.todayDay = new DateManager().init();

        this.init('?period=interval&dateFrom=' + this.todayDay + '&dateTo=' + this.todayDay);

        this.todayButton = document.getElementById('today-button');
        this.weekButton = document.getElementById('week-button');
        this.monthButton = document.getElementById('month-button');
        this.yearButton = document.getElementById('year-button');
        this.allButton = document.getElementById('all-button');
        this.intervalButton = document.getElementById('interval-button');

        const that: IncomeExpenses = this;

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

        this.popForDelete = document.getElementById('pop-for-delete');
        this.doNotDelete = document.getElementById('do-not-delete');

        if (this.doNotDelete) {
            this.doNotDelete.onclick = function () {
                that.hidePopForDelete();
            }
        }

        this.doDelete = document.getElementById('do-delete');

        this.dateFrom = document.getElementById('date-from') as HTMLInputElement;
        this.dateTo = document.getElementById('date-to') as HTMLInputElement;

        this.createIncome = document.getElementById('create-income');

        if (this.createIncome) {
            this.createIncome.onclick = function () {
                location.href = '#/createIncomeExpenses';
                new CreateIncomeExpenses(CreateWordType.income);
            }
        }


        this.createExpenses = document.getElementById('create-expenses');

        if (this.createExpenses) {
            this.createExpenses.onclick = function () {
                location.href = '#/createIncomeExpenses';
                new CreateIncomeExpenses(CreateWordType.expenses);
            }
        }

    }

    private async init(operation: string): Promise<void> {
        try {
            const result: GetOperationsType[] | [] | DefaultResponseType = await CustomHttp.request(config.hostOperations + operation);
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

                this.operations = (result as GetOperationsType[] | []);

                let numberOperation: number = 1;

                this.operations.forEach((item: GetOperationsType) => {

                    const tr: HTMLTableRowElement = document.createElement('tr');
                    tr.setAttribute('data-id', item.id.toString());

                    const getId: string | null = tr.getAttribute('data-id');

                    const th: HTMLTableCellElement = document.createElement('th');
                    th.setAttribute('scope', 'row');

                    th.innerText = String(numberOperation++);


                    const td: HTMLTableCellElement = document.createElement('td');
                    if (item.type === 'income') {
                        td.innerText = 'доход';
                        td.className = 'text-success';
                    } else if (item.type === 'expense') {
                        td.innerText = 'расход';
                        td.className = 'text-danger';
                    }

                    const tdNameCategory: HTMLTableCellElement = document.createElement('td');
                    tdNameCategory.innerText = item.category;

                    const tdAmount: HTMLTableCellElement = document.createElement('td');
                    tdAmount.innerText = String(item.amount);

                    const tdDate: HTMLTableCellElement = document.createElement('td');
                    tdDate.innerText = item.date;

                    const tdComment: HTMLTableCellElement = document.createElement('td');
                    tdComment.innerText = item.comment;
                    tdComment.className = 'td-short';


                    const tdButtons: HTMLTableCellElement = document.createElement('td');
                    const imgButtonDelete: HTMLImageElement = document.createElement('img');
                    imgButtonDelete.setAttribute('role', 'button');
                    imgButtonDelete.setAttribute('src', 'images/trash.png');
                    imgButtonDelete.setAttribute('alt', 'Удалить');
                    imgButtonDelete.className = 'img-button-delete';

                    const that: IncomeExpenses = this;

                    if (getId) {
                        imgButtonDelete.onclick = function () {
                            that.showPopForDelete.call(that, getId);
                        }
                    }

                    const imgButtonEdit: HTMLImageElement = document.createElement('img');
                    imgButtonEdit.setAttribute('role', 'button');
                    imgButtonEdit.setAttribute('src', 'images/pen.png');
                    imgButtonEdit.setAttribute('alt', 'Редактировать');
                    imgButtonEdit.className = 'img-button-edit';

                    imgButtonEdit.onclick = function () {

                        location.href = '#/editIncomeExpenses';
                        if (getId) {
                            new EditIncomeExpenses(getId);
                        }
                    }

                    tdButtons.appendChild(imgButtonDelete);
                    tdButtons.appendChild(imgButtonEdit);

                    tr.appendChild(th);
                    tr.appendChild(td);
                    tr.appendChild(tdNameCategory);
                    tr.appendChild(tdAmount);
                    tr.appendChild(tdDate);
                    tr.appendChild(tdComment);
                    tr.appendChild(tdButtons);

                    if (this.tableTbody) {
                        this.tableTbody.appendChild(tr);
                    }

                });


            }

        } catch (error) {
            console.log(error);
        }

    }

    private getWeekInfo(button: HTMLElement, nameOfButton: string): void {
        const allButtonForCall: HTMLCollection = document.getElementsByClassName('btn-common');

        for (let i = 0; allButtonForCall.length > i; i++) {
            allButtonForCall[i].className = 'btn btn-common btn-outline-secondary fw-semibold';
        }

        button.className = "btn btn-common btn-secondary fw-semibold";

        if (!this.tableTbody) return;

        if (nameOfButton === 'сегодня') {
            this.tableTbody.innerHTML = '';
            this.init('?period=interval&dateFrom=' + this.todayDay + '&dateTo=' + this.todayDay);
        }

        if (nameOfButton === 'неделя') {
            this.tableTbody.innerHTML = '';
            this.init('?period=week');
        }

        if (nameOfButton === 'месяц') {
            this.tableTbody.innerHTML = '';
            this.init('?period=month');
        }


        if (nameOfButton === 'год') {
            this.tableTbody.innerHTML = '';
            this.init('?period=year');
        }

        if (nameOfButton === 'все') {
            this.tableTbody.innerHTML = '';
            this.init('?period=all');
        }

        if (nameOfButton === 'интервал') {
            this.tableTbody.innerHTML = '';
            this.init('?period=interval&dateFrom=' + this.dateFrom!.value + '&dateTo=' + this.dateTo!.value);
        }

    }

    private showPopForDelete(id: string): void {
        const that: IncomeExpenses = this;
        if (this.popForDelete) {
            this.popForDelete.className = 'modal d-flex justify-content-center align-items-center';
        }

        if (this.doDelete) {
            this.doDelete.onclick = function () {
                that.doDeleteItem(id);
            }
        }

    }

    private hidePopForDelete(): void {
        if (this.popForDelete) {
            this.popForDelete.className = 'modal d-none justify-content-center align-items-center';
        }
    }

    private async doDeleteItem(id: string): Promise<void> {
        try {
            const result: DefaultResponseType = await CustomHttp.request(config.hostOperations + '/' + id, 'DELETE');
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                location.href = '#/incomeExpenses';
                new Balance();

            }

        } catch (error) {
            console.log(error);
        }
    }


}
