/**
 * This function simplifies typescript type assertions
 * instead of
 * ```ts
 * const a: number | string = '' as any;
 * const aIsString: boolean = true;
 * if (aIsString) {
 *     // a is still `number | string`, because `aIsString` is only an implicit assertion
 *     if (typeof a == 'string') {
 *         // now ts knows too that a is `string`
 *     }
 * }
 * ```
 * we can write:
 * ```ts
 * const a: number | string = '' as any;
 * const aIsString: boolean = true;
 * if (aIsString) {
 *     // a is still `number | string`, because `aIsString` is only an implicit assertion
 *     assert(typeof a == 'string');
 *     // now ts knows too that a is `string`
 * }
 * ```
 * this not only less nested, but explicitly states our implicit assertions (= better code readability)
 * and logs an error if they are not true (better debugging experience)
 */
export function assert(expression: boolean): asserts expression {
    if (!expression) {
        console.error('Assertion failed!');
    }
}
