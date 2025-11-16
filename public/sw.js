self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'اعلان جدید';
  const options = {
    body: data.body,
    icon: '/web-app-manifest-192x192.png',
    badge: '/web-app-manifest-192x192.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientsArr => {
      if (clientsArr.length > 0) {
        clientsArr[0].focus();
      } else {
        clients.openWindow('/');
      }
    })
  );
});
