import {Auth} from "./Auth";

export class CustomHttp {
    public static async request(url: string, method: string = 'GET', body: any = null): Promise<any> {

        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };

        let token: string | null = localStorage.getItem(Auth.accessTokenKey);

        if (token) {
            params.headers['x-auth-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        const response: Response = await fetch(url, params);

        const urlRoute: string = window.location.hash.split('?')[0];

        if (response.status < 200 || response.status >= 300) {

            if (urlRoute !== '#/' && urlRoute !== '#/registration') {

                if (response.status === 401) {
                    const result: boolean = await Auth.processUnauthorizedResponse();
                    if (result) {
                        return await this.request(url, method, body);
                    } else {
                        return await response.json();
                    }
                }

            }

            return await response.json();

        }

        return await response.json();

    }
}