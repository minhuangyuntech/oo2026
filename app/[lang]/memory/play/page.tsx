import {notFound} from 'next/navigation';
import MemoryGame from '../../../components/memory-game';
import {memoryMetadata} from '../../../memory/metadata';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return lang==='en'||lang==='ja'?memoryMetadata(lang):{};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(lang!=='en'&&lang!=='ja')notFound();return <MemoryGame initialLang={lang}/>;}
