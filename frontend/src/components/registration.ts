import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/Auth";
import config from "../../config/config";
import {PageType} from "../types/page.type";
import {FieldsRegistrationType} from "../types/fields-registration.type";
import {SignResponseType} from "../types/sign-response.type";
import {DefaultResponseType} from "../types/default-response.type";
import {LoginResponseType} from "../types/login-response.type";

export class Registration {
    readonly processElement: HTMLElement | null;
    readonly rememberElement: HTMLInputElement | null;
    private rememberMe: boolean;
    readonly page: PageType;
    readonly errorBlock: HTMLElement | null;
    private messageError: string | null;
    private fields: FieldsRegistrationType[];


    constructor(page: PageType) {

        this.processElement = document.getElementById('process');
        this.rememberElement = document.getElementById('remember-me') as HTMLInputElement;
        this.rememberMe = false;
        this.page = page;
        this.errorBlock = document.getElementById('error');
        this.messageError = null;


        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                invalidFeedback: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                invalidFeedback: null,
                valid: false
            }
        ]

        if (this.page === PageType.registration) {
            this.fields.find((item: FieldsRegistrationType) => {
                return item.name === 'password';
            })!.regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
            this.fields.unshift({
                    name: 'fullName',
                    id: 'full-name',
                    element: null,
                    invalidFeedback: null,
                    regex: /([А-ЯЁ][а-яё]+\s+){2}([А-ЯЁ][а-яё]+\s*)/,
                    valid: false
                },
                {
                    name: 'passwordRepeat',
                    id: 'password-repeat',
                    element: null,
                    invalidFeedback: null,
                    regex: null,
                    valid: false
                });
        }
        const that: Registration = this;
        this.fields.forEach((item: FieldsRegistrationType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            item.invalidFeedback = (document.getElementById(item.id) as HTMLElement).nextElementSibling as HTMLElement;
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, <HTMLInputElement>this);
                }
            }

        });

        this.rememberElement.onclick = function (): void {
            that.rememberCheck.call(that, <HTMLInputElement>this);
        }

        if (this.processElement) {
            this.processElement.onclick = function (): void {
                that.processForm();
            }
        }


    }

    private validateField(field: FieldsRegistrationType, element: HTMLInputElement): void {
        let fieldPassword: FieldsRegistrationType | undefined;
        let fieldPasswordElementValue: string | undefined;
        let fieldPasswordRepeat: FieldsRegistrationType | undefined;

        if (this.page === PageType.registration) {
            fieldPassword = this.fields.find((item: FieldsRegistrationType) => item.name === 'password');
            if (fieldPassword) {
                fieldPasswordElementValue = fieldPassword.element!.value;
            }

            fieldPasswordRepeat = this.fields.find((item: FieldsRegistrationType) => item.name === 'passwordRepeat');
            if (fieldPasswordRepeat) {
                fieldPasswordRepeat.regex = new RegExp('^' + fieldPasswordElementValue + '$');
            }
        }

        if (!element.value || !element.value.match(field.regex as RegExp)) {
            (element.previousElementSibling as HTMLElement).style.borderColor = "red";
            element.style.borderColor = "red";
            (field.invalidFeedback as HTMLElement).style.display = "block";
            field.valid = false;

        } else {
            (element.previousElementSibling as HTMLElement).removeAttribute('style');
            element.removeAttribute('style');
            (field.invalidFeedback as HTMLElement).style.display = "none";
            field.valid = true;
        }

        if (this.page === PageType.registration) {
            if (field.name === 'password' && fieldPasswordRepeat && fieldPasswordRepeat.element!.value) {
                this.validateField(fieldPasswordRepeat, fieldPasswordRepeat.element!);
            }
        }

        if (this.rememberElement) {
            this.rememberMe = this.rememberElement.checked;
        }

        this.validateForm();

    }


    private validateForm(): boolean {
        const validForm = this.fields.every((item: FieldsRegistrationType) => item.valid);
        if (validForm) {
            if (this.processElement) {
                this.processElement.removeAttribute('disabled');
            }
        } else {
            if (this.processElement) {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }
        return validForm;
    }

    private rememberCheck(element: HTMLInputElement): void {
        this.rememberMe = element.checked;
    }

    private async processForm(): Promise<void> {
        if (this.validateForm()) {
            const email: string = this.fields.find(item => item.name === 'email')!.element!.value;
            const password: string = this.fields.find(item => item.name === 'password')!.element!.value;

            if (this.page === PageType.registration) {
                try {
                    const result: SignResponseType | DefaultResponseType = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === "fullName")!.element!.value.split(' ')[1],
                        lastName: this.fields.find(item => item.name === "fullName")!.element!.value.split(' ')[0],
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === "passwordRepeat")!.element!.value
                    });
                    if (result) {
                        if ((result as DefaultResponseType).error || !(result as SignResponseType).user) {
                            throw new Error((result as DefaultResponseType).message);
                        }
                    }

                } catch (error) {
                    console.log(error);
                    return;
                }
            }

            //будет происходить в любом случае то, что ниже, независимо от того, на какой странице находимся (login или registration)
            try {
                const result: LoginResponseType | DefaultResponseType = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: this.fields.find(item => item.name === 'email')!.element!.value,
                    password: this.fields.find(item => item.name === 'password')!.element!.value,
                    rememberMe: this.rememberMe
                });

                if (result) {
                    if ((result as DefaultResponseType).error || !(result as LoginResponseType).tokens.accessToken || !(result as LoginResponseType).tokens.refreshToken
                        || !(result as LoginResponseType).user.name || !(result as LoginResponseType).user.lastName || !(result as LoginResponseType).user.id) {
                        this.messageError = (result as DefaultResponseType).message;
                        throw new Error((result as DefaultResponseType).message);
                    }

                    Auth.setTokens((result as LoginResponseType).tokens.accessToken, (result as LoginResponseType).tokens.refreshToken);
                    Auth.setUserInfo({
                        name: (result as LoginResponseType).user.name,
                        lastName: (result as LoginResponseType).user.lastName,
                        id: (result as LoginResponseType).user.id
                    });
                    location.href = '#/grafika';
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
    }

}