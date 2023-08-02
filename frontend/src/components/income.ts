import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {EditIncome} from "./editIncome";
import {CategoryResponseType} from "../types/category-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Income {
    private incomeItems: CategoryResponseType[] = [];
    readonly popForDelete: HTMLElement | null;
    readonly doNotDelete: HTMLElement | null;
    readonly doDelete: HTMLElement | null;


    constructor() {
        const that: Income = this;
        this.popForDelete = document.getElementById('pop-for-delete');

        this.getIncome();

        this.doNotDelete = document.getElementById('do-not-delete');

        if (this.doNotDelete) {
            this.doNotDelete.onclick = function () {
                that.hidePopForDelete();
            }
        }

        this.doDelete = document.getElementById('do-delete');

    }

    private async getIncome(): Promise<void> {
        try {
            const result: CategoryResponseType[] | DefaultResponseType = await CustomHttp.request(config.hostIncome);
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

                this.incomeItems = (result as CategoryResponseType[]);

                const that: Income = this;
                const categoryWrapper: Element = document.getElementsByClassName('category-wrapper')[0];
                const createIncomePlus: HTMLElement | null = document.getElementById('create-income-plus');
                if (this.incomeItems && this.incomeItems.length > 0) {
                    this.incomeItems.forEach((item: CategoryResponseType) => {

                        const categoryElement: HTMLElement | null = document.createElement('div');
                        if (!categoryElement) return;
                        categoryElement.className = 'category border border-dark-subtle border-1 rounded-3 py-4 pe-5 ps-4';
                        categoryElement.setAttribute('data-id', item.id.toString());

                        const h2Element: HTMLElement | null = document.createElement('h2');
                        if (!h2Element) return;
                        h2Element.className = 'mb-3 fw-semibold';
                        h2Element.innerText = item.title;

                        const buttonsElement: HTMLElement | null = document.createElement('div');
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

                            if (parentElementFromA) {
                                const idItemIncome: string | null = parentElementFromA.getAttribute('data-id');

                                location.href = '#/editIncome';

                                if (idItemIncome) {
                                    new EditIncome(idItemIncome);
                                }
                            }

                        }

                        buttonsElement.appendChild(aElement);
                        buttonsElement.appendChild(buttonElement);

                        categoryElement.appendChild(h2Element);
                        categoryElement.appendChild(buttonsElement);

                        if (createIncomePlus) {
                            categoryWrapper.insertBefore(categoryElement, createIncomePlus);
                        }

                    });
                }

            }
        } catch (error) {
            console.log(error);
        }
    }

    private showPopForDelete(button: HTMLElement): void {
        const that: Income = this;
        if (this.popForDelete) {
            this.popForDelete.className = 'modal d-flex justify-content-center align-items-center';
        }

        const parentElementFromButton: HTMLElement | null = button.parentElement!.parentElement;
        if (parentElementFromButton) {
            const idItemIncome: string | null = parentElementFromButton.getAttribute('data-id');
            if (this.doDelete && idItemIncome) {
                this.doDelete.onclick = function () {
                    that.doDeleteItem(idItemIncome);
                }
            }
        }

    }

    private hidePopForDelete(): void {
        if (this.popForDelete) {
            this.popForDelete.className = 'modal d-none justify-content-center align-items-center';
        }
    }

    private async doDeleteItem(idItemIncome: string): Promise<void> {
        try {
            const result: DefaultResponseType = await CustomHttp.request(config.hostIncome + '/' + idItemIncome, "DELETE");

            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                location.href = '#/income';
            }

        } catch (error) {
            console.log(error);
        }

    }

}