class WebContext extends HTMLElement {
    static localName = 'web-context';
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `<slot></slot>`;
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
}
export function defineWebHooksElements() {
    if (!customElements.get(WebContext.localName))
        customElements.define(WebContext.localName, WebContext);
}
