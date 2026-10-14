// Service worker: shows push notifications and opens the site on click.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'עדכון', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'עדכון';
  const options = {
    body: data.body || '',
    icon: 'https://www.izkor.gov.il/assets/defaults/person.jpg',
    badge: 'https://www.izkor.gov.il/assets/defaults/person.jpg',
    dir: 'rtl',
    lang: 'he',
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    (async () => {
      const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const c of list) {
        if (c.url.indexOf(url) !== -1 && 'focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })()
  );
});
