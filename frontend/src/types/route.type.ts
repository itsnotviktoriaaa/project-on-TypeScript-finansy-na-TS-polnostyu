export type RouteType = {
    route: string,
    title: string,
    template: string,
    styles: string,
    styles1?: string,
    load(): void
}