export class XContext extends HTMLElement {
    static localName = 'x-context';
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
    static define() {
        if (!customElements.get(XContext.localName))
            customElements.define(XContext.localName, XContext);
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<slot></slot>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
}

// Stolen from sindresorhus/type-fest
type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonObject = { [Key in string]: JsonValue } & {
    [Key in string]?: JsonValue | undefined;
};
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type Reducer<
    State extends JsonValue,
    Action extends JsonValue & { type: string }
> = (state: State, action: Action) => State;

export class XReducer extends HTMLElement {
    static localName = 'x-reducer';
    static dataNonce = 'data-x-reducer-nonce';
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
    static define() {
        if (!customElements.get(XReducer.localName))
            customElements.define(XReducer.localName, XReducer);
    }
    static findParent(initialElement: HTMLElement) {
        let { parentElement: element } = initialElement;
        while (element) {
            if (element.localName == XReducer.localName)
                return element as XReducer;
            element = element.parentElement;
        }
        throw new Error(
            `Parent ${XReducer.localName} not found for ${initialElement}`
        );
    }
    #state: JsonValue = null;
    #reducer: Reducer<JsonValue, JsonValue & { type: string }> = (
        state,
        _action
    ) => state;
    #subscribers = new Set<HTMLElement>();
    #dataNonce = 0;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<slot></slot>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
    use(reducer: any, initialState: JsonValue) {
        this.#state = initialState;
        this.#reducer = reducer;
    }
    get nonce() {
        return String(this.#dataNonce);
    }
    get state() {
        return this.#state;
    }
    dispatch(action: JsonValue & { type: string }) {
        this.#state = this.#reducer(this.#state, action);
        this.#dataNonce++;
        const { nonce } = this;
        for (const subscriber of this.#subscribers) {
            subscriber.dataset.xReducerNonce = nonce;
        }
    }
    addSubscriber(element: HTMLElement) {
        this.#subscribers.add(element);
        element.dataset.xReducerNonce = this.nonce;
    }
    deleteSubscriber(element: HTMLElement) {
        this.#subscribers.delete(element);
    }
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
export function defineHooksElements() {
    XContext.define();
    XReducer.define();
}
