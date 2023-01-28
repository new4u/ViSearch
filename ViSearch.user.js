// ==UserScript==
// @name         ViSearch/googleData 0.15 googleParse 2023-1-28 08:39:40
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       本爷有空 
// @connect    google.com
// @connect    google.com.hk
// @connect    google.com.jp
// @connect    baidu.com
// @include    *://ipv6.baidu.com/*
// @include    *://www.baidu.com/*
// @include    *://www1.baidu.com/*
// @include    *://m.baidu.com/*
// @include    *://xueshu.baidu.com/s*
// @exclude    https://zhidao.baidu.com/*
// @exclude    https://*.zhidao.baidu.com/*
// @exclude    https://www.baidu.com/img/*
// @include    *://encrypted.google.*/search*
// @include    *://*.google*/search*
// @include    *://*.google*/webhp*
// @match        *www.google.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codechef.com
// @require     https://d3js.org/d3.v4.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.9.1/d3-tip.min.js
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js
// @resource    http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css
// @updateURL    https://raw.githubusercontent.com/new4u/ViSearch/master/ViSearch.user.js
// @downloadURL  https://raw.githubusercontent.com/new4u/ViSearch/master/ViSearch.user.js
// @grant        none
// ==/UserScript==
let styleSheet = `
body {
    // background-color: #272b30;
    padding: 30px 40px;
    // text-align: center;
    font-family: OpenSans-Light, PingFang SC, Hiragino Sans GB, Microsoft Yahei, Microsoft Jhenghei, sans-serif;
}

.links line {
    stroke: rgb(255, 255, 255);
    stroke-opacity: 0.5;
}

.links line.inactive {
    stroke-opacity: 0;
}

.nodes circle {
    stroke: #fff;
    stroke-width: 1.5px;
}

.nodes circle:hover {
    cursor: pointer;
}

.nodes circle.inactive {
    display: none !important;
}


.texts text {
    display: none;
}

.texts text:hover {
    cursor: pointer;
}

.texts text.inactive {
    display: none !important;
}

#indicator {
    position: absolute;
    left: 60px;
    bottom: 120px;
}

#indicator {
    text-align: left;
    color: #f2f2f2;
    font-size: 12px;
}

#indicator > div {
    margin-bottom: 4px;
}

#indicator span {
    display: inline-block;
    width: 30px;
    height: 14px;
    position: relative;
    top: 2px;
    margin-right: 8px;
}

#mode {
    position: absolute;
    top: 160px;
    left: 60px;
}

#mode span {
    display: inline-block;
    border: 1px solid #fff;
    color: #fff;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 14px;
    transition: color, background-color .3s;
    -o-transition: color, background-color .3s;
    -ms-transition: color, background-color .3s;
    -moz-transition: color, background-color .3s;
    -webkit-transition: color, background-color .3s;
}

#mode span.active,
#mode span:hover {
    background-color: #fff;
    color: #333;
    cursor: pointer;
}

#search1 input {
    position: absolute;
    top: 220px;
    left: 60px;
    color: #fff;
    border: none;
    outline: none;
    box-shadow: none;
    width: 200px;
    background-color: #666;
}

#info {
    position: absolute;
    bottom: 40px;
    right: 30px;
    text-align: right;
    width: 270px;
}

#info h4 {
    color: #fff;
}

#info p {
    color: #fff;
    font-size: 12px;
    margin-bottom: 5px;
}

#info p span {
    color: #888;
    margin-right: 10px;
}

#svg g.row:hover {
    stroke-width: 1px;
    stroke: #fff;
}
`;
const xmlns = "http://www.w3.org/2000/svg";
const width = 800;
const height = 560;
let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);

// let button = document.createElement("button");
// button.setAttribute("id", "load-button");
// button.innerHTML = "Lets Visearch";

// document.body.appendChild(button);

