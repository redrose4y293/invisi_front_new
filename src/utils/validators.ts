export function isEmail(v: string) {
  return /.+@.+\..+/.test(v);
}

export function required(v: string) {
  return v.trim().length > 0;
}
