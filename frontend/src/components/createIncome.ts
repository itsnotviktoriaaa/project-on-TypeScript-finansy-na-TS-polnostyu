import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {TranslateErrorFromBackend} from "../services/Translate-error-from-backend";
import {CreateCategoryResponseType} from "../types/create-category-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class CreateIncome {
    readonly createIncomeItem: HTMLElement | null;
    readonly createIncomeItemName: HTMLInputElement | null;
    readonly errorBlock: HTMLElement | null;
    private messageErrorOnRussian: string | null;
    private messageError: string | null = null;

    constructor() {
        this.createIncomeItem = document.getElementById('create-income-item');
        this.createIncomeItemName = document.getElementById('create-income-item-name') as HTMLInputElement;
        this.errorBlock = document.getElementById('error');
        this.messageErrorOnRussian = null;

        const that: CreateIncome = this;

        if (this.createIncomeItem) {
            this.createIncomeItem.onclick = function () {
                that.createIncomeItemElement();
            }
        }

        this.createIncomeItemName.onchange = function () {
            that.init();
        }

    }

    private async createIncomeItemElement(): Promise<void> {
        try {
            const result: CreateCategoryResponseType | DefaultResponseType = await CustomHttp.request(config.hostIncome, "POST", {
                title: this.createIncomeItemName!.value
            });

            //если result = null, то автоматически переведёт на главную
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
        if (this.createIncomeItemName!.value) {
            this.createIncomeItem!.className = 'btn btn-success';
            this.createIncomeItem!.removeAttribute('disabled');
            this.errorBlock!.className = 'd-none text-danger';
        }
        if (!this.createIncomeItemName!.value) {
            this.createIncomeItem!.className = 'btn btn-success disabled';
            this.createIncomeItem!.setAttribute('disabled', 'disabled');
        }

        if (this.createIncomeItemName!.value.match(/^\s*$/)) {
            this.createIncomeItem!.className = 'btn btn-success disabled';
            this.createIncomeItem!.setAttribute('disabled', 'disabled');
            this.errorBlock!.className = 'd-block text-danger';
            this.errorBlock!.innerText = 'Пустое значение нельзя создать';
        }
    }

}