importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDrtZERZMmRSCecPqMni5M9bT8pWaivsr8",
  authDomain: "scacchi-b74ea.firebaseapp.com",
  projectId: "scacchi-b74ea",
  storageBucket: "scacchi-b74ea.firebasestorage.app",
  messagingSenderId: "936339104640",
  appId: "1:936339104640:web:907f7b22089c35125bd765"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || '♟ Scacchi Regali';
  const body  = payload.notification?.body  || 'È il tuo turno!';
  self.registration.showNotification(title, { body, icon: '/icon-192.png' });
});
