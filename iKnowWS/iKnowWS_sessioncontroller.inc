<?php

function iKnowWS_sessioncontroller_GET($arg){
  
  //check current session status is login or not
  if(user_is_anonymous()){
    return _request_return_require_login();
  }
  
  //get current user
  global $user; 
  
  $body = array();
  $body['session_id'] = $user->sid;
  return array(
    'response_code' => '200', // OK
    'headers' => array(),
    'body' => json_encode($body),
    'media_type' => 'text/plain',
    'charset' => 'utf-8',
  );
}

function iKnowWS_sessioncontroller_POST($arg){
    //TODO: this part require security imporvement
    $username = $_POST['username'];
    $passwd = $_POST['password'];
    
    $body = array();
    
    //validate user's login
    $user_obj = user_authenticate(array('name'=>$username,'pass'=>$passwd));
    if($user_obj->uid){  
        $body['session_id'] = session_id();
        return array(
            'response_code' => '200', // OK
            'headers' => array(),
            'body' => json_encode($body),
            'media_type' => 'text/plain',
            'charset' => 'utf-8',
        );
    }else{
        //login failed
        return array(
            'response_code' => '403', // failed
            'headers' => array(),
            'body' => 'User name or password incorrect.',
            'media_type' => 'text/plain',
            'charset' => 'utf-8',
        );
    }
}