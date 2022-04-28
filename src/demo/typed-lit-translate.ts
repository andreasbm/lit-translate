import { typedKeysFactory } from "../lib/typed-keys";

const {get, translate, translateUnsafeHTML} = typedKeysFactory<typeof import("./assets/i18n/en.json")>();
export {get, translate, translateUnsafeHTML};