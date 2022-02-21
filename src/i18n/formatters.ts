/*
   Currently vue-i18n doesn't support passing variables into modifiers.
   So we have to write own formatter to achieve that.
*/
export class ThemeFormatter {
  // overriding the default formatter, simple and much faster.
  public interpolate(message: string, values?: any) {
    const keys = values ? Object.keys(values) : [];
    const hasplusn = message.indexOf('#plusn');

    for(const key of keys) {
      message = message.replaceAll('{' + key + '}', values[key]);
      if(hasplusn) {
        const plusn = new Intl.NumberFormat("en-US").format(
          Number("1" + "0".repeat(values ? values.digit : 0))
        );
        message = message.replaceAll('#plusn', plusn);
      }
    }
    return [message];
  }
}
