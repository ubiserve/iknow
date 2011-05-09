/**
 * drop down menu part
 */
var timeout = 500;
var closetimer = 0;
var ddmenuitem = 0;
var iknow_map;
var current_area;

// open hidden layer
function mopen(id)
{
    // cancel close timer
    mcancelclosetime();

    // close old layer
    if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';

    // get new layer and show it
    ddmenuitem = document.getElementById(id);
    ddmenuitem.style.visibility = 'visible';

}
// close showed layer
function mclose()
{
    if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';
}

// go close timer
function mclosetime()
{
    closetimer = window.setTimeout(mclose, timeout);
}

// cancel close timer
function mcancelclosetime()
{
    if(closetimer){
	window.clearTimeout(closetimer);
	closetimer = null;
    }
}

// close layer when click-out
document.onclick = mclose;
// -->

/**
 * iknow map part
 */

/**
 * Detect user's position
 */
function initialize() {
    var initialLocation;
    var newyork = new google.maps.LatLng(60.1698125, 24.9382401);
    var browserSupportFlag =  new Boolean();
    var myOptions = {
	zoom: 8,
	mapTypeControlOptions: {
	    mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN]
	},
	mapTypeId: google.maps.MapTypeId.HYBRID,
	mapTypeControl: false,
	navigationControl: true,
	navigationControlOptions: {
	    position: google.maps.ControlPosition.LEFT_CENTER
	}
    };
    iknow_map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            iknow_map.setCenter(initialLocation);
	    //detect_current_position(initialLocation);
        }, function() {
            handleNoGeolocation(browserSupportFlag);
        });
    // Try Google Gears Geolocation
    } else if (google.gears) {
        browserSupportFlag = true;
        var geo = google.gears.factory.create('beta.geolocation');
        geo.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
            iknow_map.setCenter(initialLocation);
	    //detect_current_position(initialLocation);
        }, function() {
            handleNoGeoLocation(browserSupportFlag);
        });
        // Browser doesn't support Geolocation
    } else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }
  
    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
            alert("Geolocation service failed, please choose your position manually");
        } else {
        alert("Your browser doesn't support geolocation. please choose your position manually.");
        }
        iknow_map.setCenter(initialLocation);
    }
}

/**
 * Set map type
 */
function set_map_type(type) {
    //google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN
    switch(type) {
	case "ROADMAP":
	    iknow_map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
	    break;
	case "HYBRID":
	    iknow_map.setMapTypeId(google.maps.MapTypeId.HYBRID);
	    break;
	case "SATELLITE":
	    iknow_map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
	    break;
	case "TERRAIN":
	    iknow_map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
	    break;
    }
}

/**
 * Detect current position
 */
