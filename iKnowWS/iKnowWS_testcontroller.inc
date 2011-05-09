<?php

function iKnowWS_testcontroller_GET($arg){
  $message = "If you receive this message, it means the restfull works.";
  return array(
    'response_code' => '200', // OK
    'headers' => array(),
    'body' => $message,
    'media_type' => 'text/plain',
    'charset' => 'utf-8',
  );
}