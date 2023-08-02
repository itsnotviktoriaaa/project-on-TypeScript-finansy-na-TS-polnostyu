import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Balance} from "./balance";
import {CategoryResponseType} from "../types/category-response.type";
import {DefaultResponseType} from "../types/default-response.type";
import {TypeWordType} from "../types/type-word.type";
import {PutOperationsType} from "../types/put-operations.type";
import {GetOperationsType} from "../types/get-operations.type";

export class EditIncomeExpenses {
    private categories: CategoryResponseType[] = [];
    private messageError: string | null = null;
    private errorBlock: HTMLElement | null = null;
    private putAmount: HTMLInputElement | null = null;
    private putComment: HTMLInputElement | null = null;
    private putDate: HTMLInputElement | null = null;
    private editIncomeExpensesItemButton: HTMLElement | null = null;

    constructor(id: string) {
        this.init(id);
    }

    private async init(id: string): Promise<void> {
        try {
            const result: GetOperationsType | DefaultResponseType = await CustomHttp.request(config.hostOperations + '/' + id);
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

                if ((result as GetOperationsType).type === 'expense') {
                    const chooseTypeB: HTMLElement | null = document.querySelector('#choose-type option[value=valueB]');
                    if (chooseTypeB) {
                        chooseTypeB.setAttribute('selected', 'selected');
                    }

                    this.getCategory(config.hostExpenses, (result as GetOperationsType).category);


                } else if ((result as GetOperationsType).type === 'income') {
                    const chooseTypeA: HTMLElement | null = document.querySelector('#choose-type option[value=valueA]');
                    if (chooseTypeA) {
                        chooseTypeA.setAttribute('selected', 'selected');
                    }

                    this.getCategory(config.hostIncome, (result as GetOperationsType).category);
                }

                this.putAmount = document.getElementById('put-amount') as HTMLInputElement | null;

                this.putDate = document.getElementById('put-date') as HTMLInputElement | null;

                this.putComment = document.getElementById('put-comment') as HTMLInputElement | null;

                if (this.putAmount) {
                    this.putAmount.setAttribute('value', (result as GetOperationsType).amount.toString());

                    this.putAmount.onkeydown = function (e) {
                        const charOnlyRegEx = /^[0-9,.]+\s*$/;

                        if (!charOnlyRegEx.test(e.key) && e.code !== "Backspace") return false;

                    }

                    this.putAmount.onchange = function () {
                        that.checkInputs();
                    }

                }

                if (this.putDate) {
                    this.putDate.onchange = function () {
                        that.checkInputs();
                    }
                }

                if (this.putComment) {
                    this.putComment.onchange = function () {
                        that.checkInputs();
                    }
                }


                const dateParse = (result as GetOperationsType).date.split('-');
                let dateParseValue: string = dateParse[2] + '.' + dateParse[1] + '.' + dateParse[0];
                let putDateValuePars: string;

                if (this.putDate) {
                    this.putDate.setAttribute('value', dateParseValue);

                    let putDateValue = this.putDate.value.split('.');
                    putDateValuePars = putDateValue[2] + '-' + putDateValue[1] + '-' + putDateValue[0];

                    this.putDate.onblur = function () {
                        putDateValuePars = (this as HTMLInputElement).value;
                    }
                }

                if (this.putComment) {
                    this.putComment.setAttribute('value', (result as GetOperationsType).comment);
                }

                const chooseType = document.getElementById('choose-type') as HTMLSelectElement;
                const that: EditIncomeExpenses = this;
                chooseType.onchange = function () {
                    if (chooseType.selectedIndex === 1) {
                        that.getCategory(config.hostIncome, null);
                    } else if (chooseType.selectedIndex === 2) {
                        that.getCategory(config.hostExpenses, null);
                    }
                }

                this.editIncomeExpensesItemButton = document.getElementById('edit-income-expenses-item');
                if (this.editIncomeExpensesItemButton) {
                    this.editIncomeExpensesItemButton.onclick = function () {
                        that.editIncomeExpensesItem(id as string, putDateValuePars as string);
                    }
                }


                this.errorBlock = document.getElementById('error');

            }

        } catch (error) {
            console.log(error);
        }
    }

    private async getCategory(host: string, categoryName: string | null): Promise<void> {
        try {
            const result: CategoryResponseType[] | DefaultResponseType = await CustomHttp.request(host);
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

                this.categories = (result as CategoryResponseType[]);

                const chooseCategory = document.getElementById('choose-category') as HTMLSelectElement | null;
                if (!chooseCategory) return;

                chooseCategory.innerHTML = '';
                this.categories.forEach((category: CategoryResponseType) => {
                    let option: HTMLOptionElement = document.createElement('option');
                    option.className = 'dropdownplus';
                    option.setAttribute('category-id', category.id.toString());
                    option.setAttribute('value', category.title);
                    option.innerText = category.title;

                    chooseCategory.appendChild(option);
                });

                const allOptions: Array<HTMLOptionElement> = [...document.querySelectorAll('#choose-category option')] as Array<HTMLOptionElement>;
                if (categoryName) {
                    const optionDetermined = allOptions.find((el: HTMLOptionElement) => el.value === categoryName);
                    if (!optionDetermined) return;
                    optionDetermined.setAttribute('selected', 'selected');
                }


                return;

            }

        } catch (error) {
            console.log(error);
        }
    }

    private async editIncomeExpensesItem(id: string, putDateValuePars: string): Promise<void> {

        let typeName: string = '';
        const chooseType = document.getElementById('choose-type') as HTMLSelectElement;
        if (!chooseType) return;
        if (chooseType.selectedIndex === 1) {
            typeName = TypeWordType.income;
        } else if (chooseType.selectedIndex === 2) {
            typeName = TypeWordType.expense;
        }

        const chooseCategory = document.getElementById('choose-category') as HTMLSelectElement;
        const chooseCategoryValue: string = chooseCategory.value;

        const allOptions: Array<HTMLOptionElement> = [...document.querySelectorAll('#choose-category option')] as Array<HTMLOptionElement>;
        const optionDetermined = allOptions.find((el: HTMLOptionElement) => el.value === chooseCategoryValue);
        if (!optionDetermined) return;
        const categoryId: string | null = optionDetermined.getAttribute('category-id');

        try {
            const result: PutOperationsType | DefaultResponseType = await CustomHttp.request(config.hostOperations + '/' + id, 'PUT', {
                type: typeName,
                amount: parseFloat(this.putAmount!.value),
                date: putDateValuePars,
                comment: this.putComment!.value,
                category_id: parseInt(categoryId as string)
            });

            if (result) {
                if ((result as DefaultResponseType).error) {
                    this.messageError = (result as DefaultResponseType).message;
                    throw new Error((result as DefaultResponseType).message);
                }

                location.href = '#/incomeExpenses';
                new Balance();

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

    private checkInputs(): void {

        if (!this.editIncomeExpensesItemButton) return;

        if (this.putAmount!.value && this.putDate!.value && this.putComment!.value) {
            this.editIncomeExpensesItemButton.removeAttribute('disabled');
            this.editIncomeExpensesItemButton.className = 'btn btn-success';
        }

        if (this.putAmount!.value.match(/^\s*$/) || this.putDate!.value.match(/^\s*$/) || this.putComment!.value.match(/^\s*$/)) {
            this.editIncomeExpensesItemButton.setAttribute('disabled', 'disabled');
            this.editIncomeExpensesItemButton.className = 'btn btn-success disabled';
        }

        if (!this.putAmount!.value || !this.putDate!.value || !this.putComment!.value) {
            this.editIncomeExpensesItemButton.setAttribute('disabled', 'disabled');
            this.editIncomeExpensesItemButton.className = 'btn btn-success disabled';
        }

    }

}