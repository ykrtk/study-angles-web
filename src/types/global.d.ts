// Use type safe message keys with `next-intl`
// See: https://next-intl-docs.vercel.app/docs/usage/typescript
type Messages = typeof import('../../messages/en.json');
declare interface IntlMessages extends Messages {}