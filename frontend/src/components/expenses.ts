import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {EditExpenses} from "./editExpenses";
import {CategoryResponseType} from "../types/category-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Expenses {
    private expensesItems: CategoryResponseType[] = [];
    readonly popForDelete: HTMLElement | null;
    readonly doNotDelete: HTMLElement | null;
    readonly doDelete: HTMLElement | null;

    constructor() {
        const that: Expenses = this;
        this.popForDelete = document.getElementById('pop-for-delete');

        this.getExpenses();

        this.doNotDelete = document.getElementById('do-not-delete');

        if (this.doNotDelete) {
            this.doNotDelete.onclick = function () {
                that.hidePopForDelete();
            }
        }

        this.doDelete = document.getElementById('do-delete');

    }

    private async getExpenses(): Promise<void> {
        try {
            const result: CategoryResponseType[] | DefaultResponseType = await CustomHttp.request(config.hostExpenses);
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

                this.expensesItems = (result as CategoryResponseType[]);

                const that: Expenses = this;
                const categoryWrapper: Element = document.getElementsByClassName('category-wrapper')[0];
                const createExpensesPlus: HTMLElement | null = document.getElementById('create-expenses-plus');
                if (this.expensesItems && this.expensesItems.length > 0) {
                    this.expensesItems.forEach((item: CategoryResponseType) => {

                        const categoryElement: HTMLElement | null = document.createElement('div');
                        if (!categoryElement) return;
                        categoryElement.className = 'category border border-dark-subtle border-1 rounded-3 py-4 pe-5 ps-4';
                        categoryElement.setAttribute('data-id', item.id.toString());

                        const h2Element: HTMLElement | null = document.createElement('h2');
                        if (!h2Element) return;
                        h2Element.className = 'mb-3 fw-semibold';
                        h2Element.innerText = item.title;

                        const buttonsElement: HTMLElement | null = document.createElement('div');
                        if (!buttonsElement) return;
                        buttonsElement.className = 'd-flex gap-2';

                        const aElement: HTMLElement | null = document.createElement('a');
                        if (!aElement) return;
                        aElement.setAttribute('type', 'button');
                        aElement.className = 'btn btn-primary py-2 px-3';
                        aElement.innerText = 'Редактировать';

                        const buttonElement: HTMLElement | null = document.createElement('button');
                        if (!buttonElement) return;
                        buttonElement.className = 'btn btn-danger py-2 px-3';
                        buttonElement.innerText = 'Удалить';

                        buttonElement.onclick = function () {
                            that.showPopForDelete.call(that, <HTMLElement>this);
                        }

                        aElement.onclick = function () {
                            const parentElementFromA: HTMLElement | null = (this as HTMLElement).parentElement!.parentElement;

                            if(parentElementFromA) {
                                const idItemExpenses: string | null = parentElementFromA.getAttribute('data-id');

                                location.href = '#/editExpenses';
                                if (idItemExpenses) {
                                    new EditExpenses(idItemExpenses);
                                }
                            }
                        }

                        buttonsElement.appendChild(aElement);
                        buttonsElement.appendChild(buttonElement);

                        categoryElement.appendChild(h2Element);
                        categoryElement.appendChild(buttonsElement);

                        if (createExpensesPlus) {
                            categoryWrapper.insertBefore(categoryElement, createExpensesPlus);
                        }
                    });
                }


            }
        } catch (error) {
            console.log(error);
        }
    }

    private showPopForDelete(button: HTMLElement): void {
        const that: Expenses = this;
        if (this.popForDelete) {
            this.popForDelete.className = 'modal d-flex justify-content-center align-items-center';
        }

        const parentElementFromButton: HTMLElement | null = button.parentElement!.parentElement;

        if (parentElementFromButton) {
            const idItemExpenses: string | null = parentElementFromButton.getAttribute('data-id');

            if (this.doDelete && idItemExpenses) {
                this.doDelete.onclick = function () {
                    that.doDeleteItem(idItemExpenses);
                }
            }
        }

    }

    private hidePopForDelete(): void {
        if (this.popForDelete) {
            this.popForDelete.className = 'modal d-none justify-content-center align-items-center';
        }
    }

    private async doDeleteItem(idItemExpenses: string): Promise<void> {
        try {
            const result: DefaultResponseType = await CustomHttp.request(config.hostExpenses + '/' + idItemExpenses, "DELETE");

            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                location.href = '#/expenses';
            }

        } catch (error) {
            console.log(error);
        }

    }

}