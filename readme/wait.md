## Wait for strings to be loaded before displaying your app

You might want to avoid empty placeholders being shown initially before any of the translation strings have been loaded. This it how you could defer the first render of your app until the strings have been loaded.

```typescript
import { use, translate } from "lit-translate";
import { LitElement, html, PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("my-app")
export class MyApp extends LitElement {
  
  // Defer the first update of the component until the strings has been loaded to avoid empty strings being shown
  @state() hasLoadedStrings = false;

  protected shouldUpdate(props: PropertyValues) {
    return this.hasLoadedStrings && super.shouldUpdate(props);
  }

  // Load the initial language and mark that the strings has been loaded so the component can render.
  async connectedCallback() {
    super.connectedCallback();

    await use("en");
    this.hasLoadedStrings = true;
  }

  // Render the component
  protected render () {
    return html`
      <p>${translate("title")}</p>
    `;
  }
}
```
