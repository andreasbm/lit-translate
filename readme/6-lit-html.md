## 6. Use the `translate` directive with `lit-html`

If you are using `lit-html` you might want to use the `translate` directive. This directive makes sure to automatically update all of the translated parts when the `use` function is called and the global `langChanged` event is dispatched. Note that values have to be returned from callbacks to refresh the translated values.

```typescript
import { translate } from "@appnest/lit-translate";

class MyComponent extends LitElement {
  render () {
    html`
      <h1>${translate("header.title")}</h1>
      <p>${translate("header.subtitle")}</p>
      <span>${translate("cta.awesome", { things: () => get("cta.cats") })}</span>
    `;
  }
}
```
