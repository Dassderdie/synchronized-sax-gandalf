export class VideoSettings {
    public readonly videoId = VideoSettings.recommendedVideoIds[0];
    /**
     * between 0 and 1 indicating at what percentage the video should start
     */
    public readonly videoTimeOffset: number = 0;
    public readonly volume: number = 100;

    public static readonly recommendedVideoIds = [
        'BBGEG21CGo0',
        's4lyelymLac',
        'jRA1HBZhJ18',
    ];
}
