export interface VideoSettings {
    videoId: string;
    /**
     * between 0 and 1 indicating at what percentage the video should start
     */
    videoTimeOffset: number;
    volume: number;
}
