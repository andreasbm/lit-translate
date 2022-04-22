## 1. Define the translations

To take advantage of the translation features you need to be able to provide your translations as a JSON structure. You are able to configure how these strings are loaded, but to make things simple you are encouraged to maintain your translations as `.json` files - one for each language you support.

```json
// en.json
{
  "header": {
    "title": "Hello",
    "subtitle": "World"
  },
  "cta": {
    "awesome": "{{ animals }} are awesome!",
    "cats": "Cats"
  },
  "footer": {
    "html": "<b>Bold text</b>"
  }
}
```
