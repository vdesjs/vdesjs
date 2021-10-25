
import * as arrays from '../utils/arrays';

export const VOID_ELEMENTS: string[] = ['br', 'hr', 'input',];

export function isVoidElement(e: string): boolean {
	return !!e && arrays.binarySearch(VOID_ELEMENTS, e.toLowerCase(), (s1: string, s2: string) => s1.localeCompare(s2)) >= 0;
}