# SynchronizedSaxGandalf

This project is a proof of concept for synchronizing youtube-videos (nearly) frame-accurate on different devices via a website.

The youtube video [Rendering at 5am](https://youtu.be/asjQNZn7vng) was my inspiration.

## [DEMO](https://synchronized-sax-gandalf.netlify.app) [![Netlify Status](https://api.netlify.com/api/v1/badges/963b2fe0-826c-435d-9e0b-83e965acd81e/deploy-status)](https://app.netlify.com/sites/synchronized-sax-gandalf/deploys)

You can try it out like this:

1. Open the [deployed site](https://synchronized-sax-gandalf.netlify.app) (either in two browsers/windows or even on different devices).
2. Choose the same unique channel-id for all your opened sites.
3. Click `Start`.
4. One window should have a heading with `Leader`. The others should be `Followers`. By clicking on the Video-id field, you can paste the video id of any Youtube video (or choose from a small list of recommended ones).
5. Click `Play Client` on each window
6. Wait a bit - it can take up to 1 minute until the videos synchronize
7. Each follower has a `System time offset`. On the same device, it should be nearly 0ms. The `System time offset` specifies the difference between the system time (`Date. now()`) in the browser and the system time on the Leader window.
8. On the top left of each video, you can see a time that changes every few seconds and should be between `-10ms` and `10ms` (after the videos are synchronized). It specifies how much the video feed differs from its optimal time, assuming the system times are synchronized.

## How does it work?

The synchronization happens in two steps:

### Step 1.: Synchronizing the system times

I implemented the NTP (Network time protocol) Algorithm in JS via WebSockets or Pusher JS as my communication channel between each follower- and the Leader-clients. Look under `Clock synchronization algorithm` in the [Wikipedia article](https://en.wikipedia.org/wiki/Network_Time_Protocol).

### Step 2.: Synchronizing the video feed to the `reference time`

At the `currentTime` (= synchronized system time) we want the `currentVideoTime` to be at `currentTime % videoLength`. Because the `currentTime` or system time has been synchronized between the clients in Step 1 and the `videoLength` is the same in all the clients (because they are supposed to play the same video) the `currentVideoTime` is the same too. We call `currentTime % videoLength` from now on the `reference time`.

If I would start the video at the correct time on all clients (via `setTimeout()`), they probably wouldn't play at the same time (the `referenceTime`) because one system has, e.g., network problems and the video still buffers or another program wants at this moment the processing power of the OS. Depending on the device, the time between calling the start function of the video player and the actual starting of the video differs too.

I'm solving this by checking whether the video is in the correct position (= `referenceTime`). If the difference to the correct position is higher than 10ms, I'm stopping the video, skipping the video to the position where it should be in 5s plus the time it was late before, and starting it again.

The code is more sophisticated (and complicated) than this, but this is the main idea.

## Limitations

-   The site is currently deployed via Netlify and uses [Pusher](https://pusher.com/). The Free tier only allows 100 concurrent connections and 200,000 messages sent per day and is deployed in the EU (Ireland)
-   The synchronization technic is not 100% reliable
-   Be aware that each open window streams the youtube video. This is not very resource-friendly and could potentially stress your network and internet connection.

## Tech

-   The frontend is written in [Angular](https://angular.io/)
-   [Pusher.js](https://pusher.com/) is used for the communication between the clients
-   The authentication of the pusher clients is done via a lambda function that is deployed on Netlify

## Results

The videos are synchronized to be not more than ca. `20ms` off.

One could measure this empirically by analyzing films or photos of the synchronized video.
