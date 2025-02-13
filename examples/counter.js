import { XReducer } from 'web-components-hooks';
const reducer = (state, action) => {
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
    static observedAttributes = [XReducer.dataNonce];
    output;
    reducer;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<output></output>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
        this.output = this.shadowRoot?.querySelector('output');
    }
    connectedCallback() {
        this.reducer = XReducer.findParent(this);
        this.reducer.addSubscriber(this);
    }
    disconnectedCallback() {
        this.reducer?.deleteSubscriber(this);
    }
    attributeChangedCallback(name) {
        if (name === XReducer.dataNonce) {
            const count = this.reducer?.state;
            this.output.textContent = String(count);
        }
    }
}
class CounterButton extends HTMLElement {
    reducer;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<button><slot></slot></button>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.reducer = XReducer.findParent(this);
        this.shadowRoot
            ?.querySelector('button')
            ?.addEventListener('click', this);
    }
    handleEvent(event) {
        if (event.type === 'click') {
            const action = this.getAttribute('action');
            if (action === 'increment')
                this.reducer?.dispatch({ type: 'INCREMENT' });
        }
    }
}
addEventListener('load', () => {
    XReducer.define();
    const xReducer = document.querySelector('x-reducer');
    xReducer.use(reducer, 0);
    customElements.define('counter-button', CounterButton);
    customElements.define('counter-value', CounterValue);
});
