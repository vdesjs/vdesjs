/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWXMLDataProvider, newWXMLDataProvider } from '@vdesjs/vscode-wxml-languageservice';
import { RequestService } from './requests';

export function fetchWXMLDataProviders(dataPaths: string[], requestService: RequestService): Promise<IWXMLDataProvider[]> {
	const providers = dataPaths.map(async p => {
		try {
			const content = await requestService.getContent(p);
			return parseWXMLData(p, content);
		} catch (e) {
			return newWXMLDataProvider(p, { version: 1 });
		}
	});

	return Promise.all(providers);
}

function parseWXMLData(id: string, source: string): IWXMLDataProvider {
	let rawData: any;

	try {
		rawData = JSON.parse(source);
	} catch (err) {
		return newWXMLDataProvider(id, { version: 1 });
	}

	return newWXMLDataProvider(id, {
		version: rawData.version || 1,
		tags: rawData.tags || [],
		globalAttributes: rawData.globalAttributes || [],
		valueSets: rawData.valueSets || []
	});
}

