/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var vrView;
var vh;
var wh;
var viewport;

// All the scenes for the experience
var scenes = {
  petra: {
    image: 'petra.jpg',
    preview: 'petra-preview.jpg'
  },
  christTheRedeemer: {
    image: 'christ-redeemer.jpg',
    preview: 'christ-redeemer-preview.jpg'
  },
  machuPicchu: {
    image: 'machu-picchu.jpg',
    preview: 'machu-picchu-preview.jpg'
  },
  chichenItza: {
    image: 'chichen-itza.jpg',
    preview: 'chichen-itza-preview.jpg'
  },
  tajMahal: {
	image: 'hotel-lobby.jpg',
    preview: 'hotel-lobby.jpg'
  },
};

/*window.addEventListener('resize', () => {
  // We execute the same script as before
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  wh = window.innerWidth * 0.01;
  document.documentElement.style.setProperty('--wh', `${wh}px`);
  viewport = document.querySelector("meta[name=viewport]");
  viewport.setAttribute('content', 'width='+wh+', height='+vh+', initial-scale=1.0');
});*/

function onLoad() {
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
vh = window.innerHeight * 0.01;
wh = window.innerWidth * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
document.documentElement.style.setProperty('--wh', `${wh}px`);
viewport = document.querySelector("meta[name=viewport]");
viewport.setAttribute('content', 'width='+wh+', height='+vh+', initial-scale=1.0,maximum-scale=1.0, user-scalable=0');

  vrView = new VRView.Player('#vrview', {
    width: '100%',
    height: 480,
    image: 'blank.png',
    is_stereo: true,
    is_autopan_off: true,
	is_yaw_only: false
  });

  vrView.on('ready', onVRViewReady);
  vrView.on('modechange', onModeChange);
  vrView.on('getposition', onGetPosition);
  vrView.on('error', onVRViewError);
}

function loadScene(id) {
  console.log('loadScene', id);

  // Set the image
  vrView.setContent({
    image: scenes[id].image,
    preview: scenes[id].preview,
    is_autopan_off: true
  });

  // Unhighlight carousel items
  var carouselLinks = document.querySelectorAll('ul.carousel li a');
  for (var i = 0; i < carouselLinks.length; i++) {
    carouselLinks[i].classList.remove('current');
  }
    vrView.getPosition();
  // Highlight current carousel item
  document.querySelector('ul.carousel li a[href="#' + id + '"]')
      .classList.add('current');
}

function onVRViewReady(e) {
  console.log('onVRViewReady');

  // Create the carousel links
  var carouselItems = document.querySelectorAll('ul.carousel li a');
  for (var i = 0; i < carouselItems.length; i++) {
    var item = carouselItems[i];
    item.disabled = false;

    item.addEventListener('click', function(event) {
      event.preventDefault();
      loadScene(event.target.parentNode.getAttribute('href').substring(1));
    });
  }

  loadScene('petra');
}

function onModeChange(e) {
  console.log('onModeChange', e.mode);
}

function onVRViewError(e) {
  console.log('Error! %s', e.message);
}

function onGetPosition(e) {
    console.log(e)
}

window.addEventListener('load', onLoad);
