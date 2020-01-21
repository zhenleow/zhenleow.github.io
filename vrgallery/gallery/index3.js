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

var base_url = "https://thetfpc.com";
//var base_url = "https://thetfpcjhgjghj.com";
var facilities_url = "https://thetfpc.com/.rest/delivery/facilities" 
//var facilities_url = "https://zhenleow.github.io/vrgallery/examples/gallery2/json/facilitiesv2.jsonn";

var sub_facilities_url = "https://thetfpc.com/.rest/delivery/subfacilities" 
//var sub_facilities_url = "https://zhenleow.github.io/vrgallery/examples/gallery2/json/subfacilitiesv2.jsonn";

$(document).ready(function() {
	$.getJSON(facilities_url, function(data){
		if(data)
		{
			console.log("facilities data exists from live");
			localStorage.setItem('retrievedFacilities', JSON.stringify(data.results));
			displayFacilities(data.results);
		}
		else
		{
			console.log("facilities data does exists. Reading from cache.");
			donotsaveImage=true;
			var retrievedFacilities = localStorage.getItem('retrievedFacilities');
			//console.log('retrievedFacilities: ', JSON.parse(retrievedFacilities));
			displayFacilities(JSON.parse(retrievedFacilities));
		}
	})
	.done(function() { })
	.fail(function() { 
		console.log("facilities data retrieve failed. Reading from cache.");
		donotsaveImage=true;
		var retrievedFacilities = localStorage.getItem('retrievedFacilities');
		//console.log('retrievedFacilities: ', JSON.parse(retrievedFacilities));
		displayFacilities(JSON.parse(retrievedFacilities));
	});
});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function displayFacilities(json){
	console.log("displayFacilities");
	$.each(json, function (index, value) {
		scencesObj[value["@id"]] = value;
		if ($.inArray(value.floorLevel, levels) < 0) {
			levels.push(value.floorLevel);
		}
	});
	
	console.log(scencesObj);
	
	var type = getUrlParam('type','');
	var id = getUrlParam('id','');
	console.log("type="+type+",id="+id);
	
	if(type=='s')
	{
		loadSceneSubFacilities(id);
	}
	else
	{
		loadScene(id);
	}
	

	//generateLvlBtn();
	//generateSceneObjects("1");	
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
  
  /*vrView.setContent({
	image: 'boxkite.jpg',
    preview: 'boxkite.jpg',
    preview: 'boxkite.jpg',
	is_autopan_off: true
  });*/
	  
  //save vr image to localstorage-start
  //if(!donotsaveImage)
  //{
	  console.log("vrView image - load from live");
	  
	  vrView.setContent({
		image: base_url+scencesObj[id]["vrImage"]["@link"],
		preview: base_url+scencesObj[id]["vrThumbnail"]["@link"],
		is_autopan_off: true
	  });
	  
	  var element = document.getElementById("title");
	  element.innerHTML = scencesObj[id]["name"];

	  //var vrviewItem = document.querySelector('#vrview_hidden');
	  //vrviewItem.src=base_url+scencesObj[id]["vrImage"]["@link"];
	  //console.log(vrviewItem);
	  //var imgCanvas = document.createElement("canvas"),
	  //imgContext = imgCanvas.getContext("2d");

	  // Make sure canvas is as big as the picture
	  //imgCanvas.width = 600;
	  //imgCanvas.height = 300;

	  // Draw image into canvas element
	  //imgContext.drawImage(vrviewItem, 0, 0, vrviewItem.width, vrviewItem.height);

	  // Get canvas contents as a data URL
	  //var imgAsDataURL = imgCanvas.toDataURL('image/jpeg', 1.0);

	  // Save image into localStorage
	  /*try {
		  console.log("Save image into localStorage");
		  localStorage.setItem(scencesObj[id]["vrImage"]["@link"], imgAsDataURL);
	  }
	  catch (e) {
		  console.log("Storage failed: " + e);
	  }*/
  //}
  /*else
  {	  
	  console.log("vrView image - load from cache");
	  
	  var imageURL = localStorage.getItem(scencesObj[id]["vrImage"]["@link"]);
	  var vrviewItem = document.querySelector('#vrview_hidden');
	  vrviewItem.src = localStorage.getItem(scencesObj[id]["vrThumbnail"]["@link"]);
	  //console.log(imageURL);
	  var imageURLThumbnail = localStorage.getItem(scencesObj[id]["vrThumbnail"]["@link"]);
	  
	  var block = imageURL.split(";");
	  // Get the content type of the image
	  var contentType = block[0].split(":")[1];// In this case "image/gif"
	  // get the real base64 content of the file
	  var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

	  // Convert it to a blob to upload
	  var blob = b64toBlob(realData, contentType);
	  //console.log(blob);
	  //console.log(vrviewItem.src);
	  //console.log("setting to boxkite image");
	  vrView.setContent({
		image: blob,
		preview: blob,
		is_autopan_off: true
	  });
  }*/
  //save vr image to localstorage-end	
  
  // Unhighlight carousel items
  /*var carouselLinks = document.querySelectorAll('ul.carousel li a');
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
			
				if(data)
				{
					console.log("sub facilities data exists from live");
					localStorage.setItem(key, JSON.stringify(data.results));
					displaySubFacilities(data.results,key);
				}
				else
				{
					console.log("sub facilities data does exists. Reading from cache.");
					donotsaveImage=true;
					var retrievedSubFacilities = localStorage.getItem(key);
					//console.log('retrievedFacilities: ', JSON.parse(retrievedFacilities));
					displaySubFacilities(JSON.parse(retrievedSubFacilities),key);
				}
			})
			.done(function() { })
			.fail(function() { 
				console.log("sub facilities data retrieve failed. Reading from cache.");
				donotsaveImage=true;
				var retrievedSubFacilities = localStorage.getItem('retrievedFacilities');
				//console.log('retrievedSubFacilities: ', JSON.parse(retrievedFacilities));
				displaySubFacilities(JSON.parse(retrievedSubFacilities),key);
			});
	}
  }
  catch(err) {
	console.log("No hotspot for facility "+id);
  }*/
}

