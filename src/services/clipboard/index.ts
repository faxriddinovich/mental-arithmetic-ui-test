import { Clipboard, WriteOptions } from '@capacitor/clipboard';

export async function writeToClipboard(options: WriteOptions) {
  return Clipboard.write(options);
}
