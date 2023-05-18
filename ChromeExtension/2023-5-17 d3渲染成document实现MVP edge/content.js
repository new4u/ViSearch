//将visearch的parseweb部分加入content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message in content script:', message);
  if (message.type === 'GET_LAST_ELEMENT') {
const lastElement=document.body
   
    sendResponse({lastElement: lastElement.outerHTML});
    
    // sendResponse({lastElement: lastElement});
// ==UserScript==
// @name         ViSearch/Google of Google
// @name:zh-CN    ViSearch/Google of Google
// @name:zh-TW    ViSearch/Google of Google
// @name:fr    ViSearch/Google of Google
// @name:es    ViSearch/Google of Google
// @name:th    ViSearch/Google of Google
// @namespace    https://github.com/new4u
// @version      6.217
// @description:zh-cn  Beyond the ChatGPT/AI with eyes
// @description:zh-tw  Beyond the ChatGPT/AI with eyes
// @description:fr  Beyond the ChatGPT/AI with eyes
// @description:es  Beyond the ChatGPT/AI with eyes
// @description:th  Beyond the ChatGPT/AI with eyes
// @author       new4u本爷有空
// @connect    google.com
// @connect    google.com.hk
// @connect    google.com.jp
// @include    *://encrypted.google.*/search*
// @include    *://*.google*/search*
// @include    *://*.google*/webhp*
// @match        *www.google.com*
// @icon        https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/WikiProject_Sociology_Babel_%28Deus_WikiProjects%29.png/240px-WikiProject_Sociology_Babel_%28Deus_WikiProjects%29.png
// @require     https://unpkg.com/d3@4.13.0/build/d3.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.9.1/d3-tip.min.js
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js
// @resource    http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css
// @grant        none
// @copyright    2015-2023, new4u
// @license      GPL-3.0-only
// @description  Beyond the ChatGPT/AI with eyes.ViSearch as the Free/Lightweight alternatives to ChatGPT,has the potential to be even more intuitive than ChatGPT in the future.
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw
// @note         2023-2-21-v1.117 发布迁移到userscript以来第一个正式版本
// @note         2016 Java -> 2019 Node.js -> 2023-2-09 各种各样的历史更新记录，从一个版本迭代到另一个版本
// @grant        none
// ==/UserScript==
// @require      https://d3js.org/d3.v6.min.js

  }
  

  
});