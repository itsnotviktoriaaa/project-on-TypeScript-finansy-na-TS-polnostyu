export class TranslateErrorFromBackend {

    private static dictionary = new Map()
        .set('This record already exists', 'Данная категория уже существует');

    public static getTranslatedText(errorMessage: string): string {
        return this.dictionary.has(errorMessage) ? this.dictionary.get(errorMessage) : errorMessage;
    }

}