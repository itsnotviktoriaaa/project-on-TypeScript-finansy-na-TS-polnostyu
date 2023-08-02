import config from "../../config/config";
import {CustomHttp} from "../services/custom-http";
import {Balance} from "./balance";
import {GetOperationsType} from "../types/get-operations.type";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoryResponseType} from "../types/category-response.type";
import {CreateWordType} from "../types/create-word.type";

export class CreateIncomeExpenses {

    private createIncomeExpensesItemButton: HTMLElement | null = null;
    private putAmount: HTMLInputElement | null = null;
    private putDate: HTMLInputElement | null = null;
    private putComment: HTMLInputElement | null = null;
    private errorBlock: HTMLElement | null = null;
    private categories: CategoryResponseType[] = [];
    private messageError: string | null = null;

    constructor(type: CreateWordType) {
        this.init(type);
    }

    private async init(type: CreateWordType): Promise<void> {
        try {
            const result: GetOperationsType | DefaultResponseType = await CustomHttp.request(config.hostOperations);
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

                if (type === CreateWordType.expenses) {
                    const chooseTypeB: HTMLElement | null = document.querySelector('#choose-type option[value=valueB]');
                    if (chooseTypeB) {
                        chooseTypeB.setAttribute('selected', 'selected');
                    }

                    this.getCategory(config.hostExpenses);

                } else if (type === CreateWordType.income) {
                    const chooseTypeA: HTMLElement | null = document.querySelector('#choose-type option[value=valueA]');
                    if (chooseTypeA) {
                        chooseTypeA.setAttribute('selected', 'selected');
                    }

                    this.getCategory(config.hostIncome);
                }

                const chooseType = document.getElementById('choose-type') as HTMLSelectElement | null;
                const that: CreateIncomeExpenses = this;
                if (!chooseType) return;
                chooseType.onchange = function () {
                    if (chooseType.selectedIndex === 1) {
                        that.getCategory(config.hostIncome);
                    } else if (chooseType.selectedIndex === 2) {
                        that.getCategory(config.hostExpenses);
                    }
                }

                this.createIncomeExpensesItemButton = document.getElementById('create-income-expenses-item');

                this.putAmount = document.getElementById('put-amount') as HTMLInputElement | null;
                this.putDate = document.getElementById('put-date') as HTMLInputElement | null;

                this.putComment = document.getElementById('put-comment') as HTMLInputElement | null;

                if (this.putAmount) {
                    this.putAmount.onkeydown = function (e) {
                        const charOnlyRegEx = /^[0-9,.]+\s*$/;

                        if (!charOnlyRegEx.test(e.key) && e.code !== "Backspace") return false;

                    }

                    this.putAmount.onchange = function (): void {
                        that.checkInputs();
                    }
                }

                if (this.putDate) {
                    this.putDate.onchange = function (): void {
                        that.checkInputs();
                    }
                }

                if (this.putComment) {
                    this.putComment.onchange = function () {
                        that.checkInputs();
                    }
                }

                if (this.createIncomeExpensesItemButton) {
                    this.createIncomeExpensesItemButton.onclick = function () {
                        that.createIncomeExpensesItem();
                    }
                }

                this.errorBlock = document.getElementById('error');

            }
        } catch (error) {
            console.log(error);
        }

    }

    private async getCategory(host: string): Promise<void> {
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

                return;

            }

        } catch (error) {
            console.log(error);
        }
    }

    private async createIncomeExpensesItem(): Promise<void> {

        let typeName: string | null = null;
        const chooseType = document.getElementById('choose-type') as HTMLSelectElement;
        if (chooseType.selectedIndex === 1) {
            typeName = 'income';
        } else if (chooseType.selectedIndex === 2) {
            typeName = 'expense';
        }

        const putAmount = document.getElementById('put-amount') as HTMLInputElement | null;

        const putDate = document.getElementById('put-date') as HTMLInputElement | null;

        const putComment = document.getElementById('put-comment') as HTMLInputElement | null;

        const chooseCategory = document.getElementById('choose-category') as HTMLSelectElement;
        const chooseCategoryValue: string = chooseCategory.value;

        const allOptions: Array<HTMLOptionElement> = [...document.querySelectorAll('#choose-category option')] as Array<HTMLOptionElement>;
        const optionDetermined = allOptions.find((el: HTMLOptionElement) => el.value === chooseCategoryValue);
        if (!optionDetermined) return;
        const categoryId: string | null = optionDetermined.getAttribute('category-id');

        try {
            const result: GetOperationsType | DefaultResponseType = await CustomHttp.request(config.hostOperations, 'POST', {
                type: typeName,
                amount: parseFloat(putAmount!.value),
                date: putDate!.value,
                comment: putComment!.value,
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

        if (this.putAmount && this.putAmount.value && this.putDate && this.putDate.value && this.putComment && this.putComment.value) {
            if (this.createIncomeExpensesItemButton) {
                this.createIncomeExpensesItemButton.removeAttribute('disabled');
                this.createIncomeExpensesItemButton.className = 'btn btn-success';
            }
        }

        if (this.putAmount!.value.match(/^\s*$/) || this.putDate!.value.match(/^\s*$/) || this.putComment!.value.match(/^\s*$/)) {
            if (this.createIncomeExpensesItemButton) {
                this.createIncomeExpensesItemButton.setAttribute('disabled', 'disabled');
                this.createIncomeExpensesItemButton.className = 'btn btn-success disabled';
            }
        }

        if (!this.putAmount!.value || !this.putDate!.value || !this.putComment!.value) {
            if (this.createIncomeExpensesItemButton) {
                this.createIncomeExpensesItemButton.setAttribute('disabled', 'disabled');
                this.createIncomeExpensesItemButton.className = 'btn btn-success disabled';
            }

        }

    }

}