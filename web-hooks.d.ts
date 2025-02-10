export declare class WebContext extends HTMLElement {
    static localName: string;
    constructor();
}
type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonObject = {
    [Key in string]: JsonValue;
} & {
    [Key in string]?: JsonValue | undefined;
};
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type Reducer<
    State extends JsonValue,
    Action extends JsonValue & {
        type: string;
    }
> = (state: State, action: Action) => State;
export declare class WebReducer extends HTMLElement {
    #private;
    static localName: string;
    static dataNonce: string;
    static findParent(initialElement: HTMLElement): WebReducer;
    constructor();
    use(reducer: any, initialState: JsonValue): void;
    get state(): JsonValue;
    dispatch(
        action: JsonValue & {
            type: string;
        }
    ): void;
    addSubscriber(element: HTMLElement): void;
    deleteSubscriber(element: HTMLElement): void;
}
/** Define web-hooks custom elements.
 *
 * @example Define web-hooks elements on DOM load.
 *
 * import { defineWebHooksElements } from 'web-hooks';
 *
 * addEventListener('load', () => {
 *     defineWebHooksElements();
 * });
 */
export declare function defineWebHooksElements(): void;
export {};
