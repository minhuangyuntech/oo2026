import type {Metadata} from 'next';
import type {Language} from '../data';
import {memoryPlayPath,memoryText} from './text';
const origin='https://minhuangyuntech.github.io/oo2026';
export function memoryMetadata(lang:Language):Metadata{
 const title=memoryText[lang].title+' | OOP 2026',description=memoryText[lang].description;
 return {title,description,alternates:{canonical:origin+memoryPlayPath(lang),languages:{'zh-Hant':origin+memoryPlayPath('zh'),en:origin+memoryPlayPath('en'),ja:origin+memoryPlayPath('ja'),'x-default':origin+memoryPlayPath('zh')}},openGraph:{title,description,type:'website',url:origin+memoryPlayPath(lang)},icons:{icon:'/oo2026/favicon.svg'}};
}
