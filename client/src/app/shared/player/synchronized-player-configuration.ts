export class SynchronizedPlayerConfiguration {
    synchronisationOffset = 0;
    synchronisationStartTime = 50;
    /**
     * The time youtube needs (approximately) to buffer the videostream so that it doesn't stop after playing
     * TODO: check with player.getVideoLoadedFraction
     */
    preloadTime = 3000;
    syncPrecision = 20;
    stuckDeviation = 3000;
}
