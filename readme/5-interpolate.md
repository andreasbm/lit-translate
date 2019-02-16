## 5. Interpolate values

When using the `get` function it is possible to interpolate values (eg. replace the placeholders with content). As default, you can simply use the `{{ key }}` syntax in your translations and provide an object with values replacing those defined in the translations when using the `get` function. The example below is based on the strings defined in `step 1`.

```typescript
import { get } from "@appnest/lit-translate";

get("cta.awesome", { things: get("cta.cats") }); // Cats are awesome!
```

