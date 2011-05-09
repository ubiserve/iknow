<?php

function iKnowWS_iknodecontroller_GET($arg){
    /*$nid = $_GET['nid'];
    $node = node_load($nid, NULL, TRUE);
    if($node && $node->type=='iknow_node'){
        $body = array(
            'nid' => $node->nid,
            'title' => $node->title,
            'type' => $node->type_name,
            'latitude' => $node->latitude,
            'longitude' => $node->longitude,
            'address' => $node->address_info,
            'content' => $node->body,
        );
        return array(
            'response_code' => '200', // OK
            'headers' => array(),
            'body' => json_encode($body),
            'media_type' => 'text/plain',
            'charset' => 'utf-8',
        );
    }else{*/
        return _request_return_item_not_found();
    //}
}
function iKnowWS_iknodecontroller_POST($arg){
    //check current session status is login or not
    if(user_is_anonymous()){
        return _request_return_require_login();
    }
    
    //get current user
    global $user; 
    
    $title = $_POST['title'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];
    $keyword = $_POST['keyword'];
    $category = $_POST['category'];
    $picture = $_POST['picture'];
    $address = $_POST['address'];
    watchdog('debug',$address);
    $city = $_POST['city'];
    $country = $_POST['country'];
    $content = $_POST['content'];
    
    //prepare node
    $node = (object) $node;
    $node->title = $title;
    $node->lat = $lat;
    $node->lng = $lng;
    $node->picture = $picture;
    $node->keyword = $keyword;
    $node->address = array(
        'address' => $address,
        'city' => $city,
        'country' => $country,
    );
    $node->content = $content;
    $node->category=$category;
    $node->uid = $user->uid;
    
    if(_iknow_node_validate($node)){
        //get location id
        $l_get_sql = "SELECT location_id FROM {iknow_location} WHERE lat='%s' AND lng='%s'";
        $lid = db_result(db_query($l_get_sql,$node->lat,$node->lng));
        if($lid==FALSE){
            //Insert location
            $l_sql = "INSERT INTO {iknow_location} (lat,lng) VALUES('%s','%s')";
            if(db_query($l_sql,$node->lat,$node->lng)){
                $lid = db_result(db_query($l_get_sql,$node->lat,$node->lng));
            }else{
                return _request_return_post_error();
            }
        }
        
        //get address id
        $a_get_sql = "SELECT address_id FROM {iknow_address} WHERE country='%s' AND city='%s' AND address='%s'";
        $aid = db_result(db_query($a_get_sql,$country,$city,$address));
        if($aid==FALSE){
            //Add new address into database
            $a_sql = "INSERT INTO {iknow_address} (address,city,country) VALUES('%s','%s','%s')";
            if(db_query($a_sql,$address,$city,$country)){
                $aid = db_result(db_query($a_get_sql,$country,$city,$address));
            }else{
                return _request_return_post_error();
            }
        }
        //TODO picture upload part.
        
        //get category_id
        $cat_sql = "SELECT category_id FROM {iknow_category} WHERE category='%s'";
        $category_id = db_result(db_query($cat_sql,$category));
        //Add new iknow post into database    
        $sql = "INSERT INTO {iknow_post} "
              ."(location_id, address_id, uid, category_id, picture, title, keyword, content, created_time, changed_time)"
              ." VALUES(%d,%d,%d,%d,'%s','%s','%s','%s',now(),now())";
        if(db_query($sql,$lid,$aid,$node->uid,$category_id,$node->picture,$node->title,$node->keyword,$node->content)){
            return array(
                'response_code' => '200', // OK
                'headers' => array(),
                'body' => 'Post new iknow successfully',
                'media_type' => 'text/plain',
                'charset' => 'utf-8',
            );
        }else{
            return _request_return_post_error();
        }
        
    }else{
        return array(
            'response_code' => '403', // failed
            'headers' => array(),
            'body' => 'Paramates incorrect.',
            'media_type' => 'text/plain',
            'charset' => 'utf-8',
        );
    }
}

function _iknow_node_validate($node){
    //TODO: the validation will be added later
    return TRUE;
}