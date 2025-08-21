import {walk} from "./utils";

// javascript模块
const jsDir = '../../';
export const jsSidebar = walk(jsDir,'JavaScript');
console.log(jsSidebar)