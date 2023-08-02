import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {CreateCategoryResponseType} from "../types/create-category-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class EditIncome {
    private editIncomeItem: HTMLElement | null = null;
    private errorBlock: HTMLElement | null = null;
    private messageError: string | null = null;


    constructor(idItemIncome: string) {
        this.getNameOfIncomeItem(idItemIncome);
    }

    private async getNameOfIncomeItem(idItemIncome: string): Promise<void> {
        try {
            const result: CreateCategoryResponseType | DefaultResponseType = await CustomHttp.request(config.hostIncome + '/' + idItemIncome);

            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

                const editIncomeItemName = document.getElementById('edit-income-item-name') as HTMLInputElement | null;
                if (editIncomeItemName) {
                    editIncomeItemName.value = (result as CreateCategoryResponseType).title;
                    const that: EditIncome = this;
                    this.editIncomeItem = document.getElementById('edit-income-item');

                    if (this.editIncomeItem) {
                        this.editIncomeItem.onclick = function () {
                            that.changeIncomeItemElement(editIncomeItemName.value, idItemIncome);
                        }
                    }

                    editIncomeItemName.onchange = function () {
                        that.init();
                    }
                }

                this.errorBlock = document.getElementById('error');

            }
        } catch (error) {
            console.log(error);
        }
    }

    private async changeIncomeItemElement(valueOfItem: string, idItemIncome: string): Promise<void> {
        try {
            const result: CreateCategoryResponseType | DefaultResponseType = await CustomHttp.request(config.hostIncome + '/' + idItemIncome, "PUT", {
                title: valueOfItem
            });

            if (result) {
                if ((result as DefaultResponseType).error) {
                    this.messageError = (result as DefaultResponseType).message;
                    throw new Error((result as DefaultResponseType).message);
                }

                location.href = '#/income';

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
        const editIncomeItemName = document.getElementById('edit-income-item-name') as HTMLInputElement;
        if (editIncomeItemName.value) {
            this.editIncomeItem!.className = 'btn btn-success';
            this.editIncomeItem!.removeAttribute('disabled');
            this.errorBlock!.className = 'd-none text-danger';
        }
        if (!editIncomeItemName.value) {
            this.editIncomeItem!.className = 'btn btn-success disabled';
            this.editIncomeItem!.setAttribute('disabled', 'disabled');
        }

        if (editIncomeItemName.value.match(/^\s*$/)) {
            this.editIncomeItem!.className = 'btn btn-success disabled';
            this.editIncomeItem!.setAttribute('disabled', 'disabled');
            this.errorBlock!.className = 'd-block text-danger';
            this.errorBlock!.innerText = 'Пустое значение нельзя сохранить';
        }
    }

}