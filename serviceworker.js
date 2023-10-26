/*
Copyright 2021 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Choose a cache name
const cacheName = 'cache-v1.0';
// List the files to precache
const precacheResources = [
 '/',
 '/index.html',
 '/iPad-Calculator',
 '/iPad-Calculator/index.html',
 'http://lake-e.github.io/iPad-Calculator',
 'http://lake-e.github.io/iPad-Calculator/index.html',
 'https://img.icons8.com/ios/100/help.png',
 'https://img.icons8.com/ios/100/love-circled.png',
 'https://img.icons8.com/ios/100/play-button-circled--v1.png',
 'https://fonts.googleapis.com/css2?family=Inter:wght@226;240;300;400&display=swap',
 'https://help.apple.com/assets/5D5C549A0946227A3D4D97C7/5D5C54AD0946227A3D4D97FB/en_US/cadc928b998b9ce31be75d6bffa0de65.png'
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);

  event.respondWith(
    fetch(event.request).then((response) => {
      const clonedResponse = response.clone(); // clone the response
      caches.open(cacheName).then((cache) => {
        cache.put(event.request, clonedResponse); // save the cloned response to the cache
      });
      return response; // return the original response
    }).catch(() => {
      return caches.match(event.request); // fallback to cache if network fails
    })
  );
});