//把按钮也搬到浮动右侧
let button = document.createElement("button");
button.innerHTML = "Show SVG";
button.style.cssText = "position: fixed; top: 0; right: 0; z-index: 999; width: 100px; height: 50px; background-color: green; color: white; font-size: 20px;";

button.addEventListener("click", function () {
    var div = d3.select("body").append("div")
        .style("position", "fixed")
        .style("top", "50px")
        .style("right", "0")
        .style("z-index", "999")
        // .style("background-color", "rgba(255, 255, 255, 0.5)")
        .style("background-color", "rgba(0, 0, 0, 0.5)")
        .style("padding", "20px")
        .style("width", "40%")
        .style("height", "80%")
        .style("overflow", "auto")
        .style("border-radius", "10px")
        .style("box-shadow", "0 0 10px #ccc")
        .on("click", function () {
            d3.select(this).style("display", "none");
        });
    div.append(svg.node())
});
document.body.appendChild(button);



// window.addEventListener('load', function() {   //是否可以listen别的
// window.addEventListener('scroll', function() {  //改成滚动的时候就触发？或者滚动多次
// window.addEventListener('scroll', function() {
//   if (document.body.scrollHeight == document.body.scrollTop + window.innerHeight) {

//按键响应
button.addEventListener("click", function () {
    //相当于初始化d3.js中的d3.select(...)函数可以用来选择页面中的元素，而.remove()方法可以用来删除选中的元素。因此在重新渲染之前，可以使用这些方法来删除之前渲染的元素。
    d3.selectAll("svg > *").remove();

    console.log("lets ViSearch");

    // var svg1 = document.createElementNS(xmlns, "svg");
    // svg1.setAttributeNS(null,'id',"svg1");
    // svg1.setAttributeNS(null,"width",width);
    // svg1.setAttributeNS(null,"height",height);

    // svg1.innerHTML = '<svg width="800" height="560" style="margin-left:80px;margin-bottom:-40px;" id="svg"></svg><div id="indicator"></div><div id="mode"><span class="active" style="border-top-right-radius: 0;border-bottom-right-radius:0;">节点</span><span style="border-top-left-radius:0;border-bottom-left-radius:0;position: relative;left: -5px">文字</span></div><div id="search1"><input type="text" class="form-control"></div><div id="info"><h4></h4></div></div>';
    // // document.body.insertBefore(svg1, document.body.firstChild);//放在头部
    // document.body.insertBefore(svg1, document.body.lastChild);//放在尾部

    //     let svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg1.setAttribute("width", width);
    // svg1.setAttribute("height",height );
    // svg1.style.cssText = "float: right;";
    // document.body.appendChild(svg1);

    $(document).ready(function () {
        $(".d3-tip").remove();
        // var svg = d3.select("#svg"),
        //     width = svg.attr("width"),
        //     height = svg.attr("height");

        //无按钮的添加一层
        var svg = d3.select("body").append("svg")
            .attr("width", "50%")
            .attr("height", "100%")
            .style("position", "fixed")
            .style("top", "0")
            .style("right", "0")
            .style("z-index", "999")
        // .style("background-color", "rgba(255, 255, 255, 0.5)") //白色底
        // .style("background-color", "rgba(0, 0, 0, 0)") //黑色底
        // .style("transition", "opacity 2s")
        // .on("mouseover", function() {
        //     d3.select(this).style("opacity", "0.5")
        // })
        // .on("mouseout", function() {
        //     d3.select(this).style("opacity", "0")
        // });

        //渐进的效果


        //     //remember its, not . var svg from d3,width,height from svg

        // console.log(svg);
        //        alter:define the (category)
        var types = ['中心文章', '分段', '关键分词', '搜索结果'];
        var colors = ['#6ca46c', '#4e88af', '#c72eca', '#d2907c'];
        //临时半径R大小控制,之后改成连接数量影响大小

        var sizes = [15, 5, 10, 2.5];


        var forceRate = 50;


        var simulation = d3.forceSimulation()
            //key makethe link follow id as indicator to find nodes
            .force("link", d3.forceLink().id(function (d) {
                return d.id;

            }))
            .force("charge", d3.forceManyBody())
            //centre setting up
            .force("center", d3.forceCenter(width / 2, height / 2));

        // //试着改变力图的nodes吸引力和排斥力
        // simulation.alphaDecay(0.05) // 衰减系数，值越大，图表稳定越快
        // simulation.force('charge')
        //     .strength(-forceRate) // 排斥力强度，正值相互吸引，负值相互排斥
        // simulation.force('link')
        //     .id(d => d.id) // set id getter
        //     .distance(100) // 连接距离
        //     .strength(1) // 连接力强度 0 ~ 1
        //     .iterations(1) // 迭代次数
        // Set up tooltip
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return d.name + "</span>";
            })
        svg.call(tip);


        //added a var
        var dragging = false;

        // dragXXX related
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            dragging = true;

        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            //            alphaTarget(num)是啥意思啊,d里面的fx,fy是下一刻的x,y吗?
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            dragging = false;
        }

        // todo #23 make the function above defined ahead ! As the userscript migration notice! https://github.dev/new4u/ViSearch/blob/4687c34a92b76ef9940162177606f2838aede93f/ViSearch.user.js#L295-L317


        //    <!--    loading data-->
        let data = {};
        var graph = {};
        // d3.json("new.json", function (error, data) {
        // d3.json("nodesAndLinks.json", function (error, data) {
        // if (error) throw error;

        // 不需要“”括起来，但是最后要用分号；

        //***开始解析网页
        /* 谷歌获取 */

        // // ChatGPT Code for extracting data from the search results
        // var elements = document.querySelectorAll('.g');
        // var elementEach = {};
        // for (var i = 0; i < elements.length; i++) {
        //     var element = elements[i];
        //     var title = element.querySelector('.LC20lb').innerText;
        //     var url = element.querySelector('a').href;
        //     var siteName = element.querySelector('.TbwUpd').innerText;
        //     var time = element.querySelector(".MUxGbd.wuQ4Ob.WZ8Tjf > span").innerText;
        //     var abstract = element.querySelector('.st').innerText;
        //     var keyWords = element.querySelectorAll('.S3Uucc');
        //     var keyWordsArr = [];
        //     for (var j = 0; j < keyWords.length; j++) {
        //         keyWordsArr.push(keyWords[j].innerText);
        //     }
        //     elementEach = {
        //         title: title,
        //         url: url,
        //         siteName: siteName,
        //         time: time,
        //         abstract: abstract,
        //         keyWords: keyWordsArr
        //     }
        // }
        // return elementEach;

                //成功在page之外获取到页面元素内容，发现百度的下一页，就是
                let elements = Array.from(document.querySelectorAll(".g"));
                // console.log(elements);
                //读取数组里内容map为value
                let dataPage = elements.map(element => {
                    // console.log(element);

                    //搜索到文章的标题
                    let title = element.querySelector(".LC20lb");
                    (title !== null) ? title = title.innerText : title = null;

                    // console.log(title);

                    //搜索到文章的url
                    let url = element.querySelector("a");
                    (url !== null) ? url = url.href : url = null;

                    // console.log(url);

                    //搜索到的文章的来源网站
                    let siteName = element.querySelector('.TbwUpd');
                    (siteName !== null) ? siteName = siteName.innerText.split(" - ")[1] : siteName = null;

                    // console.log(siteName);

                    //搜索到的文章的发布日期
                    // let time = element.querySelector(".c-abstract>.newTimeFactor_before_abs"); //之前的query
                    let time = element.querySelector(".MUxGbd.wuQ4Ob.WZ8Tjf > span");
                    (time !== null) ? time = time.innerText : time = null; //google几天前时间可以计算一下

                    // console.log(time);

                    //搜索到的文章的摘要
                    let abstract = element.querySelector(".st");
                    (abstract !== null) ? abstract = abstract.innerText : abstract = null;

                    // console.log(abstract);

                    // 搜索到文章的关键词(relaited to经过百度分词的搜索框内容)
                    let keyWords = Array.from(element.querySelectorAll(".qkunPe"));
                    (keyWords !== null) ? keyWords = keyWords.map(item => {
                        return item.innerText
                    }) : keyWords = null;
                    // console.log(keyWords);


                    let elementEach = {
                        title,
                        url,
                        siteName,
                        time,
                        abstract,
                        keyWords
                    };



                    console.log(elementEach);
                    return elementEach

                });

                console.log(dataPage);
                // let dataPageString = JSON.stringify(resultPages);
                // let dataPage = JSON.parse(dataPageString);

                // console.log("dataPage:"+dataPage);

                let keyWords = []
                for (let i in dataPage) {
                    let temp = dataPage[i].keyWords;
                    keyWords = keyWords.concat(temp)
                }
                let keyWordsSet = Array.from(new Set(keyWords))


        //将nodes,links写成json,到d3里面读
        // 尝试声明一个类

        let nodes = []
        let links = []
        let id = 0

        //4,san,id=40000,49999
        // san
        //   id
        //     自增长
        //   name
        //     dataPage.title
        //   value
        //     id
        // dataPage.abstract
        //   origin
        //     baidu
        //   time
        //     dataPage.time
        //       可以控制颜色
        //       year
        //   url
        //     dataPage.url
        //   links
        //     source:
        //     link
        //      都是目的地之前都指向了
        let sanidstart = id;
        let sanNode = []

        for (let j = 0; j < dataPage.length; j++) {
            sanNode.push(
                {
                    category: 4,
                    id: "san" + j,
                    name: dataPage[j].title,
                    value: dataPage[j].abstract,
                    origin: "baidu.com",
                    time: dataPage[j].time,
                    //    提取前四个数字做年.replace(/[^0-9]/ig,"").substr(0,4)
                    year: (dataPage[j].time !== null && (dataPage[j].time).replace(/[^0-9]/ig, "") !== "") ? (dataPage[j].time).replace(/[^0-9]/ig, "").substr(0, 4) : null,
                    url: dataPage[j].url,
                    //为了前面能找到,再加一条,也可以用这个循环,就少了一个!,这样资料全一些
                    keyWords: dataPage[j].keyWords,
                    type: "san",
                })
        }
        ;

        let keyidstart = id
        //3,key,id=30000-399993
        //   key
        //     id
        //       自增长
        //     name
        //       四个字以下的keywords
        //     value
        //       id
        //     origin
        //       null
        //     time
        //       null
        //     url
        //       null
        //     links
        //       source:本身
        //       target:
        //         关联的san
        let keyNode = []
        for (let i = 0; i < keyWordsSet.length; i++) {

            if (keyWordsSet[i].length <= 4) {
                keyNode.push({
                    category: 3,
                    id: "key" + i,
                    name: keyWordsSet[i],
                    value: 30000 + i + "",
                    type: "key",
                })
                //     !!! link 如果 keyNode.name 在dataPage.keywords li indexof 就连接(先写san)
                //    for (k)
                for (let j = 0; j < sanNode.length; j++) {
                    //keywords是数组,不知道行不行,可以
                    if (sanNode[j].keyWords.indexOf(keyWordsSet[i]) !== -1) {
                        links.push({
                            source: "key" + i,
                            target: "san" + j,
                            value: 1

                        })
                    }
                }


            }
        }

        let tagid = id
        //2,tag,id=20000-29999,tag就是长度大于4的keywordsSet
        let tagNode = [];
        for (let i = 0; i < keyWordsSet.length; i++) {
            if (keyWordsSet[i].length > 4) {
                tagNode.push({
                    category: 2,
                    id: "tag" + i,
                    type: "tag",
                    name: keyWordsSet[i],
                    value: id,
                })

                for (let j = 0; j < keyNode.length; j++) {
                    //如果tagNode.name包含了keyNode.name(indexof),就连一条线
                    if (keyWordsSet[i].indexOf(keyNode[j].name) !== -1) {
                        links.push({
                            source: "tag" + i,
                            target: keyNode[j].id,
                            value: 1
                        }
                        )
                    }
                }
            }

        }


        //1,id=10000,不能用10000+"",,只能用i+"".直接"10000"就好了
        let newsNode = {
            category: 1,
            id: "news",
            //先用searchtext代替
            name: "searchText",
            value: id,
            type: "news"
        }

        for (let i = 0; i < tagNode.length; i++) {
            links.push({
                source: "news",
                target: tagNode[i].id,
                value: 1
            });


        }


        //    合并4个[],用concat(),
        nodes = nodes.concat(newsNode).concat(tagNode).concat(keyNode).concat(sanNode);
        // console.log("nodes", nodes, "links", links);
        data = { 'nodes': nodes, 'links': links };
        console.log(data)






        graph = data;
        console.log(data);
        //d3 mapping data to html,make line with = 1
        //    links
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("stroke-width", function (d) {
                return d.value;
            });
        //   nodes
        var node = svg.append("g")
            .selectAll("circle")
            .data(graph.nodes)
            .enter()
            .append("circle")
            //        试着给每种type加一个class,要放在数据读取之后
            .attr("class", function (d) {
                // return "nodes";
                return "nodes " + d.type;
            })
            .attr("r", function (d) {
                //    make radius of node circle
                return sizes[d.category - 1];                    // return r;
            })
            .attr("fill", function (d) {
                //    配合现在category从1开始,今后可以重新设计一下category make color of node circle,也可以加到后面,统一修改
                // console.log(d.category);
                return colors[d.category - 1];

            })
            .attr("stroke", "none")
            .attr("name", function (d) {
                //    make text of node
                return d.name;
            })

            // set drag event
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        //固定中心文章位置,用class来控制
        //固定中心文章位置,fx可以设置哈哈,或者大面积的可以用tick,详见https://stackoverflow.com/questions/10392505/fix-node-position-in-d3-force-directed-layout,实验证明,还可以用type属性来控制fx,fy

        svg.select(".news")
            .attr("fx", function (d) {

                return d.fx = width / 2;
            })
            .attr("fy", function (d) {
                return d.fy = height / 2;
            })
        // .attr("r", function (d) {
        //     return 2 * r;
        // });
        // .call(force.drag);

        var screenratio = width / height;

        /**
             * 获取坐标数组
             * r 圆的半径
             * ratio 压缩比例
             * size 等分值 需要将圆划分为多少份d3.selectAll(".san")._groups[0].length
             */
        function getXYS(r, ratio, type) {
            var xys = [];
            var typeString = "." + type;
            var size = d3.selectAll(typeString.toString())._groups[0].length
            var r = r * size * ratio;
            for (var i = 0; i < size; i++) {
                //圆心坐标
                var x = width / 2, y = height / 2;
                // 计算弧度
                var rad = i * 2 * Math.PI / size;

                // r*Math.cos(rad) 弧线的终点相对dot的水平偏移
                // r*Math.sin(rad) 弧线的终点相对dot的垂直偏移
                // compressionRatio 垂直压缩比例
                // 定义了x_,y_
                let x_ = ratio * r * Math.sin(rad) + x;
                let y_ = -r * Math.cos(rad) + y;
                xys.push({
                    px: x_,
                    py: y_
                });
            }

            return xys;
        }

        //暂且将各自的个数(tag和key)用links.length代替,R=输入的r*size(个数)
        var tagXys = getXYS(sizes[2], 1, "tag"); //段落

        var keyXys = getXYS(sizes[3], width / height, "key"); //关键字

        var sanXys = getXYS(sizes[4], width / height, "san"); //关键字

        //固定段落位置
        svg.selectAll(".tag")
            .attr("type", function (d, i) {
                var obj = tagXys[i]
                d.fx = obj.px;
                d.fy = obj.py;

            });

        //固定关键字位置
        svg.selectAll(".key").attr("type", function (d, i) {
            var obj = keyXys[i]
            d.fx = obj.px;
            d.fy = obj.py;
        });

        //san文章点击, 没有name这个
        //存放三度文章size
        var sansize = [];

        var year = 0;
        var year_index = 0;
        //计算连接数
        svg.selectAll(".san")
            .attr("r", function (d) {
                var uniqueWords = new Set(d.keyWords);
                // console.log(uniqueWords.size);
                return uniqueWords.size * 3

            })
            .attr("type", function (d, i) {

                if (d.url) {
                    //			d.name = "<a style=font-size:12pt href='"+d.url+"' target='_blank'>"+d.year+"-"+d.month+"  "+d.name+"</a>";
                    d.name = "<a href='" + d.url + "' target='_blank'>" + d.time + "-" + d.origin + "  " + d.name + "</a>";

                }
            })




        // var sansortsizeIndex = [];
        // var sansortsize = { min: 1, mid: 1, max: 1 };
        // var minSize = d3.min(sansize); //最小值
        // var maxSize = d3.max(sansize);
        // //判断最小值
        // var min_index = 0;
        // var mid_index = 0;
        // var max_index = 0;
        // for (var i in sansize) {
        //     if (sansize[i] <= (minSize + (maxSize - minSize) * 0.5)) { //50%以下在外圈
        //         sansortsizeIndex.push({ type: 'min', index: min_index });
        //         sansortsize.min += 1;
        //         min_index++;
        //     } else if (sansize[i] >= (maxSize - (maxSize - minSize) * 0.2)) { //20%以上在里圈
        //         sansortsizeIndex.push({ type: 'max', index: max_index });
        //         sansortsize.max += 1;
        //         max_index++;
        //     } else {
        //         sansortsizeIndex.push({ type: 'mid', index: mid_index });
        //         sansortsize.mid += 1;
        //         mid_index++;
        //     }
        // }
        //     function getXYS3(r, ratio, size) {
        //         var xys3 = [];

        //         for (var i = 0; i < size; i++) {
        //             //圆心坐标
        //             var x = width / 2, y = height / 2;
        //             // 计算弧度
        //             var rad = i * 2 * Math.PI / size + Math.PI / 2;

        //             // r*Math.cos(rad) 弧线的终点相对dot的水平偏移
        //             // r*Math.sin(rad) 弧线的终点相对dot的垂直偏移
        //             // compressionRatio 垂直压缩比例
        //             x_ = ratio * r * Math.sin(rad) + x;
        //             y_ = -r * Math.cos(rad) + y;
        //             xys3.push({
        //                 px: x_,
        //                 py: y_
        //             });
        //         }

        //         return xys3;
        //     }
        // var sanXys = {};
        // sanXys.min = getXYS3((height / 2 - 150) / 3 * 3 + 100, width / height, sansortsize['min']);
        // sanXys.mid = getXYS3((height / 2 - 150) / 3 * 2 + 100, width / height, sansortsize['mid']);
        // sanXys.max = getXYS3((height / 2 - 150) / 3 * 1 + 100, width / height, sansortsize['max']);



        //如果url不为空，把node的半径扩充成原来的三倍
        // svg.selectAll(".san")
        // .attr("r", function(d) {
        //     if (d.url) {
        //         return d3.select(this).attr("r") * 3;
        //     } else {
        //         return d3.select(this).attr("r");
        //     }
        // });

        // //san文章,GPT学习.tag的固定段落位置, 将下列代码补全,将.san的node根据data.time进行布局, time接近现在的较靠屏幕上方(time数据示例:time: "23小时前" 或者 time: "2023年1月8日 "), 同时将time为空的通通放在graph的底部
        // var now = new Date();
        // var sanNodes = svg.selectAll(".san")
        // .attr("type", function (d, i) {
        // var obj = sanXys[i]
        // // 计算时间差
        // var time = d.time;
        // var diff;
        // if (time.indexOf("小时前") != -1) {
        // diff = -time.split("小时前")[0];
        // } else if (time.indexOf("年") != -1) {
        // var date = new Date(time);
        // diff = (now - date) / 1000 / 60 / 60 / 24;
        // } else {
        // diff = 0;
        // }
        // console.log(now,data,diff)
        // // 设置y坐标
        // var linear = d3.scaleLinear()
        // .domain([-30, 0])
        // .range([0, height - 20]);
        // d.fy = linear(diff);
        // });

        // console.log("now 是当前时间的时间戳，data 是节点的数据，diff 是时间差，表示距离当前时间的天数，负数表示过去的天数，正数表示未来的天数。")
        // // 将time为空的节点放在底部
        // sanNodes.filter(function (d) { return !d.time; }).attr("fy", height);







        //    显示所有的文本...
        var text = svg.append("g")
            .attr("class", "texts")
            .selectAll("text")
            .data(graph.nodes)
            .enter()
            .append("text").attr("font-size", function (d) {
                // return d.size;
                // 文字大小应该是以看的见为宗旨
                return sizes[d.category - 1];
            })
            .attr("fill", function (d) {
                // return "red";
                return colors[d.category - 1];
            })
            .attr("name", function (d) {
                return d.name;
            })
            .text(function (d) {
                return d.name;
            })
            .attr("text-anchor", "middle")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

        //圆增加title...
        node.append("title").text(function (d) {
            return d.name;
        })
        //    simulation里面的ticked初始化生成图形
        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);
        simulation.force("link")
            .links(graph.links);

        // ticked()函数确定link的起始点坐标(source(x1,y1),target(x2,y2)),node确定中心点(cx,cy),文本通过translate平移变化
        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                })

            node
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
            text.attr('transform', function (d) {
                // return 'translate(' + d.x + ',' + (d.y + d.size / 2) + ')';
                return 'translate(' + d.x + ',' + (d.y + sizes[d.category - 1] / 2) + ')';
            });
        }


    });


    // $('#mode span').click(function (event) {
    //     //     //    span all set to inactive state
    //     //     $('#mode span').removeClass('active');
    //     //     //    the clicked span activaed
    //     //     $(this).addClass('active');
    //     //     //    text hide nodes display
    //     //     if ($(this).text() === '节点') {
    //     //         $('.texts' && 'text').hide();
    //     //         $('.nodes' && 'circle').show();
    //     //     } else {
    // $('texts' && 'text').show();
    // $('.nodes' && 'circle').hide();
    //     //     }
    //     // })

    //暂时可以使用注释以下两行代码显示文字，或者circle
    // $('texts' && 'text').show();
    // $('.nodes' && 'circle').hide();

    //     //搜索框中输入内容则响应该事件
    //     // keyup按键敲击响应event
    //     $('#search1 input').keyup(function (event) {
    //         console.log($(this).val());
    //         if ($(this).val() == '') {
    //             d3.select('#svg .texts').selectAll('text').attr('class', '');
    //             d3.select('#svg .nodes').selectAll('circle').attr('class', '');
    //             d3.select('#svg .links').selectAll('line').attr('class', '');
    //         } else {
    //             var name = $(this).val();
    //             d3.select('#svg .nodes').selectAll('circle').attr('class', function (d) {
    //                 if (d.id.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
    //                     return '';
    //                 } else {
    //                     return 'inactive';
    //                 }
    //             });
    //             d3.select('#svg .texts').selectAll('text').attr('class', function (d) {
    //                 if (d.id.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
    //                     return '';
    //                 } else {
    //                     return 'inactive';
    //                 }
    //             });
    //             d3.select("#svg .links").selectAll('line').attr('class', function (d) {
    //                 return 'inactive';
    //             });
    //         }
    //     });
    // });
    // });
});