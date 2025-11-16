/**
 * KIRO IDE 教程 Service Worker
 * 用于缓存静态资源和实现离线功能
 */

const CACHE_NAME = 'kiro-tutorial-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/optimization.js',
    '/module-1.html',
    '/module-2.html',
    '/module-3.html',
    '/module-4.html',
    '/module-5.html',
    '/module-6.html',
    '/module-7.html',
    '/module-8.html'
];

// 安装事件
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker 安装中...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 缓存已打开');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('📦 所有资源已缓存');
                return self.skipWaiting();
            })
    );
});

// 激活事件
self.addEventListener('activate', (event) => {
    console.log('📦 Service Worker 激活中...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('📦 删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// 获取事件
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果缓存中有，则返回缓存
                if (response) {
                    console.log('📦 从缓存获取:', event.request.url);
                    return response;
                }

                // 否则从网络获取
                return fetch(event.request).then((response) => {
                    // 检查是否有效响应
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // 克隆响应
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            console.log('📦 缓存新资源:', event.request.url);
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                console.log('📦 离线模式 - 返回缓存或错误页面');
                // 可以返回自定义离线页面
                return caches.match('/offline.html');
            })
    );
});

// 消息事件
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 后台同步事件（可选）
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

// 推送事件（可选）
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : '您有新的学习内容！',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('KIRO IDE 教程', options)
    );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
    console.log('📬 通知被点击');
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});

// 同步数据函数
function syncData() {
    console.log('🔄 同步数据中...');
    // 这里可以实现数据同步逻辑
    return Promise.resolve();
}