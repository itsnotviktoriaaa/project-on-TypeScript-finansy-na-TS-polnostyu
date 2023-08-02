import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {TranslateErrorFromBackend} from "../services/Translate-error-from-backend";
import {CreateCategoryResponseType} from "../types/create-category-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class CreateExpenses {
    readonly createExpensesItem: HTMLElement | null;
    readonly createExpensesItemName: HTMLInputElement | null;
    readonly errorBlock: HTMLElement | null;
    private messageErrorOnRussian: string | null;
    private messageError: string | null = null;

    constructor() {
        this.createExpensesItem = document.getElementById('create-expenses-item');
        this.createExpensesItemName = document.getElementById('create-expenses-item-name') as HTMLInputElement;
        this.errorBlock = document.getElementById('error');
        this.messageErrorOnRussian = null;

        const that: CreateExpenses = this;

        if (this.createExpensesItem) {
            this.createExpensesItem.onclick = function () {
                that.createExpensesItemElement();
            }
        }

        this.createExpensesItemName.onchange = function () {
            that.init();
        }

    }

    private async createExpensesItemElement(): Promise<void> {
        try {
            const result: CreateCategoryResponseType | DefaultResponseType = await CustomHttp.request(config.hostExpenses, "POST", {
                title: this.createExpensesItemName!.value
            });

            //если result = null, то автоматически переведёт на главную
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
            }

            if (this.messageError) {
                this.messageErrorOnRussian = TranslateErrorFromBackend.getTranslatedText(this.messageError);
                if (this.errorBlock) {
                    this.errorBlock.innerText = this.messageErrorOnRussian;
                }
            }

            console.log(error);
        }

    }

    private init(): void {
        if (this.createExpensesItemName!.value) {
            this.createExpensesItem!.className = 'btn btn-success';
            this.createExpensesItem!.removeAttribute('disabled');
            this.errorBlock!.className = 'd-none text-danger';
        }
        if (!this.createExpensesItemName!.value) {
            this.createExpensesItem!.className = 'btn btn-success disabled';
            this.createExpensesItem!.setAttribute('disabled', 'disabled');
        }

        if (this.createExpensesItemName!.value.match(/^\s*$/)) {
            this.createExpensesItem!.className = 'btn btn-success disabled';
            this.createExpensesItem!.setAttribute('disabled', 'disabled');
            this.errorBlock!.className = 'd-block text-danger';
            this.errorBlock!.innerText = 'Пустое значение нельзя создать';
        }
    }

}