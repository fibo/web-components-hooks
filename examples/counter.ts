import { XReducer } from 'web-components-hooks';

const reducer = (state: number, action: { type: string }) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        case 'RESET':
            return 0;
        default:
            console.warn('Unknown action type', action.type);
            return state;
    }
};

class CounterValue extends HTMLElement {
    static observedAttributes = [XReducer.dataNonce];
    output: HTMLElement;
    reducer: XReducer | undefined;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<output></output>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
        this.output = this.shadowRoot?.querySelector('output') as HTMLElement;
    }
    connectedCallback() {
        // Find reducer and subscribe.
        this.reducer = XReducer.findParent(this);
        this.reducer.addSubscriber(this);
    }
    disconnectedCallback() {
        this.reducer?.deleteSubscriber(this);
    }
    attributeChangedCallback(name: string) {
        if (name === XReducer.dataNonce) {
            const count = this.reducer?.state;
            this.output.textContent = String(count);
        }
    }
}

class CounterButton extends HTMLElement {
    reducer: XReducer | undefined;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<button><slot></slot></button>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        // Find reducer.
        // No need to subscribe cause button will only dispatch.
        this.reducer = XReducer.findParent(this);
        this.shadowRoot
            ?.querySelector('button')
            ?.addEventListener('click', this);
    }
    handleEvent(event: GlobalEventHandlersEventMap['click']) {
        if (event.type === 'click') {
            const action = this.getAttribute('action');
            if (action) this.reducer?.dispatch({ type: action });
        }
    }
}

addEventListener('load', () => {
    // Define and initialize reducer.
    XReducer.define();
    const xReducer = document.querySelector('x-reducer') as XReducer;
    xReducer.use(reducer, 0);
    // Define other custom elements.
    customElements.define('counter-button', CounterButton);
    customElements.define('counter-value', CounterValue);
});
