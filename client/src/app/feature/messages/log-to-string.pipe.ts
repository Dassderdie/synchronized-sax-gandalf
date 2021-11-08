import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
    name: 'logToString',
})
export class LogToStringPipe implements PipeTransform {
    transform(logValue: any): string | null {
        switch (typeof logValue) {
            case 'boolean':
            case 'number':
            case 'string':
            case 'symbol':
            case 'undefined':
            case 'bigint':
                return logValue?.toString().replace(/\\n/gu, `\n`) ?? null;
            case 'function':
                return 'function';
            default:
                try {
                    return JSON.stringify(
                        logValue,
                        this.getCircularReplacer(),
                        2
                    ).replace(/\\n/gu, `\n`);
                } catch {
                    return `Not able to display the Log-object.`;
                }
        }
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#examples
     */
    private readonly getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key: string, value: any) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return 'CYCLIC REFERENCE';
                }
                seen.add(value);
            }
            return value;
        };
    };
}
