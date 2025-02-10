class WebContext extends HTMLElement {
    static localName = 'web-context';
}
export function defineWebHooksElements() {
    if (!customElements.get(WebContext.localName))
        customElements.define(WebContext.localName, WebContext);
}
