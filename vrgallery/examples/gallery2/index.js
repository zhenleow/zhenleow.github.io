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
var levels = [];
var scencesObj = [];
var firstSceneId;

var base_url = "https://thetfpc.com";
var facilities_url = "https://thetfpc.com/.rest/delivery/facilities" 
//var facilities_url = "https://zhenleow.github.io/vrgallery/examples/gallery2/json/facilitiesv2.json";

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

$(document).ready(function() {
	//console.log("document ready");
	//https://thetfpc.com/.rest/delivery/facilities
	var count=0;
	$.getJSON(facilities_url, function(data){
		//console.log(data.results);
		$.each(data.results, function (index, value) {
			if(count==0)
			{
				firstSceneId = value["@id"];
				console.log(firstSceneId);
			}
			scencesObj[value["@id"]] = value;
			if ($.inArray(value.floorLevel, levels) >= 0) {
			}else {
			  levels.push(value.floorLevel);
			}

			count++;
		});
		console.log(scencesObj);
		//generate-carousell-start
		var caroul = $('<ul id= "carousell" class="carousel">');
		for(var key in scencesObj) {
		  var value = scencesObj[key];
		  caroul.append("<li><a href='#"+value["@id"]+"'><img src='"+base_url+value["vrThumbnail"]["@link"]+"'><small>"+value["name"]+"</small></a></li>");
		}
		caroul.append("</ul>");
		$("#carousell_div").append(caroul);
		 generateLvlBtn();
		//generate-carousell-end
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
  //generateLvlBtn();
  //generateSceneObjects();
}

function loadScene(id) {
  //console.log('loadScene', id);

  vrView.setContent({
    image: base_url+scencesObj[id]["vrImage"]["@link"],
    preview: base_url+scencesObj[id]["vrThumbnail"]["@link"],
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

  loadScene(firstSceneId);
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
  levels.sort((a, b) => a - b);
  for (var i=0; i < levels.length; i++){
	buttons.append("<button type='button' class='btn btn-secondary'>" + levels[i] + "</button>");
  }
  $("#level_buttons").append(buttons);
}

function generateSceneObjects(obj){
	console.log(obj);
	var id="db5ecebd-0e4a-4864-865e-7b6d2c5de2c9";
	console.log(obj[firstSceneId]["vrImage"]["@link"]);
	/*for(var key in scencesObj) {
	  console.log("generateSceneObjects-forloop");
	  var value = scencesObj[key];
	  console.log(value);
	}*/

	//sceneObj = $('');
	

	/*for (var i=0; i < scencesObj.length; i++){
		sceneObj.append("<li>");
		//sceneObj.append("<a href=\"#"+scencesObj[i][0]["@id"]+">");
		sceneObj.append("<a href=\"#"+i+">");
	    sceneObj.append("<img src=\""+base_url+scencesObj[i]["vrThumbnail"]["@link"]+">");
		sceneObj.append("<small>"+scencesObj[i]["name"]+"</small>");
		sceneObj.append("</a></li>");*/
		/*<li>
        <a href="#redApple">
          <img src="vr_imgs/red-apple.JPG">
          <small>Red Apple</small>
        </a>
      </li>*/
	//}
	//console.log(sceneObj);
	//$("#carousell").append(sceneObj);
}

$('#level_buttons').on('click', 'input', function(e){
    console.log("click: ", e.target.value);
});
	

