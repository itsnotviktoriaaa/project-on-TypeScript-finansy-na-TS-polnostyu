export type FieldsRegistrationType = {
    name: string,
    id: string,
    element: HTMLInputElement | null,
    invalidFeedback: HTMLElement | null,
    regex?: RegExp | null,
    valid: boolean
}