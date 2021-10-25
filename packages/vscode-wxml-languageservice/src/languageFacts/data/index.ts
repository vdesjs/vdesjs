
import { WXMLDataV1 } from '../../wxmlLanguageTypes';
import { globalAtttribute } from './globalAttributes';
import { globalValueSets } from './globalValueSets';
import { basicContentTags } from './tags/basicContentTags';
import { elseTags } from './tags/elseTags';
import { formCompoentTags } from './tags/formCompoentTags';
import { mediaCompoentTags } from './tags/mediaCompoentTags';
import { navigatorTags } from './tags/navigatorTags';
import { openAbilityTags } from './tags/openAbilityTags';
import { viewContainerTags } from './tags/viewContainerTags';



export const wxmlData: WXMLDataV1 = {
  "version": 1,
  "tags": [
    ...viewContainerTags,
    ...basicContentTags,
    ...formCompoentTags,
    ...navigatorTags,
    ...mediaCompoentTags,
    ...openAbilityTags,
    ...elseTags

  ],
  "globalAttributes": [
    ...globalAtttribute

  ],
  "valueSets": [
    ...globalValueSets

  ]
};
