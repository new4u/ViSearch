// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       本爷有空
// @connect    google.com
// @connect    google.com.hk
// @connect    google.com.jp
// @include    *://encrypted.google.*/search*
// @include    *://*.google*/search*
// @include    *://*.google*/webhp*
// @match        *www.google.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codechef.com
// @require     https://d3js.org/d3.v4.js
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js
// @grant        none
// ==/UserScript==


window.addEventListener('load', function() {

    const xmlns = "http://www.w3.org/2000/svg";
    let width="300px";
    let height="300px"
    let svg1 = document.createElementNS(xmlns, "svg1")
    svg1.setAttributeNS(null,'id',"svg1")
    // svg.setAttributeNS("class","jscreated");
    svg1.style.width=width;
    svg1.style.height=height;

    $(document).ready(function () {


        //remember its, not . var svg from d3,width,height from svg


        var svg = d3.select("#svg1")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        svg.append("ellipse")
            .attr("cx", 200)
            .attr("cy", 50)
            .attr("rx", 100)
            .attr("ry", 50)
            .attr("fill", "green")
    })

});