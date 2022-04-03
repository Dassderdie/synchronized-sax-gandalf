export class SynchronizedPlayerConfiguration {
    synchronisationOffset = 0;
    synchronisationStartTime = 50;
    /**
     * The time Youtube needs (approximately) to buffer the videostreams so that it doesn't stop after playing
     * TODO: check with player.getVideoLoadedFraction
     */
    preloadTime = 3000;
    /**
     * How many milliseconds are the players allowed to be off (plus the precision of the synchronized system times)
     */
    syncPrecision = 20;
    stuckDeviation = 3000;
}
