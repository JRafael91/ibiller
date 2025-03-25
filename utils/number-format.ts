export default (locale: string, currency: string, value: number) => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}
