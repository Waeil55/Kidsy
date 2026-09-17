import {openDB} from 'idb';
const DB='kidventure-enterprise-v2';
const db=openDB(DB,1,{upgrade(d){if(!d.objectStoreNames.contains('state'))d.createObjectStore('state')}});
export async function getState<T>(key:string,fallback:T):Promise<T>{try{return (await (await db).get('state',key))??fallback}catch{return fallback}}
export async function setState<T>(key:string,value:T){try{await (await db).put('state',value,key)}catch{localStorage.setItem(`kv:${key}`,JSON.stringify(value))}}
export async function clearState(){try{await (await db).clear('state')}catch{} }
