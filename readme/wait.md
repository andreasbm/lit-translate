## Wait for strings to be loaded before displaying the component

Sometimes you want to avoid the empty placeholders being shown initially before any of the translation strings has been loaded. To avoid this issue you might want to defer the first update of the component. Here's an example of what you could do if using `lit-element`.

```js
import { use, translate } from "lit-translate";
import { LitElement, html } from "lit-element";

export class MyApp extends LitElement {

  // Construct the component
  constructor () {
    super();
    this.hasLoadedStrings = false;
  }

  // Defer the first update of the component until the strings have been loaded to avoid empty strings being shown
  shouldUpdate (changedProperties) {
    return this.hasLoadedStrings && super.shouldUpdate(changedProperties);
  }

  // Load the initial language and mark that the strings have been loaded.
  async connectedCallback () {
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

customElements.define("my-app", MyApp);
```
