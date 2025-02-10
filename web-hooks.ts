class WebContext extends HTMLElement {
    static localName = 'web-context';
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
}
