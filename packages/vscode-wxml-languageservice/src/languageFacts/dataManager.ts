

import { IWXMLDataProvider } from '../wxmlLanguageTypes';
import { WXMLDataProvider } from './dataProvider';
import { wxmlData } from './data';

export class WXMLDataManager {
	private dataProviders: IWXMLDataProvider[] = [];

	constructor(options: { useDefaultDataProvider?: boolean, customDataProviders?: IWXMLDataProvider[] }) {
		this.setDataProviders(options.useDefaultDataProvider !== false, options.customDataProviders || []);
	}
	setDataProviders(builtIn: boolean, providers: IWXMLDataProvider[]) {
		this.dataProviders = [];
		if (builtIn) {
			this.dataProviders.push(new WXMLDataProvider('wxml', wxmlData));
		}
		this.dataProviders.push(...providers);
	}

	getDataProviders() {
		return this.dataProviders;
	}
}