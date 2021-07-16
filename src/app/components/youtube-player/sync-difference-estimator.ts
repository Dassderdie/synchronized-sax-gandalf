export class SyncDifferenceEstimator {
    private lastDeviations: (number | null)[] = new Array(4).fill(null);
    public estimatedSyncTimeDifference?: number;
    public addDeviation(deviation: number) {
        this.lastDeviations.shift();
        this.lastDeviations.push(deviation);
        // wait until all are loaded
        if (
            this.lastDeviations.every(
                (lastDeviation) => typeof lastDeviation === 'number'
            )
        ) {
            const estimatedSyncTimeDifference = median(
                // ignore the first 3 elements because they have (likely) are likely inaccurate because of the synchronisation
                (this.lastDeviations as number[]).slice(3)
            );
            if (Math.abs(estimatedSyncTimeDifference) > 20) {
                this.estimatedSyncTimeDifference = estimatedSyncTimeDifference;
            } else if (this.lastDeviations.length < 12) {
                this.lastDeviations.unshift(null);
            }
        }
    }

    public synchronizing() {
        this.lastDeviations = new Array(4).fill(null);
        this.estimatedSyncTimeDifference = undefined;
    }
}

function median(array: number[]) {
    const sortedArray = [...array].sort((a, b) => a - b);
    var mid = sortedArray.length / 2;
    return mid % 1
        ? sortedArray[mid - 0.5]
        : (sortedArray[mid - 1] + sortedArray[mid]) / 2;
}
