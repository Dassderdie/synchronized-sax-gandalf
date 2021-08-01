export interface SyncTimeMessage {
    /**
     * The id of the client that tries to synchronize its time with the server
     */
    clientId: string;
    /**
     * Time request sent by client
     */
    startFollowerTimestamp: number;
    /**
     * Time request received by server
     */
    leaderTimestamp?: number;
}
