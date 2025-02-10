import { defineWebHooksElements } from 'web-hooks';

class CounterValue extends HTMLElement {
    static observedAttributes = ['data-web-reducer-nonce'];
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<output></output>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
        this.output = /** @type {HTMLElement} */ (
            this.shadowRoot?.querySelector('output')
        );
    }
    connectedCallback() {
        this.output.textContent = '0';
    }

    /** @param { string } name */
    attributeChangedCallback(name) {
        console.log(name);
    }
}

class CounterButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<button><slot></slot></button>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.shadowRoot
            ?.querySelector('button')
            ?.addEventListener('click', () => {
                const action = this.getAttribute('action');
                console.log(action);
            });
    }
}

addEventListener('load', () => {
    defineWebHooksElements();
    customElements.define('counter-button', CounterButton);
    customElements.define('counter-value', CounterValue);
});
