/**
 * Builds a URL with query parameters
 */
export class URLBuilder {
    private readonly baseURL: string;
    private params: { [key: string]: string } = {};

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    addQueryParam(key: string, value: string) {
        this.params[key] = value;
        return this;
    }

    build() {
        const query = new URLSearchParams(this.params).toString();
        return `${this.baseURL}?${query}`;
    }
}