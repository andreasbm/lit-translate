## Wait for strings to be loaded before displaying the component

Sometimes you want to avoid the empty placeholders being shown initially before any of the translation strings has been loaded. To avoid this issue you might want to defer the first update of the component. Here's an example of what you could do if using `lit-element`.

```typescript
import { use, translate } from "lit-translate";
import { LitElement, customElement } from "lit-element";

@customElement("my-root-component")
export class MyRootComponent extends LitElement {

  // Defer the first update of the component until the strings has been loaded to avoid empty strings being shown
  private hasLoadedStrings = false;
  protected shouldUpdate (changedProperties: PropertyValues) {
    return this.hasLoadedStrings && super.shouldUpdate(changedProperties);
  }

  // Load the initial language and mark that the strings has been loaded.
  async connectedCallback () {
    await use("en");
    this.hasLoadedStrings = true;
    super.connectedCallback();
  }

  protected render (): TemplateResult {
    return html`
      <p>${translate("title")}</p>
    `;
  }
}
```
