## `lit` Directives

### Re-render a value when the language changes with the `langChanged` directive

Use the `langChanged` directive to re-render a value when the language changes.

```typescript
import { langChanged, translateConfig } from "lit-translate";
import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-component")
export class MyComponent extends LitElement {
  protected render(): TemplateResult {
    return html`
      <img src="${langChanged(() => `img-${translateConfig.lang || "en"}.png`)}" />
    `;
  }
}
```

### Create your own `lit` directives that re-renders a value when the language changes

Extend the `LangChangedDirectiveBase` base class to create your own directives that re-renders a value when the language changes. Below is an example of a directive that localizes assets paths based on the selected language.

```typescript
import { LangChangedDirectiveBase, ITranslateConfig, translateConfig } from "lit-translate";

export const localizeAssetPath = directive(class extends LangChangedDirectiveBase {
  render (fileName: string, config: ITranslateConfig = translateConfig) {
    return this.renderValue(() => `localized-assets/${config.lang || "en"}/${fileName}`);
  }
});
```