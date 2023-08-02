import config from "../../config/config";
import {UserInfoType} from "../types/user-info.type";
import {RefreshResponseType} from "../types/refresh-response.type";
import {DefaultResponseType} from "../types/default-response.type";
import {LogoutResponseType} from "../types/logout-response.type";

export class Auth {
    static readonly accessTokenKey: string = 'accessToken';
    static readonly refreshTokenKey: string = 'refreshToken';
    static readonly userInfoKey: string = 'userInfo';

    public static async processUnauthorizedResponse(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);

        if (refreshToken) {
            const response: Response = await fetch(config.host + '/refresh', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result: RefreshResponseType | DefaultResponseType = await response.json();
                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }

                    this.setTokens((result as RefreshResponseType).tokens.accessToken, (result as RefreshResponseType).tokens.refreshToken);
                    return true;
                }

            }
        }

        this.removeTokens();
        location.href = '#/';
        return false;
    }

    public static async logout(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/logout', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result: LogoutResponseType | null = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    return true;
                }
            }
        }
        return false;

    }

    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    private static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static setUserInfo(info: UserInfoType): void {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    public static getUserInfo(): UserInfoType | null {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }

        return null;
    }

}