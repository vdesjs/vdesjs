
import { join, basename, dirname } from 'path';
import { readFileSync } from 'fs';

const contents: { [name: string]: string } = {};

const serverFolder = basename(__dirname) === 'dist' ? dirname(__dirname) : dirname(dirname(__dirname));
const TYPESCRIPT_LIB_SOURCE = join(serverFolder, '../../../node_modules/typescript/lib');
const WECHAT_PATH = join(serverFolder, '../../../node_modules/@types/wechat-miniprogram/index.d.ts');

export function loadLibrary(name: string) {
	let content = contents[name];
	if (typeof content !== 'string') {
		let libPath;
		if (name === 'wechat') {
			libPath = WECHAT_PATH;
		} else {
			libPath = join(TYPESCRIPT_LIB_SOURCE, name); // from source
		}
		try {
			content = readFileSync(libPath).toString();
		} catch (e) {
      // @ts-ignore
			console.log(`Unable to load library ${name} at ${libPath}: ${e.message}`);
			content = '';
		}
		contents[name] = content;
	}



	return content;
}
