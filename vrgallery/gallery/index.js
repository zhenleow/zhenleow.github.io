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
var donotsaveImage=false;

//var base_url = "https://thetfpc.com";
var base_url = "https://thetfpcjhgjghj.com";
//var facilities_url = "https://thetfpc.com/.rest/delivery/facilities" 
var facilities_url = "https://zhenleow.github.io/vrgallery/examples/gallery2/json/facilitiesv2.json";

var sub_facilities_url = "https://thetfpc.com/.rest/delivery/subfacilities" 
//var sub_facilities_url = "https://zhenleow.github.io/vrgallery/examples/gallery2/json/subfacilitiesv2.json";

$(document).ready(function() {
	$.getJSON(facilities_url, function(data){
		if(data)
		{
			console.log("facilities data exists");
			localStorage.setItem('retrievedFacilities', JSON.stringify(data.results));
			displayFacilities(data.results);
		}
		else
		{
			console.log("facilities data does exists");
			var retrievedFacilities = localStorage.getItem('retrievedFacilities');
			//console.log('retrievedFacilities: ', JSON.parse(retrievedFacilities));
			displayFacilities(JSON.parse(retrievedFacilities));
		}
	})
	.done(function() { })
	.fail(function() { 
		console.log("facilities data retrieve failed");
		var retrievedFacilities = localStorage.getItem('retrievedFacilities');
		//console.log('retrievedFacilities: ', JSON.parse(retrievedFacilities));
		displayFacilities(JSON.parse(retrievedFacilities));
	});
});

/*document.addEventListener('readystatechange', event => {

    if (event.target.readyState === "interactive") {   //same as:  ..addEventListener("DOMContentLoaded".. and   jQuery.ready
        alert("All HTML DOM elements are accessible");
    }

    if (event.target.readyState === "complete") {
		saveFacilitiesImages();
        alert("Now external resources are loaded too, like css,src etc... ");
    }

});*/

function displayFacilities(json){
	$.each(json, function (index, value) {
		scencesObj[value["@id"]] = value;
		if ($.inArray(value.floorLevel, levels) < 0) {
			levels.push(value.floorLevel);
		}
	});
	generateLvlBtn();
	generateSceneObjects("1");	
}

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
}

function loadScene(id) {
  console.log('loadScene', id);

  vrView.setContent({
	image: base_url+scencesObj[id]["vrImage"]["@link"],
	preview: base_url+scencesObj[id]["vrThumbnail"]["@link"],
	is_autopan_off: true
  });
	  
  /*//save vr image to localstorage-start
  if(!donotsaveImage)
  {
	  console.log("load from live");
	  
	  vrView.setContent({
		image: base_url+scencesObj[id]["vrImage"]["@link"],
		preview: base_url+scencesObj[id]["vrThumbnail"]["@link"],
		is_autopan_off: true
	  });

	  var vrviewItem = document.querySelector('#vrview_hidden');
	  vrviewItem.src=base_url+scencesObj[id]["vrImage"]["@link"];
	  console.log(vrviewItem);
	  var imgCanvas = document.createElement("canvas"),
	  imgContext = imgCanvas.getContext("2d");

	  // Make sure canvas is as big as the picture
	  imgCanvas.width = vrviewItem.width;
	  imgCanvas.height = vrviewItem.height;

	  // Draw image into canvas element
	  imgContext.drawImage(vrviewItem, 0, 0, vrviewItem.width, vrviewItem.height);

	  // Get canvas contents as a data URL
	  var imgAsDataURL = imgCanvas.toDataURL("image/png");

	  // Save image into localStorage
	  try {
		  console.log("Save image into localStorage");
		  localStorage.setItem(scencesObj[id]["vrImage"]["@link"], imgAsDataURL);
	  }
	  catch (e) {
		  console.log("Storage failed: " + e);
	  }
	  
  }
  else
  {	  
	  console.log("load from cache");
	  vrView.setContent({
		image: localStorage.getItem(scencesObj[id]["vrImage"]["@link"]),
		preview: localStorage.getItem(scencesObj[id]["vrThumbnail"]["@link"]),
		is_autopan_off: true
	  });
  }
  //save vr image to localstorage-end	*/
  
  // Unhighlight carousel items
  var carouselLinks = document.querySelectorAll('ul.carousel li a');
  for (var i = 0; i < carouselLinks.length; i++) {
    carouselLinks[i].classList.remove('current');
  }
    vrView.getPosition();
  // Highlight current carousel item
  document.querySelector('ul.carousel li a[href="#' + id + '"]')
      .classList.add('current');

  var element = document.getElementById("title");
  element.innerHTML = scencesObj[id]["name"];
	
  element = document.getElementById("desc");
  element.innerHTML = scencesObj[id]["writeup"];

  //console.log(scencesObj[id]);
  var hotspots = scencesObj[id]["hotspots"];
  //console.log(hotspots[0]);
  
  try{
	for(var j = 0; j < hotspots.length; j++){
		//console.log(hotspots[key]);
		var key = hotspots[j];
		console.log(sub_facilities_url+"?@jcr:uuid="+key);
		
		$.getJSON(sub_facilities_url+"?@jcr:uuid="+key, function(data){
				$.each(data.results, function (index, value) {
					vrView.addHotspot(key, {
					  pitch: 30, // In degrees. Up is positive.
					  yaw: 20, // In degrees. To the right is positive.
					  radius: 0.05, // Radius of the circular target in meters.
					  distance: 2 // Distance of target from camera in meters.
					});
					/*vrView.addHotspot(key, {
					  pitch: value["pitch"], // In degrees. Up is positive.
					  yaw: value["yaw"], // In degrees. To the right is positive.
					  radius: value["radius"], // Radius of the circular target in meters.
					  distance: value["distance"] // Distance of target from camera in meters.
					});*/
					console.log("name="+value["name"]+" pitch="+value["pitch"]+" yaw="+value["yaw"]+" radius="+value["radius"]+" distance="+value["distance"]);
					vrView.on('click', function(event) {
					//if (event.id == myHotspotId) {
						// Handle hotspot click.
						//console.log(base_url+value["vrImage"]["@link"]);
						vrView.setContent({
							image: base_url+value["vrImage"]["@link"],
							preview: base_url+value["vrImage"]["@link"],
							is_autopan_off: true
						});
					  //}
					});
				});
			});
	}
  }
  catch(err) {
	console.log("No hotspot for facility "+id);
  }
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
	  console.log(event.target.parentNode.getAttribute('href').substring(1));
      loadScene(event.target.parentNode.getAttribute('href').substring(1));
    });
  }
}

