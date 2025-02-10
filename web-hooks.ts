export class WebContext extends HTMLElement {
    static localName = 'web-context';
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

export class WebReducer extends HTMLElement {
    static localName = 'web-reducer';
    static dataNonce = 'data-web-reducer-nonce';
    static findParent(initialElement: HTMLElement) {
        let { parentElement: element } = initialElement;
        while (element) {
            if (element.localName == WebReducer.localName)
                return element as WebReducer;
            element = element.parentElement;
        }
        throw new Error(
            `Parent ${WebReducer.localName} not found for ${initialElement}`
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
    get state() {
        return this.#state;
    }
    dispatch(action: JsonValue & { type: string }) {
        this.#state = this.#reducer(this.#state, action);
        this.#dataNonce++;
        const nonce = String(this.#dataNonce);
        for (const subscriber of this.#subscribers) {
            subscriber.dataset.webReducerNonce = nonce;
        }
    }
    addSubscriber(element: HTMLElement) {
        this.#subscribers.add(element);
    }
    deleteSubscriber(element: HTMLElement) {
        this.#subscribers.delete(element);
    }
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
export function defineWebHooksElements() {
    if (!customElements.get(WebContext.localName))
        customElements.define(WebContext.localName, WebContext);
    if (!customElements.get(WebReducer.localName))
        customElements.define(WebReducer.localName, WebReducer);
}
