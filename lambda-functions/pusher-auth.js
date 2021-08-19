const Pusher = require('pusher');
const uuid = require('uuid').v4;

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

// I used https://github.com/NathanHeffley/pointer/blob/f12442f416ae9aa3929482142650b358bf50c1ca/src/functions/auth.js as inspiration
exports.handler = function (event, context, callback) {
    // event.body is something like this: 'socket_id=131839.71195980&channel_name=private-channel'
    const params = event.body.split('&').reduce((previousValue, keyValue) => {
        const [key, value] = keyValue.split('=');
        return {
            ...previousValue,
            [key]: value,
        };
    }, {});

    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/javascript',
        },
        body: JSON.stringify(
            pusher.authenticate(params.socket_id, params.channel_name, {
                user_id: uuid(),
            })
        ),
    });
};
