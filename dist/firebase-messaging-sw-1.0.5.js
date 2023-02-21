// Get the example code at https://github.com/firebase/quickstart-js/blob/master/messaging/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js');

// NOTE: Remember to copy this file from node_modules when updating the library
importScripts('localforage-1.9.0.min.js');

var messaging;
var fallbackUrl = 'https://fuse.agencyrevolution.com/';

// Channel to receive initialization messages from the app
const channel = new BroadcastChannel('firebaseBroadcastChannel');
channel.onmessage = function (event) {
  console.log('[sw] channel.onmessage', event.notification);
  initializeFirebase();
};

self.addEventListener('notificationclick', function (event) {
  console.log('[sw] On notification click', event.notification);

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        console.log('[sw] Found clients', clientList.length, clientList);
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (/(?:(localhost:6012|agencyrevolution.com))/.test(client.url)) {
            console.log('[sw] Fuse app is opening. Stay at the tab. Client:', client);
            return client.focus().then(() => {
              // Post messge to the app to handle notification click
              channel.postMessage({ type: 'notificationClick', url: event.notification.tag });
            });
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.tag || fallbackUrl);
        }
      })
      .catch(function (error) {
        console.log('[sw] Failed to match clients', error);
      })
  );

  event.notification.close();
});

function showNotification(data) {
  const { Title, Body, Link } = data;
  const options = {
    body: Body,
    icon: './img/ar-logo-square.png',
    click_action: Link,
    tag: Link,
  };
  fallbackUrl = Link;

  return self.registration.showNotification(Title, options);
}

function initializeFirebase() {
  return localforage
    .getItem('firebaseConfig')
    .then(function (firebaseConfig) {
      console.log('[sw] Received firebaseConfig from IndexedDB via localforage', firebaseConfig);
      if (!firebaseConfig) {
        console.log(
          '[sw] firebaseConfig have not set to DB yet, this only happend when the app loaded for the very first time. Wait for the broadcast message to set it up'
        );
        return Promise.resolve();
      }

      if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
        console.log('[sw] - Firebase app is initilized.');
      } else {
        console.log('[sw] - Firebase app is already initialized, skip.');
      }

      // Retrieve an instance of Firebase Messaging so that it can handle background messages.
      messaging = firebase.messaging();
      return Promise.resolve();
    })
    .catch(function (err) {
      console.log('[sw] Error on initializing localforage', err);
    });
}

self.addEventListener('push', function (event) {
  console.log('[sw] - Received push event', event);

  function getPayload() {
    return initializeFirebase().then((result) => {
      return Promise.resolve(event.data.json());
    });
  }

  event.waitUntil(
    getPayload()
      .then(function (data) {
        console.log('[sw] Received notification data', data);
        return showNotification(data.data);
      })
      .catch(function (err) {
        console.log('[sw] Failed to get payload', err);
      })
  );
});