function detect_current_position(initialLocation) {
    var geocoder = new google.maps.Geocoder();
    request = {
	location: initialLocation
    }
    var detect_address = geocoder.geocode(request, function(results, status){
      if (status == google.maps.GeocoderStatus.OK) {
        iknow_map.setCenter(results[0].geometry.location);
	iknow_map.setZoom(12);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}
/**
 * Change area
 */
function change_area(area) {
    var geocoder = new google.maps.Geocoder();
    request = {
	address: area
    }
    var detect_address = geocoder.geocode(request, function(results, status){
      if (status == google.maps.GeocoderStatus.OK) {
        iknow_map.setCenter(results[0].geometry.location);
	iknow_map.setZoom(12);
	current_area = area;
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}

/**
 * Show markers based on category
 */
function display_by_category(category) {
    var json_string = $("#all_urls").html();
    var url_json_obj = eval("(" + json_string + ")");
    var url = url_json_obj.category_path + current_area + "/" + category;
    $.getJSON(url,function(data){
	if (data!='') {
	    for (i in data) {
		var latlng = new google.maps.LatLng(data[i]['location_obj']['lat'],data[i]['location_obj']['lng']);
		add_marker(data[i],latlng);
	    }
	}else {
	    alert("No posts related to this category!");
	}
    });
}

/**
 * Add marker function
 */
function add_marker(data,latlng) {
    var marker = new google.maps.Marker({
	position: latlng,
	map: iknow_map
    });
    google.maps.event.addListener(marker, 'click', function() {
	set_marker_content(data);
    });
}

/**
 * Generate marker content
 */
function set_marker_content(data) {
    var json_string = $("#all_urls").html();
    var url_json_obj = eval("(" + json_string + ")");
    $("#post_id").val(data['id']);
    $(".address").html("Address:"+data['address_obj']['address']);
    var category_content = "Category:"+data['category'];
    $(".category").html(category_content);
    $(".title").html(data['title']);
    var added_time = "Added at:"+data['created_time'];
    $(".added_time").html(added_time);
    $("#content_space").html(data['content']);
    $("#comment_contents").html('');
    for (i in data['comments']) {
	var image_url = "/iknow/sites/all/modules/custom/iknow/images/";
	var content = '<div class="each_comment_title">'
	            + '<img src="'+image_url+'info_box/guest.gif">&nbsp;'
		    + data['comments'][i]['date']
		    + '&nbsp;anonymous'
		    + '</div>'
		    + '<div class="each_comment_content">'
		    + data['comments'][i]['content']
		    + '</div>'
		    + '<br />';
	$("#comment_contents").prepend(content);
    }
    $(".active_info_box").colorbox({
	width:"50%",
	inline:true,
	href:"#info_box",
	onClosed: function(){ document.getElementById("comment_part").style.display = 'none'; }
    });
    $(".active_info_box").trigger("click");
}

/**
 * Show hide the comment content
 */
function show_hide_comment() {
    if (document.getElementById("comment_part").style.display=="none" || document.getElementById("comment_part").style.display=="") {
	document.getElementById("comment_part").style.display = 'block';
    }else {
	document.getElementById("comment_part").style.display = 'none';
    }
}

/**
 * Show/Hide search panel
 */
function show_hide_search_panel() {
    var json_string = $("#all_urls").html();
    var url_json_obj = eval("(" + json_string + ")");
    var image_path = "/iknow/sites/all/modules/custom/iknow/images/";
    $(".content").hide(); //updated line, removing the #panel ID.
 
    $('#tab').toggle(function(){ //adding a toggle function to the #tab
	$('#tab').stop().animate({right:"398px"},500, function(){
	    document.getElementById("search_box_hide_show").src = image_path+"search_box/hide_box.gif";
	});
	$('#panel').stop().animate({width:"400px", opacity:0.9}, 500, function() {//sliding the #panel to 400px
	    $('.content').fadeIn('fast'); //slides the content into view.
	});  
    },
	function(){ //when the #tab is next cliked
	    $("#tab").attr("right","0");
	    $('.content').fadeOut('fast', function() { //fade out the content
		$('#tab').stop().animate({right:"0"},500, function(){
		    document.getElementById("search_box_hide_show").src = image_path+"search_box/show_box.gif";
		});
		$('#panel').stop().animate({width:"0", opacity:1}, 500); //slide the #panel back to a width of 0
	    });
	}
    );
}

/**
 * Search based on keyword
 */
function search_by_keyword() {
    if ($("#search_box").val()!='') {
        var json_string = $("#all_urls").html();
	var url_json_obj = eval("(" + json_string + ")");
	var search_url = url_json_obj.search_path+$("#search_box").val();
	$.getJSON(search_url,function(data){
	    if (data!='') {
		show_hide_search_panel();
		$("#tab").trigger("click");
		var result_num = data.length+" results for keyword "+$("#search_box").val();
		$(".results_num").html(result_num);
		$(".result_list").html('');
		for (i in data) {
		    var latlng = new google.maps.LatLng(data[i]['location_obj']['lat'],data[i]['location_obj']['lng']);
		    add_marker(data[i],latlng);
		    set_search_box_content(data[i],data[i]['location_obj']['lat'],data[i]['location_obj']['lng']);
		}
	    }else {
		show_hide_search_panel();
	    }
	});
    }else {
	alert("Please input keyword!");
    }
}

/**
 *Display content in search box
 */
function set_search_box_content(data,lat,lng) {
    var address = data['address_obj']['address']+","+data['address_obj']['city']+","+data['address_obj']['country'];
    latlng = lat+","+lng;
    var content = '<li>'
		    + '<div class="result_element" onmouseover="this.style.background=\'#DDDDDD\'; this.style.cursor=\'hand\'; " onmouseout="this.style.background=\'white\';" onclick="change_map_center(this.nextSibling.value)" >'
			+ '<span class="result_list_title">'
			+ data['title']
			+ '</span>'
			+ '<br/>'
			+ '<span class="result_list_address">'
			+ address
			+ '</span>'
		    + '</div>'
		    + '<input type="hidden" value="'+latlng+'">'
		+ '</li>'
		+ '<br />';
    $(".result_list").prepend(content);
}

/**
 * Change map center when click the result list
 */
function change_map_center(latlng) {
    var str_index = latlng.indexOf(",");
    var lat = latlng.substr(0,str_index);
    var lng = latlng.substr(str_index+1);
    var get_latlng = new google.maps.LatLng(lat,lng);
    iknow_map.setCenter(get_latlng);
    iknow_map.setZoom(17);
}

/**
 * Post comment
 */
function post_comment() {
    var json_string = $("#all_urls").html();
    var url_json_obj = eval("(" + json_string + ")");
    var comment_url = url_json_obj.post_comment_path;
    now = new Date();
    y = now.getFullYear();
    m = now.getMonth()+1;
    d = now.getDate();
    h = now.getHours();
    i = now.getMinutes();
    s = now.getSeconds();
    n = y + "-" + m + "-"+d+" "+h+":"+i+":"+s; 
    var data = {
	'post_id':$("#post_id").val(),
	'content':$("#comment_content").val(),
	'date': n
    };
    $.post(comment_url,data,function(){
	var image_url = "/iknow/sites/all/modules/custom/iknow/images/";
	var content = '<div class="each_comment_title">'
	            + '<img src="'+image_url+'info_box/guest.gif">&nbsp;'
		    + data.date
		    + '&nbsp;anonymous'
		    + '</div>'
		    + '<div class="each_comment_content">'
		    + data.content
		    + '</div>'
		    + '<br />';
	$("#comment_contents").prepend(content);
    });
}
window.onload = initialize;