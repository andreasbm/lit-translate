## 6. Use the `translate` directive with `lit-html`

If you are using `lit-html` or `lit-element` you might want to use the `translate` directive. This directive makes sure to automatically update all of the translated parts when the `use` function is called with a new language and the global `langChanged` event is dispatched. Note that values have to be returned from callbacks to refresh the translated values. If your strings contain HTML you can use the `translateUnsafeHTML` directive.

```js
import { translate, translateUnsafeHTML } from "lit-translate";
import { LitElement, html } from "lit-element";

class MyComponent extends LitElement {
  render () {
    html`
      <h1>${translate("header.title")}</h1>
      <p>${translate("header.subtitle")}</p>
      <span>${translate("cta.awesome", { things: () => get("cta.cats") })}</span>
      <span>${translateUnsafeHTML("footer.html")}</span>
    `;
  }
}
```