function onModeChange(e) {
  console.log('onModeChange', e.mode);
}

function onVRViewError(e) {
  console.log('Error! %s', e.message);
}

function onGetPosition(e) {
    console.log(e);
}

window.addEventListener('load', onLoad);

function generateLvlBtn(){
  buttons = $('<div class="btn-group mr-2" role="group" aria-label="First group"></div>');
  levels.sort((a, b) => a - b);
  for (var i=0; i < levels.length; i++){
	buttons.append("<button type='button' class='btn btn-secondary' onclick='generateSceneObjects(this.value)' value='"+levels[i]+"'>" + levels[i] + "</button>");
  }
  $("#level_buttons").append(buttons);
}

function generateSceneObjects(level){
	console.log("generateSceneObjects");
	$("#carousell_div").html("");
	//generate-carousell-start
	var caroul = $('<ul id= "carousell" class="carousel">');
	var count=0;
	for(var key in scencesObj) {
		var value = scencesObj[key];
		if(value["floorLevel"]==level)
		{
			if(count==0)
			{
				firstSceneId = value["@id"];
			}
			//caroul.append("<li onclick='loadScene(\""+value["@id"]+"\")'><a href='#"+value["@id"]+"'><img src='"+base_url+value["vrThumbnail"]["@link"]+"' onerror='this.onerror=null;this.src='"+localStorage.getItem(value["vrThumbnail"]["@link"])+"';'><small>"+value["name"]+"</small></a></li>");
			caroul.append("<li onclick='loadScene(\""+value["@id"]+"\")'><a href='#"+value["@id"]+"'><img src='"+base_url+value["vrThumbnail"]["@link"]+"' onload='cacheImage(this)' onerror='loadImageFromLocalStorage(this)'/><small>"+value["name"]+"</small></a></li>");
			count++;
		}
	}
	caroul.append("</ul>");
	$("#carousell_div").append(caroul);
	loadScene(firstSceneId);
	//generate-carousell-end
}

function saveFacilitiesImages(){
	console.log("saveFacilitiesImages");
	if(!donotsaveImage)
	{
	  var carouselItems = document.querySelectorAll('ul.carousel li a img');
	  for (var i = 0; i < carouselItems.length; i++) {
		var storage_id=carouselItems[i].src.substring(base_url.length,carouselItems[i].src.length);
		console.log("saveFacilitiesImages"+storage_id);
		var imgItem = carouselItems[i];
		console.log(imgItem);
		
		var imgCanvas = document.createElement("canvas"),
		imgContext = imgCanvas.getContext("2d");

		// Make sure canvas is as big as the picture
		//imgCanvas.width = imgItem.width;
		//imgCanvas.height = imgItem.height;

		imgCanvas.width = 600;
		imgCanvas.height = 300;
		
		// Draw image into canvas element
		imgContext.drawImage(imgItem, 0, 0,600,300);
		//console.log(imgItem.width, imgItem.height);
		// Get canvas contents as a data URL
		var imgAsDataURL = imgCanvas.toDataURL("image/png");
		//var imgAsDataURL = imgCanvas.toDataURL();
		
		// Save image into localStorage
		try {
			localStorage.setItem(storage_id, imgAsDataURL);
		}
		catch (e) {
			console.log("Storage failed: " + e);
		}
	  }
	}
}
function loadImageFromLocalStorage(imgItem){
	donotsaveImage=true;
	//console.log(imgItem);
	console.log("loadImageFromLocalStorage:"+imgItem.src.substring(base_url.length,imgItem.src.length));
	
	 var picture = localStorage.getItem(imgItem.src.substring(base_url.length,imgItem.src.length));
	 imgItem.src = picture;
	 imgItem.onerror=null;
}

function cacheImage(imgItem){
	if(!donotsaveImage)
	{
		console.log("cacheImage");
		var storage_id=imgItem.src.substring(base_url.length,imgItem.src.length);
		var imgCanvas = document.createElement("canvas"),
		imgContext = imgCanvas.getContext("2d");

		// Make sure canvas is as big as the picture
		//imgCanvas.width = imgItem.width;
		//imgCanvas.height = imgItem.height;

		imgCanvas.width = 600;
		imgCanvas.height = 300;
			
		// Draw image into canvas element
		imgContext.drawImage(imgItem, 0, 0,600,300);
		//console.log(imgItem.width, imgItem.height);
		// Get canvas contents as a data URL
		var imgAsDataURL = imgCanvas.toDataURL("image/png");
		//var imgAsDataURL = imgCanvas.toDataURL();
			
		// Save image into localStorage
		try {
			localStorage.setItem(storage_id, imgAsDataURL);
		}
		catch (e) {
			console.log("Storage failed: " + e);
		}
		imgItem.onload=null;
	}
}
