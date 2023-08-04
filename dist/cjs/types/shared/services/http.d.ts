export default class Http {
    static get(url: any): Promise<unknown>;
    static post(url: any, body: any): Promise<unknown>;
    static patch(url: any, body: any): Promise<unknown>;
    static delete(url: any): Promise<unknown>;
}
