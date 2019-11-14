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
var levels = ["1", "2", "3", "4", "5", "6", "7"];

// All the scenes for the experience
var scenes = {
  medicalCentre: {
    image: 'medical-center.JPG',
    preview: 'medical-center.JPG'
  },
  redApple: {
    image: 'red-apple.JPG',
    preview: 'red-apple.JPG'
  },
  emergencyClinic: {
    image: 'emergency-clinic.JPG',
    preview: 'emergency-clinic.JPG'
  },
  boxkite: {
    image: 'boxkite.JPG',
    preview: 'boxkite.JPG'
  },
  hotelLobby: {
	image: 'hotel-lobby.jpg',
    preview: 'hotel-lobby.jpg'
  },
  carpark: {
	image: 'carpark.JPG',
    preview: 'carpark.JPG'
  },
};

var scencesObj = [];

$(document).ready(function() {
	alert("ready");
	/*$.getJSON("https://zhenleow.github.io/vrgallery/examples/gallery2/json/facilities.json", function(data){
		alert("getjson");
		for (var i = 0, len = data.length; i < len; i++) {
			console.log(data[i]);
			alert(data[i]);
		}
	});*/
    $.ajax({
        url: "https://zhenleow.github.io/vrgallery/examples/gallery2/json/facilities.json"
    }).then(function(data) {
		/*for (var i = 0, len = data.length; i < len; i++) {
			console.log(data[i]);
			alert(data[i]);
		*/
		alert(data.length);
		//var facility = {facility_id: data.id, write_up: data.content};

		//var data = [];
		//scencesObj.push(facility);
    });
});

function onLoad() {
  vrView = new VRView.Player('#vrview', {
    width: '100%',
    height: 480,
    image: 'blank.png',
    is_stereo: false,
    is_autopan_off: true
  });

  vrView.on('ready', onVRViewReady);
  vrView.on('modechange', onModeChange);
  vrView.on('getposition', onGetPosition);
  vrView.on('error', onVRViewError);
  generateLvlBtn();
}

function loadScene(id) {
  console.log('loadScene', id);

  // Set the image
  vrView.setContent({
    image: "vr_imgs/"+scenes[id].image,
    preview: "vr_imgs/"+scenes[id].preview,
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

  loadScene('redApple');
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

function generateLvlBtn(){
  buttons = $('<div class="btn-group mr-2" role="group" aria-label="First group"></div>');
  for (var i=0; i < levels.length; i++){
	buttons.append("<button type='button' class='btn btn-secondary'>" + levels[i] + "</button>");
  }
  $("#level_buttons").append(buttons);
}

$('#level_buttons').on('click', 'input', function(e){
    console.log("click: ", e.target.value);
});
	

