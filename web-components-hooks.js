export class XContext extends HTMLElement {
    static localName = 'x-context';
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
    get state() {
        return this.#state;
    }
    dispatch(action) {
        this.#state = this.#reducer(this.#state, action);
        this.#dataNonce++;
        const nonce = String(this.#dataNonce);
        for (const subscriber of this.#subscribers) {
            subscriber.dataset.xReducerNonce = nonce;
        }
    }
    addSubscriber(element) {
        this.#subscribers.add(element);
    }
    deleteSubscriber(element) {
        this.#subscribers.delete(element);
    }
}
export function defineHooksElements() {
    if (!customElements.get(XContext.localName))
        customElements.define(XContext.localName, XContext);
    if (!customElements.get(XReducer.localName))
        customElements.define(XReducer.localName, XReducer);
}
