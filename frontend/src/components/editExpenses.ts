import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {CreateCategoryResponseType} from "../types/create-category-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class EditExpenses {
    private editExpensesItem: HTMLElement | null = null;
    private errorBlock: HTMLElement | null = null;
    private messageError: string | null = null;


    constructor(idItemExpenses: string) {
        this.getNameOfExpensesItem(idItemExpenses);
    }

    private async getNameOfExpensesItem(idItemExpenses: string): Promise<void> {
        try {
            const result: CreateCategoryResponseType | DefaultResponseType = await CustomHttp.request(config.hostExpenses + '/' + idItemExpenses);

            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

                const editExpensesItemName = document.getElementById('edit-expenses-item-name') as HTMLInputElement | null;
                if (editExpensesItemName) {
                    editExpensesItemName.value = (result as CreateCategoryResponseType).title;

                    const that: EditExpenses = this;
                    this.editExpensesItem = document.getElementById('edit-expenses-item');

                    if (this.editExpensesItem) {
                        this.editExpensesItem.onclick = function () {
                            that.changeExpensesItemElement(editExpensesItemName.value, idItemExpenses);
                        }
                    }

                    editExpensesItemName.onchange = function () {
                        that.init();
                    }
                }

                this.errorBlock = document.getElementById('error');

            }
        } catch (error) {
            console.log(error);
        }
    }

    private async changeExpensesItemElement(valueOfItem: string, idItemExpenses: string): Promise<void> {
        try {
            const result: CreateCategoryResponseType | DefaultResponseType = await CustomHttp.request(config.hostExpenses + '/' + idItemExpenses, "PUT", {
                title: valueOfItem
            });

            if (result) {
                if ((result as DefaultResponseType).error) {
                    this.messageError = (result as DefaultResponseType).message;
                    throw new Error((result as DefaultResponseType).message);
                }

                location.href = '#/expenses';

            }
        } catch (error) {
            if (this.errorBlock) {
                this.errorBlock.className = 'd-block text-danger mb-2';
                if (this.messageError) {
                    this.errorBlock.innerText = this.messageError;
                }
            }
            console.log(error);
        }

    }

    private init(): void {
        const editExpensesItemName = document.getElementById('edit-expenses-item-name') as HTMLInputElement;
        if (editExpensesItemName.value) {
            this.editExpensesItem!.className = 'btn btn-success';
            this.editExpensesItem!.removeAttribute('disabled');
            this.errorBlock!.className = 'd-none text-danger';
        }
        if (!editExpensesItemName.value) {
            this.editExpensesItem!.className = 'btn btn-success disabled';
            this.editExpensesItem!.setAttribute('disabled', 'disabled');
        }

        if (editExpensesItemName.value.match(/^\s*$/)) {
            this.editExpensesItem!.className = 'btn btn-success disabled';
            this.editExpensesItem!.setAttribute('disabled', 'disabled');
            this.errorBlock!.className = 'd-block text-danger';
            this.errorBlock!.innerText = 'Пустое значение нельзя сохранить';
        }
    }

}