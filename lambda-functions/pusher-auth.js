Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

// I used https://github.com/NathanHeffley/pointer/blob/f12442f416ae9aa3929482142650b358bf50c1ca/src/functions/auth.js as inspiration
exports.handler = function (event, context, callback) {
    const query = event.queryStringParameters;
    const auth = JSON.stringify(
        pusher.authenticate(query.socket_id, query.channel_name)
    );
    const authCallback = query.callback.replace(/\"/g, '') + '(' + auth + ');';

    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/javascript',
        },
        body: authCallback,
    });
};
