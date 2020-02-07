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
var facilities_url = "https://thetfpc.com/.rest/delivery/facilities" 
var sub_facilities_url = "https://thetfpc.com/.rest/delivery/subfacilities" 

$(document).ready(function() {
	var type = getUrlParam('type','');
	var id = getUrlParam('id','');
	console.log("type="+type+",id="+id);
	
	if(type=='s')
	{
		getSubFacilityJson(id);
	}
	else
	{
		getFacilityJson(id);
	}
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
	  
  var element = document.getElementById("title");
  element.innerHTML = scencesObj[id]["name"];
}

function getSubFacilityJson(id)
{
	$.getJSON(sub_facilities_url+"?@jcr:uuid="+id, function(data){
		if(data)
		{
			console.log("sub facilities data exists from live.");
			displayVRImage(data.results);
		}
		else
		{
			console.log("sub facilities data does exists from live.");
		}
	})
	.done(function() { })
	.fail(function() { 
		console.log("sub facilities data retrieve failed.");
	});
}

function getFacilityJson(id)
{
	$.getJSON(facilities_url+"?@jcr:uuid="+id, function(data){
		if(data)
		{
			console.log("facility data exists from live.");
			//localStorage.setItem(id, JSON.stringify(data.results));
			displayVRImage(data.results);
		}
		else
		{
			console.log("facility data does not exists from live.");
		}
	})
	.done(function() { })
	.fail(function() { 
		console.log("facility data  data retrieve failed.");
	});
}

function displayVRImage(json)
{
	$.each(json, function (index, value) {
			console.log(base_url+value["vrImage"]["@link"]);
			 var element = document.getElementById("title");
			element.innerHTML = value["name"];
			vrView.setContent({
					image: base_url+value["vrImage"]["@link"],
					preview: base_url+value["vrImage"]["@link"],
					is_autopan_off: true
			});
	});	
}



function onVRViewReady(e) {
  console.log('onVRViewReady');
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

