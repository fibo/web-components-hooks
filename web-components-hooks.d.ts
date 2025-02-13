export declare class XContext extends HTMLElement {
    static localName: string;
    /** Define x-context custom element
     *
     * @example Define x-context element on DOM load.
     *
     * import { XContext } from 'web-components-hooks';
     *
     * addEventListener('load', () => {
     *     XContext.define();
     * });
     */
    static define(): void;
    constructor();
}
type Action = any;
type State = any;
type Reducer = (state: State, action: Action) => State;
export declare class XReducer extends HTMLElement {
    #private;
    static localName: string;
    static dataNonce: string;
    /** Define x-reducer custom element
     *
     * @example Define x-reducer element on DOM load.
     *
     * import { XReducer } from 'web-components-hooks';
     *
     * addEventListener('load', () => {
     *     XReducer.define();
     * });
     */
    static define(): void;
    static findParent(initialElement: HTMLElement): XReducer;
    constructor();
    use(reducer: Reducer, initialState: State): void;
    get nonce(): string;
    get state(): State;
    dispatch(action: Action): void;
    addSubscriber(element: HTMLElement): void;
    deleteSubscriber(element: HTMLElement): void;
}
/** Define web-components-hooks custom elements.
 *
 * @example Define all hooks elements on DOM load.
 *
 * import { defineHooksElements } from 'web-components-hooks';
 *
 * addEventListener('load', () => {
 *     defineHooksElements();
 * });
 */
export declare function defineHooksElements(): void;
export {};
