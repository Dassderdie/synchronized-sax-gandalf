# SynchronizedSaxGandalf

This is a proof of concept for synchronizing youtube-videos (nearly) frame accurate on different devices via a website.

It is inspired by the youtube video [Rendering at 5am](https://youtu.be/asjQNZn7vng).

## [DEMO](https://synchronized-sax-gandalf.netlify.app) [![Netlify Status](https://api.netlify.com/api/v1/badges/963b2fe0-826c-435d-9e0b-83e965acd81e/deploy-status)](https://app.netlify.com/sites/synchronized-sax-gandalf/deploys)


You can try it out like this:

1. Open the [deployed site](https://synchronized-sax-gandalf.netlify.app) (either in two browsers/windows or even on different devices)
2. Choose the same unique channel-id for all your opened sites
3. Click "Start"
4. One window should have a heading with "Leader". The others should be "Follower"s. By clicking on the Video-id field you can paste the video id of any youtube video (or choose from a small list of recommended ones).
5. Click "Play" on each window
6. Wait a bit - it can take up to 1 minute until the videos synchronize
7. Each follower has a "System time offset". On the same device it should be nearly 0ms. This is the time that the system-time (`Date.now()`) in the browser differs from the system time on the Leader window.
8. On the top left of each video you can see a time that changes every few seconds and should be under 20ms (after the videos are synchronized). This is the time the video-feed differs from its optimal time in relation to the system time.


## How does it work?

The synchronisation happens in two steps:

### Step 1.: Synchronizing the system times

I basically implemented the NTP (Network time protocol) Algorithm in JS via websockets or Pusher JS as my channel of communication between each Follower- and the Leader-clients. Look under "Clock synchronization algorithm" in the Wikipedia article for more information.

### Step 2.: Synchronizing the video feed to the "reference time"

At the currentTime (= synchronized system time) we want the currentVideoTimeto be at currentTime % videoLength. Because the currentTime or system time has been synchronized between the clients in Step 1 and the videoLength is obviously the same in all the clients (because they are supposed to play the same video) the currentVideoTime is the same too.

The big problem is that if I would just start the video at the correct time on all clients (via setTimeout()) they probably wouldn't play at the same time, because one system has e.g. network problems and the video still buffers or another program wants in this moment the processing power of the OS. Depending on the device the time from calling the start function of the video player and the actual starting of the video differs too.

I'm solving this by checking every second wether the video is at the right position (= currentTime % videoLength). If the difference to the right position is bigger than 20ms, I'm stopping the video, skipping the video to the position where it should be in 5s + the time it was late before and start it again.

The code is a bit more sophisticated (and complicated) but this is the general idea.

## Limitations
* the site is currently deployed via Netlify and uses [Pusher](https://pusher.com/), the Free tier only allows 100	concurrent connections and 200,000 messages send per day and is deployed in the EU (ireland)
* The synchronisation technic is even in theorie not 100% reliable
* Be aware that each open window streams the youtube video. This is not very resource friendly and could potentially stress your network and internet connection.

## Results

I plan to make some measurements by filming or photographing the on two devices synchronized video. Under consideration of e.g. the refresh rate of the monitor I could try to empirically determine the quality of the synchronisation.
