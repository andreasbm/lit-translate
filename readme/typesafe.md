## Typesafe Translations

<img src="https://raw.githubusercontent.com/andreasbm/lit-translate/master/typesafe.gif" width="450">

If you have a lot of translation keys you can quickly lose the overview of your strings. If you use Typescript you can make the keys of your translation keys typesafe - this will also give you autocompletion when you enter the keys. To do this you have to do the following:


### 1. Add `resolveJsonModule` to your tsconfig

Add [resolveJsonModule](https://www.typescriptlang.org/tsconfig#resolveJsonModule) to your `tsconfig` which will allow us to import modules with a `.json` extension.

```json
{
  ...
  "compilerOptions": {
    ...
    "resolveJsonModule": true
  }
}
```

### 2. Use the `typedKeysFactory` function

Create a file, for example `typed-lit-translate.ts`. Then use the factory function `typedKeysFactory` and provide it with the type of one of your translation files. Use `typeof import(..)` to import the `.json` file and get the type. Provide this type to the factory function, and it will return a version of `get`, `translate` and `translateUnsafeHTML` where the keys are typed. Export these and make sure to import from your `typed-lit-translate.ts` file instead of `lit-translate`. 

```typescript
// typed-lit-translate.ts
import { typedKeysFactory } from "lit-translate";

const {get, translate, translateUnsafeHTML} = typedKeysFactory<typeof import("en.json")>();
export {get, translate, translateUnsafeHTML};
```

### 3. Import the typed functions

Make sure to import the typed versions of `get`, `translate` and `translateUnsafeHTML` that you have created instead of importing from `lit-translate`.

```typescript
import { get } from "typed-lit-translate.ts";

get("this.key.is.typed");
```