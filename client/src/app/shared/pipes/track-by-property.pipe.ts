import type { PipeTransform, TrackByFunction } from '@angular/core';
import { Pipe } from '@angular/core';
import { objectToKey } from 'src/app/utilities/object-to-key';

// Since the resultant TrackBy functions are based purely on a static property names,
// they can be cached across the entire app.
const cache: {
    [propertyName: string]: TrackByFunction<unknown>;
} = {};

//  See https://www.bennadel.com/blog/3580-using-pure-pipes-to-generate-ngfor-trackby-identity-functions-for-mixed-collections-in-angular-7-2-7.htm
@Pipe({
    name: 'trackByProperty',
})
export class TrackByPropertyPipe implements PipeTransform {
    /**
     * @param propertyNames the key(s) which make an unique identifier for the item in the ngFor loop
     * $index: the position of the item (assumes the position of the array is stable during change-detection)
     * $objectToKey: the stringified item (the items should be (small) json-like-values (no functions), and there is no unique id one could use instead)
     * null: the item itself is unique (item is a primitive type)
     * string: the key of one property that identifies the unique id (put a . between properties e.g. 'user.id')
     * string[]: the keys of all properties whose combined values are unique
     * @returns a trackBy function that plucks the given properties from the ngFor item
     */
    public transform(
        propertyNames: string[] | string | '$index' | '$objectToKey' | null
    ): TrackByFunction<unknown> {
        let cacheKey: string;
        const propertyNamesIsArray = Array.isArray(propertyNames);
        if (propertyNamesIsArray) {
            cacheKey = (propertyNames as string[]).join(',');
        } else {
            cacheKey = (propertyNames as string) || '';
        }
        // If this function wasn't cached yet
        if (!cache[cacheKey]) {
            if (propertyNamesIsArray) {
                cache[cacheKey] = (index: number, item: any) => {
                    const values = [];
                    // Collect the item values that will be aggregated in the resultant
                    // Item identity
                    for (const propertyName of propertyNames as string[]) {
                        values.push(item[propertyName]);
                    }
                    return values.join(',');
                };
            } else if (cacheKey === '$index') {
                // TrackBy index
                cache[cacheKey] = (index: number, item: any) => index;
            } else if (cacheKey === '$objectToKey') {
                cache[cacheKey] = (index: number, item: any) =>
                    objectToKey(item);
            } else if (cacheKey === '') {
                cache[cacheKey] = (index: number, item: unknown) => item;
            } else if (cacheKey.includes('.')) {
                const keys = cacheKey.split('.');
                cache[cacheKey] = (index: number, item: any) => {
                    let value = item;
                    for (const key of keys) {
                        value = value[key];
                    }
                    return value;
                };
            } else {
                // Performance improvement
                cache[cacheKey] = (index: number, item: any) => item[cacheKey];
            }
        }
        return cache[cacheKey]!;
    }
}
