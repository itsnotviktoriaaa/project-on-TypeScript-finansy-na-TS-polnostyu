import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {BalanceResponse} from "../types/balance-response";
import {DefaultResponseType} from "../types/default-response.type";

export class Balance {
    readonly balanceAmount: HTMLElement | null;

    constructor() {
        this.balanceAmount = document.getElementById('balance-amount');

        this.init();
    }

    private async init(): Promise<void> {
        try {
            const result: BalanceResponse | DefaultResponseType = await CustomHttp.request(config.hostBalance);
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

                if (this.balanceAmount) {
                    this.balanceAmount.innerText = (result as BalanceResponse).balance + '$';
                }

            }
        } catch (error) {
            console.log(error);
        }
    }

}
