import {Grafika} from "./components/grafika";
import {Registration} from "./components/registration";
import {Income} from "./components/income";
import {Expenses} from "./components/expenses";
import {CreateIncome} from "./components/createIncome";
import {CreateExpenses} from "./components/createExpenses";
import {Balance} from "./components/balance";
import {Auth} from "./services/Auth";
import {IncomeExpenses} from "./components/incomeExpenses";
import {ReloadManager} from "./utils/reload-manager";
import {CreateIncomeExpenses} from "./components/createIncomeExpenses";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/user-info.type";
import {PageType} from "./types/page.type";
import {CreateWordType} from "./types/create-word.type";

export class Router {
    readonly contentElement: HTMLElement | null;
    readonly stylesElement: HTMLElement | null;
    readonly stylesElement1: HTMLElement | null;
    readonly titleElement: HTMLElement | null;
    readonly commonWrapper: HTMLElement | null;
    readonly commonBar: HTMLElement | null;
    readonly grafikaPage: HTMLElement | null;
    readonly incomeExpensesPage: HTMLElement | null;
    readonly categoryGroup: HTMLElement | null;
    readonly categoryMainPage: HTMLElement | null;
    readonly categoryIncomePage: HTMLElement | null;
    readonly categoryExpensesPage: HTMLElement | null;
    readonly fullNameUser: HTMLElement | null;
    private routes: RouteType[];

    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('individual-css');
        this.stylesElement1 = document.getElementById('individual-css1');
        this.titleElement = document.getElementById('title');
        this.commonWrapper = document.getElementById('common-wrapper');
        this.commonBar = document.getElementById('common-bar');
        this.grafikaPage = document.getElementById('grafika');
        this.incomeExpensesPage = document.getElementById('income-expenses');
        this.categoryGroup = document.getElementById('category-group');
        this.categoryMainPage = document.getElementById('category-main');
        this.categoryIncomePage = document.getElementById('category-income');
        this.categoryExpensesPage = document.getElementById('category-expenses');
        this.fullNameUser = document.getElementById('full-name-user');
        this.routes = [
            {
                route: '#/',
                title: 'Авторизация',
                template: 'templates/index.html',
                styles: '',
                load: () => {
                    new Registration(PageType.empty);
                }
            },
            {
                route: '#/registration',
                title: 'Регистрация',
                template: 'templates/registration.html',
                styles: '',
                load: () => {
                    new Registration(PageType.registration);
                }
            },
            {
                route: '#/income',
                title: 'Категории доходов',
                template: 'templates/income.html',
                styles: '',
                load: () => {
                    new Income();
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/createIncome',
                title: 'Создать категорию доходов',
                template: 'templates/createIncome.html',
                styles: '',
                load: () => {
                    new CreateIncome();
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/editIncome',
                title: 'Редактировать категорию доходов',
                template: 'templates/editIncome.html',
                styles: '',
                load: () => {
                }
            },
            {
                route: '#/expenses',
                title: 'Категории расходов',
                template: 'templates/expenses.html',
                styles: 'css/expenses.css',
                load: () => {
                    new Expenses();
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/createExpenses',
                title: 'Создать категорию расходов',
                template: 'templates/createExpenses.html',
                styles: '',
                load: () => {
                    new CreateExpenses();
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/editExpenses',
                title: 'Редактировать категорию расходов',
                template: 'templates/editExpenses.html',
                styles: '',
                load: () => {
                }
            },
            {
                route: '#/incomeExpenses',
                title: 'Доходы и расходы',
                template: 'templates/incomeExpenses.html',
                styles: 'css/incomeExpenses.css',
                load: () => {
                    new IncomeExpenses();
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/createIncomeExpenses',
                title: 'Создание дохода/расхода',
                template: 'templates/createIncomeExpenses.html',
                styles: 'css/createIncomeExpenses.css',
                load: () => {
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/editIncomeExpenses',
                title: 'Редактирование дохода/расхода',
                template: 'templates/editIncomeExpenses.html',
                styles: 'css/editIncomeExpenses.css',
                load: () => {
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/grafika',
                title: 'Главная',
                template: 'templates/grafika.html',
                styles: 'css/grafika.css',
                styles1: 'css/incomeExpenses.css',
                load: () => {
                    new Balance();
                    new Grafika();
                }
            },
        ]
    }

    public async openRoute(): Promise<void> {
        const urlRoute: string = window.location.hash.split('?')[0];

        if (urlRoute === '#/logout') {
            const result: boolean = await Auth.logout();
            if (result) {
                window.location.href = '#/';
                return;
            } else {
                //...
            }

        }

        const newRoute: RouteType | undefined = this.routes.find((item: RouteType) => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }



        this.contentElement!.innerHTML =
            await fetch(newRoute.template).then(response => response.text());

        this.stylesElement!.setAttribute('href', '');
        this.stylesElement1!.setAttribute('href', '');

        if (newRoute.styles) {
            this.stylesElement!.setAttribute('href', newRoute.styles);
        }

        this.titleElement!.innerText = newRoute.title;

        this.commonWrapper!.className = '';
        this.commonBar!.className = 'd-none flex-column flex-shrink-0 py-3 bg-light';


        if (newRoute.route !== '#/' && newRoute.route !== '#/registration') {
            this.commonWrapper!.className = 'd-flex flex-nowrap main';
            this.commonBar!.className = 'd-flex flex-column flex-shrink-0 py-3 bg-light';
        }

        if (newRoute.styles1) {
            this.stylesElement1!.setAttribute('href', newRoute.styles1);
        }

        this.contentElement!.className = '';

        if (newRoute.route === '#/grafika' || newRoute.route === '#/incomeExpenses') {
            this.contentElement!.className = 'w-100';
        }

        this.grafikaPage!.className = 'nav-link link-dark';
        this.incomeExpensesPage!.className = 'nav-link link-dark';
        this.categoryGroup!.className = 'category-border-white collapse';
        this.categoryMainPage!.className = 'nav-link link-dark';
        this.categoryIncomePage!.className = 'nav-link link-dark';
        this.categoryExpensesPage!.className = 'nav-link link-dark';

        if (newRoute.route === '#/grafika') {
            this.grafikaPage!.className = 'nav-link active';
        }

        if (newRoute.route === '#/incomeExpenses' || newRoute.route === '#/createIncomeExpenses' || newRoute.route === '#/editIncomeExpenses') {
            this.incomeExpensesPage!.className = 'nav-link active';
        }

        if (newRoute.route === '#/income' || newRoute.route === '#/editIncome' || newRoute.route === '#/createIncome') {
            this.categoryGroup!.className = 'category-border-blue collapse show';
            this.categoryMainPage!.className = 'nav-link active';
            this.categoryIncomePage!.className = 'nav-link active-color';
        }

        if (newRoute.route === '#/expenses' || newRoute.route === '#/editExpenses' || newRoute.route === '#/createExpenses') {
            this.categoryGroup!.className = 'category-border-blue collapse show';
            this.categoryMainPage!.className = 'nav-link active';
            this.categoryExpensesPage!.className = 'nav-link active-color';
        }

        if (newRoute.route !== '#/' && newRoute.route !== '#/registration') {

            const userInfo: UserInfoType | null = Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/';
                return;
            }

            const userInfoName: string = userInfo.name;
            const userInfoLastName: string = userInfo.lastName;

            this.fullNameUser!.innerText = userInfoName + ' ' + userInfoLastName;
        }

        if (newRoute.route === '#/editIncomeExpenses') {
            if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
                const error: HTMLElement | null = document.getElementById('error');
                if (error) {
                    error.className = 'd-block text-danger mb-2'
                    error.innerText = 'Вам необходимо нажать на кнопку "Отмена" и зайти снова, поскольку Вы перезагрузили страницу';
                }

                const editIncomeExpensesItem: HTMLElement | null = document.getElementById('edit-income-expenses-item');
                if (editIncomeExpensesItem) {
                    editIncomeExpensesItem.className = 'btn btn-success disabled';
                    editIncomeExpensesItem.setAttribute('title', '');
                }
            }
        }

        if (newRoute.route === '#/createIncomeExpenses') {
            if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
                //при перезагрузке страницы будет подставляться income
                new CreateIncomeExpenses(CreateWordType.income);
            }
        }

        newRoute.load();

    }

}