var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BE8V8Ubx7DCSHoiDOuzphlsf8KAbCWj1xGKpKjNQj3TYYLMIN4X0-TkS9Psyr49WaTbHlEfEdiUSpw5iLs7DXqo",
    "privateKey": "qOl4bpoKP242JN8e9cWfKJf32SwmtAc7TKNfY_3wESQ"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/eQKzyp3mG_o:APA91bHbFDMpFSl1dLYYxz5yaOLrJkHfq4CKbJuou0WLBRtyxdTf7riAz8ixhvQEOHjOffKH2jbqNOK5tj_aQ0Sb3CeaiD4dFyD7oYwcBI49hdbTyJRJoFVN6theOX4qU2o0dRrKtMrD",
    "keys": {
        "p256dh": "BPbqaLmWqqQSrsHnmkXNv+5olX5nGIYYGLGbkb0mg7Z5jN4KiVtc9RYeNPM6KwZ9FMttQNHjQvI7vr960PCFymY=",
        "auth": "8sIQjI7H3nwTCCWhpgUkeA=="
    }
};
var payload = 'Selamat, anda sudah mendapat notifikasi dari kami!';

var options = {
    gcmAPIKey: '402180080929',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);