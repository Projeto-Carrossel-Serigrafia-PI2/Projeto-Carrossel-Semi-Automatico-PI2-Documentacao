import axios from 'axios';

function getBaseUrl(){
  let host = window.location.hostname;
  if(host !== 'localhost'){
    host = '192.168.0.10';
  }

  let baseUrl = 'http://' + host + ':8000';
  
  console.log('host is ' + host);
  
  return baseUrl;
}

export const api = axios.create({
  baseURL: getBaseUrl(),
});
