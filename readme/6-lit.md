## 6. Use the `translate` directive with `lit`

If you are using [lit](https://www.npmjs.com/package/lit) you might want to use the `translate` directive. This directive makes sure to automatically update all the translated parts when the `use` function is called with a new language. If your strings contain HTML you can use the `translateUnsafeHTML` directive. The example below is based on the strings defined in [step 1](#-1-define-the-translations) and registered in [step 2](#-2-register-the-translate-config).

```typescript
import { translate, translateUnsafeHTML } from "lit-translate";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-element")
class MyElement extends LitElement {
  render () {
    html`
      <h1>${translate("header.title")}</h1>
      <p>${translate("header.subtitle")}</p>
      <span>${translate("cta.awesome", { animals: () => get("cta.cats") })}</span>
      <span>${translateUnsafeHTML("footer.html")}</span>
    `;
  }
}
```
