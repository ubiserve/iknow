<?php
function theme_page($url_json) {
    $module_path = '/iknow/'.drupal_get_path('module', 'iknow');
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
    <script type="text/javascript" src="http://code.google.com/apis/gears/gears_init.js"></script>
    <link type="text/css" rel="stylesheet" media="all" href="<?php echo $module_path; ?>/plugin/colorbox/colorbox.css" />
    <link type="text/css" rel="stylesheet" media="all" href="<?php echo $module_path; ?>/plugin/easyAccordion/easyAccordion.css" />
    <link type="text/css" rel="stylesheet" media="all" href="<?php echo $module_path; ?>/css/iknow.css" />
    <script type="text/javascript" src="<?php echo $module_path; ?>/js/jquery.js"></script>
    <script type="text/javascript" src="<?php echo $module_path; ?>/plugin/colorbox/jquery.colorbox.js"></script>
    <script type="text/javascript" src="<?php echo $module_path; ?>/plugin/easyAccordion/jquery.easyAccordion.js"></script>
    <script type="text/javascript" src="<?php echo $module_path; ?>/js/iknow_map.js"></script>
</head>
<body>
    <div id="all_urls" style="display:none;">
	<?php
	      $image_path = '/iknow/'.$url_json['image_path'];
	      $url_json = json_encode($url_json);
	      printf ($url_json);
	?>
    </div>
    <div id="menu_bar">
        <ul id="sddm">
            <li><a href="#" onmouseover="mopen('m1')" onmouseout="mclosetime()">Area</a>
                <div id="m1" onmouseover="mcancelclosetime()" onmouseout="mclosetime()">
                    <a href="javascript:change_area('helsinki')">Helsinki</a>
                    <a href="javascript:change_area('espoo')">Espoo</a>
                </div>
            </li>
            <li><a href="#" onmouseover="mopen('m2')" onmouseout="mclosetime()">Categories</a>
                <div id="m2" onmouseover="mcancelclosetime()" onmouseout="mclosetime()">
                    <a href="javascript:display_by_category('restaurant')">Restaurant</a>
                    <a href="javascript:display_by_category('hotel')">Hotel</a>
                    <a href="javascript:display_by_category('library')">Library</a>
                    <a href="javascript:display_by_category('hospital')">Hospital</a>
                    <a href="javascript:display_by_category('apartment')">Apartment</a>
		    <a href="javascript:display_by_category('common')">Common</a>
                </div>
            </li>
            <li><a href="#" onmouseover="mopen('m3')" onmouseout="mclosetime()">Activities</a>
                <div id="m3" onmouseover="mcancelclosetime()" onmouseout="mclosetime()">
                    <a href="#">Coming activities</a>
                    <a href="#">History activities</a>
                </div>
            </li>
            <li><a href="#" onmouseover="mopen('m4')" onmouseout="mclosetime()">Map Type</a>
                <div id="m4" onmouseover="mcancelclosetime()" onmouseout="mclosetime()">
                    <a href="javascript:set_map_type('ROADMAP')">Google map</a>
                    <a href="javascript:set_map_type('HYBRID')">Google hybrid</a>
                    <a href="javascript:set_map_type('SATELLITE')">Google satellite</a>
                    <a href="javascript:set_map_type('TERRAIN')">Google terrain</a>
                </div>
            </li>
            <li><a href="#">Login</a></li>
            <li><a href="#">Help</a></li>
        </ul>
    </div>
    <div id="search_area">
        <input type="text" id="search_box" />
        <input type="button" id="search_button" value="Search" onclick="search_by_keyword()" />
    </div>
    <div id="map_canvas" style="width:100%; height:100%"></div>
    <div style="display:none">
	<a class="active_info_box" href="javascript:void(0)"></a>
	<div id="info_box">
	    <input type="hidden" value="" id="post_id" />
	    <div id="head_info">
		<span class="address"></span>
		<span class="category"></span>
	    </div>
	    <br />
	    <div id="picture_space"></div>
	    <div id="title_and_time">
		<span class="title"></span>
		<br />
		<span class="added_time"></span>
	    </div>
	    <br />
	    <div id="content_space"></div>
	    <br /><br /><br />
	    <div id="comments_display">
		<img src="<?php echo $image_path; ?>info_box/comments.gif" />
		<span class="place_comment">Place comments:</span>
		<div id="comment_contents"></div>
	    </div>
	    <br />
	    <div id="comment_text_box">
		<img src="<?php echo $image_path; ?>info_box/comment_add.gif" class="comment_add_image" />&nbsp;
		<a href="javascript:show_hide_comment()" class="comment_title">add your comment in English</a>
		&nbsp;<br />
		<div id="comment_part">
		    <span class="comment_message">Message:</span>
		    <br />
		    <textarea id="comment_content" cols="50" rows="8"></textarea>
		    <br />
		    <input type="button" value="Send message" onclick="post_comment()" />
		    <input type="button" value="Cancel" onclick="show_hide_comment()" />
		</div>
	    </div>
	</div>
    </div>
    <div id="search_space">
	<div id="panel"> <!--the hidden panel -->
	    <div class="content" >
		<h2 class="result_header">Search results</h2>
		<span class="results_num"></span>
		<div class="search_result_panel">
		    <ul class="result_list">
		    </ul>
		</div>
	    </div>	
	</div>
	<a id="search_box_trigger" href="javascript:void(0)" >
	    <div id="tab"><div id="image_layer"><img id="search_box_hide_show" src="<?php echo $image_path; ?>search_box/show_box.gif" /></div></div>
        </a>
    </div>
</body>
</html>
<?php
    exit;
}
$url_json['image_path'] = $image_path;
$url_json['category_path'] = $category_path;
$url_json['search_path'] = $search_path;
$url_json['post_comment_path'] = $post_comment_path;
theme_page($url_json);
?>