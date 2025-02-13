export declare class XContext extends HTMLElement {
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
export declare class XReducer extends HTMLElement {
    #private;
    static localName: string;
    static dataNonce: string;
    static findParent(initialElement: HTMLElement): XReducer;
    constructor();
    use(reducer: any, initialState: JsonValue): void;
    get nonce(): string;
    get state(): JsonValue;
    dispatch(
        action: JsonValue & {
            type: string;
        }
    ): void;
    addSubscriber(element: HTMLElement): void;
    deleteSubscriber(element: HTMLElement): void;
}
/** Define web-components-hooks custom elements.
 *
 * @example Define hooks elements on DOM load.
 *
 * import { defineHooksElements } from 'web-components-hooks';
 *
 * addEventListener('load', () => {
 *     defineHooksElements();
 * });
 */
export declare function defineHooksElements(): void;
export {};