/*function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}*/

function loadSceneSubFacilities(id)
{

	$.getJSON(sub_facilities_url+"?@jcr:uuid="+id, function(data){
		if(data)
		{
			console.log("sub facilities data exists from live");
			localStorage.setItem(key, JSON.stringify(data.results));
			displaySubFacilities(data.results,key);
		}
		else
		{
			console.log("sub facilities data does exists. Reading from cache.");
			//donotsaveImage=true;
			var retrievedSubFacilities = localStorage.getItem(key);
			//console.log('retrievedFacilities: ', JSON.parse(retrievedFacilities));
			displaySubFacilities(JSON.parse(retrievedSubFacilities),key);
		}
	})
	.done(function() { })
	.fail(function() { 
		console.log("sub facilities data retrieve failed. Reading from cache.");
		//donotsaveImage=true;
		var retrievedSubFacilities = localStorage.getItem('retrievedFacilities');
		//console.log('retrievedSubFacilities: ', JSON.parse(retrievedFacilities));
		displaySubFacilities(JSON.parse(retrievedSubFacilities),key);
	});
}

function displaySubFacilities(json,key)
{
	$.each(json, function (index, value) {
		vrView.on('click', function(event) {
			vrView.setContent({
					image: base_url+value["vrImage"]["@link"],
					preview: base_url+value["vrImage"]["@link"],
					is_autopan_off: true
			});
		});
	});	
}



function onVRViewReady(e) {
  console.log('onVRViewReady');

  // Create the carousel links
  /*var carouselItems = document.querySelectorAll('ul.carousel li a');
  for (var i = 0; i < carouselItems.length; i++) {
    var item = carouselItems[i];
    item.disabled = false;

    item.addEventListener('click', function(event) {
      event.preventDefault();
	  console.log(event.target.parentNode.getAttribute('href').substring(1));
      loadScene(event.target.parentNode.getAttribute('href').substring(1));
    });
  }*/
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

/*function generateSceneObjects(level){
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
		var imgAsDataURL = imgCanvas.toDataURL('image/jpeg', 1.0);
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
}*/
