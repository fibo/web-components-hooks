export class XContext extends HTMLElement {
    static localName = 'x-context';
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
export class XReducer extends HTMLElement {
    static localName = 'x-reducer';
    static dataNonce = 'data-x-reducer-nonce';
    static define() {
        if (!customElements.get(XReducer.localName))
            customElements.define(XReducer.localName, XReducer);
    }
    static findParent(initialElement) {
        let { parentElement: element } = initialElement;
        while (element) {
            if (element.localName == XReducer.localName) return element;
            element = element.parentElement;
        }
        throw new Error(
            `Parent ${XReducer.localName} not found for ${initialElement}`
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
    get nonce() {
        return String(this.#dataNonce);
    }
    get state() {
        return this.#state;
    }
    dispatch(action) {
        this.#state = this.#reducer(this.#state, action);
        this.#dataNonce++;
        const { nonce } = this;
        for (const subscriber of this.#subscribers) {
            subscriber.dataset.xReducerNonce = nonce;
        }
    }
    addSubscriber(element) {
        this.#subscribers.add(element);
        element.dataset.xReducerNonce = this.nonce;
    }
    deleteSubscriber(element) {
        this.#subscribers.delete(element);
    }
}
export function defineHooksElements() {
    XContext.define();
    XReducer.define();
}
