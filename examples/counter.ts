import { defineWebHooksElements, Reducer, WebReducer } from 'web-hooks';

type State = number;

type Action = { type: 'INCREMENT' } | { type: 'DECREMENT' } | { type: 'RESET' };

const reducer: Reducer<State, Action> = (state, action) => {
    console.log('action type', action.type);
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        case 'RESET':
            return 0;
        default:
            return state;
    }
};

class CounterValue extends HTMLElement {
    static observedAttributes = [WebReducer.dataNonce];
    output: HTMLElement;
    reducer: WebReducer | undefined;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<output></output>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
        this.output = this.shadowRoot?.querySelector('output') as HTMLElement;
    }
    connectedCallback() {
        this.reducer = WebReducer.findParent(this);
        this.reducer.addSubscriber(this);
    }
    disconnectedCallback() {
        this.reducer?.deleteSubscriber(this);
    }
    attributeChangedCallback(name: string) {
        if (name === WebReducer.dataNonce) {
            const count = this.reducer?.state as State;
            this.output.textContent = String(count);
        }
    }
}

class CounterButton extends HTMLElement {
    reducer: WebReducer | undefined;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<button><slot></slot></button>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.reducer = WebReducer.findParent(this);
        this.shadowRoot
            ?.querySelector('button')
            ?.addEventListener('click', this);
    }
    handleEvent(event: GlobalEventHandlersEventMap['click']) {
        if (event.type === 'click') {
            const action = this.getAttribute('action');
            if (action === 'increment')
                this.reducer?.dispatch({ type: 'INCREMENT' });
        }
    }
}

addEventListener('load', () => {
    defineWebHooksElements();
    customElements.define('counter-button', CounterButton);
    customElements.define('counter-value', CounterValue);
    const webReducer = document.querySelector('web-reducer') as WebReducer;
    webReducer.use(reducer, 0);
});
