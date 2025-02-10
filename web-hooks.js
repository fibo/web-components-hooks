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
export class WebReducer extends HTMLElement {
    static localName = 'web-reducer';
    static dataNonce = 'data-web-reducer-nonce';
    static findParent(initialElement) {
        let { parentElement: element } = initialElement;
        while (element) {
            if (element.localName == WebReducer.localName) return element;
            element = element.parentElement;
        }
        throw new Error(
            `Parent ${WebReducer.localName} not found for ${initialElement}`
        );
    }
    #state = null;
    #reducer = (state, _action) => state;
    #subscribers = new Set();
    #dataNonce = 0;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<slot></slot>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
    use(reducer, initialState) {
        this.#state = initialState;
        this.#reducer = reducer;
    }
    get state() {
        return this.#state;
    }
    dispatch(action) {
        this.#state = this.#reducer(this.#state, action);
        this.#dataNonce++;
        const nonce = String(this.#dataNonce);
        for (const subscriber of this.#subscribers) {
            subscriber.dataset.webReducerNonce = nonce;
        }
    }
    addSubscriber(element) {
        this.#subscribers.add(element);
    }
    deleteSubscriber(element) {
        this.#subscribers.delete(element);
    }
}
export function defineWebHooksElements() {
    if (!customElements.get(WebContext.localName))
        customElements.define(WebContext.localName, WebContext);
    if (!customElements.get(WebReducer.localName))
        customElements.define(WebReducer.localName, WebReducer);
}
