// document.getElementById('get-last-element').addEventListener('click', () => {
  window.onload = () => {
  chrome.runtime.sendMessage({type: 'GET_LAST_ELEMENT'}, (response) => {
    console.log('Received response in popup:', response);
    d3.select('#display').html(response.lastElement);
    
    // d3.select('#display').html(response);
    // function parseHTML(htmlString) {
    //   const parser = new DOMParser();
    //   const doc = parser.parseFromString(htmlString, 'text/html');
    //   return doc;
    // }
    
    // // const htmlString = '<div><h1>Hello, World!</h1><p>This is a paragraph.</p></div>';
    // const dom = parseHTML(htmlString);

// ==UserScript==
// @name         ViSearch/Google of Google
// @name:zh-CN    ViSearch/Google of Google
// @name:zh-TW    ViSearch/Google of Google
// @name:fr    ViSearch/Google of Google
// @name:es    ViSearch/Google of Google
// @name:th    ViSearch/Google of Google
// @namespace    https://github.com/new4u
// @version      7.217
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
// @note         2023-05-25-v.7.117 发布到了chrome应用商店,并且修复了一个关键词和chrome界面语种的冲突,支持多语种.
// @note         2023-2-21-v1.117 发布迁移到userscript以来第一个正式版本
// @note         2016 Java -> 2019 Node.js -> 2023-2-09 各种各样的历史更新记录，从一个版本迭代到另一个版本
// @grant        none
// ==/UserScript==

let styleSheet = `
body {
    padding: 30px 40px;
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


@media screen and (max-width: 600px) {
    .text {
      font-size: 8px; /* 当屏幕宽度小于600px时 最小字体为8px */
    }
  }

  .texts text {
    font-size: 12px; /* 最小字体为12px */
    min-font-size: 8px; /* 最小字体不能小于8px */
    max-font-size: 36px;
    font-weight:bold;
    font-family:"Microsoft YaHei";
    text-shadow: 0 0 3px #fff, 0 0 10px #fff;
  }



.texts text:hover {
    cursor: pointer;
}

.texts text.inactive {
    display: none !important;
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

// 调用css以及程序常量
let s = document.createElement("style");
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);

const colors = ["#6ca46c", "#4e88af", "#c72eca", "#d2907c"];
//临时半径R大小控制,之后改成连接数量影响大小
const sizes = [30, 20, 20, 0.5];
const forceRate = -1000;

//放到content.js

// 选择 input 元素中 class 为 gLFyf 的最后一个元素
// const input = document.querySelector("input.gLFyf:last-of-type");  
const input = document.querySelector("textarea.gLFyf:last-of-type"); //20230515根据google的代码更新searchtext的dom
let searchtext = input ? input.value : "";
if (searchtext === "") {
  console.log("searchtext is empty");
} else {
  console.log("searchtext:", searchtext);
  // 执行其他逻辑
}

function parseWebPage(Searchtext) {
  //data
  //***开始解析网页
  /* 谷歌获取 */

  //成功在page之外获取到页面元素内容，发现百度的下一页，就是
  let elements = Array.from(document.querySelectorAll(".g"));
  // console.log(elements);
  //读取数组里内容map为value
  let dataPage = elements.map((element) => {
    // console.log(element);

    //搜索到文章的标题
    let title = element.querySelector(".LC20lb");
    title !== null ? (title = title.innerText) : (title = null);

    // console.log(title);

    //搜索到文章的url
    let url = element.querySelector("a");
    url !== null ? (url = url.href) : (url = null);

    // console.log(url);

    //搜索到的文章的来源网站r.split(" - ")[1]
    let siteName = title;
    siteName !== null
      ? (siteName = siteName.split(" - ")[1])
      : (siteName = null);
    // console.log(siteName);

    //搜索到的文章的发布日期
    // let time = element.querySelector(".c-abstract>.newTimeFactor_before_abs"); //之前的query
    let time = element.querySelector(".MUxGbd.wuQ4Ob.WZ8Tjf > span");
    time !== null ? (time = time.innerText) : (time = null); //google几天前时间可以计算一下

    // console.log(time);

    //搜索到的文章的摘要
    let abstract = element.querySelector(
      ".VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf span:nth-child(2)"
    );
    abstract !== null ? (abstract = abstract.innerText) : (abstract = null);

    //搜索到关键词如果2023年05月25日更新到多语种
    let keyWords = Array.from(element.querySelectorAll("em"));
    keyWords !== null
      ? (keyWords = keyWords.map((item) => {
          return item.innerText;
        }))
      : (keyWords = null);
    // console.log(keyWords);

    let elementEach = {
      title,
      url,
      siteName,
      time,
      abstract,
      keyWords,
    };

    // console.log(elementEach);
    return elementEach;
  });

  console.log(dataPage);

  let keyWords = [];
  for (let i in dataPage) {
    let temp = dataPage[i].keyWords;
    keyWords = keyWords.concat(temp);
  }
  let keyWordsSet = Array.from(new Set(keyWords));

  let nodes = [];
  let links = [];
  let id = 0;

  let sanidstart = id;
  let sanNode = [];

  for (let j = 0; j < dataPage.length; j++) {
    sanNode.push({
      category: 4,
      id: "san" + j,
      name: dataPage[j].title,
      value: dataPage[j].abstract,
      origin: dataPage[j].siteName,
      time: dataPage[j].time,

      year:
        dataPage[j].time !== null &&
        dataPage[j].time.replace(/[^0-9\u4e00-\u9fa5]/gi, "") !== ""
          ? dataPage[j].time.replace(/[^0-9\u4e00-\u9fa5]/gi, "").substr(0, 4)
          : null,
      url: dataPage[j].url,
      //为了前面能找到,再加一条,也可以用这个循环,就少了一个!,这样资料全一些
      keyWords: dataPage[j].keyWords,
      type: "san",
    });
  }

  //判断中英文
  function countWordsAndChinese(str) {
    let chinese = 0;
    let english = 0;
    let isWord = false;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode >= 19968 && charCode <= 40869) {
        // 中文字符的 Unicode 范围
        chinese++;
        isWord = false;
      } else if (
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122)
      ) {
        // 英文字母的 Unicode 范围
        if (!isWord) {
          english++;
          isWord = true;
        }
      } else {
        isWord = false;
      }
    }

    return {
      chinese,
      english,
    };
  }

  let keyidstart = id;
  let keyNode = [];
  for (let i = 0; i < keyWordsSet.length; i++) {
    const { chinese, english } = countWordsAndChinese(keyWordsSet[i]);

    if (chinese + english < 3) {
      console.log(keyWordsSet[i], chinese + english);

      keyNode.push({
        category: 3,
        id: "key" + i,
        name: keyWordsSet[i],
        value: 30000 + i + "",
        type: "key",
      });
      //     !!! link 如果 keyNode.name 在dataPage.keywords li indexof 就连接(先写san)
      //    for (k)
      for (let j = 0; j < sanNode.length; j++) {
        //keywords是数组,不知道行不行,可以
        if (sanNode[j].keyWords.indexOf(keyWordsSet[i]) !== -1) {
          links.push({
            source: "key" + i,
            target: "san" + j,
            value: 1,
          });
        }
      }
    }
  }

  let tagid = id;
  //2,tag,id=20000-29999,tag就是长度大于4的keywordsSet
  let tagNode = [];

  for (let i = 0; i < keyWordsSet.length; i++) {
    //中文+英文数量作为判断依据
    const { chinese, english } = countWordsAndChinese(keyWordsSet[i]);

    if (chinese + english >= 3) {
      console.log(keyWordsSet[i], chinese + english);
      tagNode.push({
        category: 2,
        id: "tag" + i,
        type: "tag",
        name: keyWordsSet[i],
        value: id,
      });

      for (let j = 0; j < sanNode.length; j++) {
        if (sanNode[j].keyWords.indexOf(keyWordsSet[i]) !== -1) {
          links.push({
            source: "tag" + i,
            target: "san" + j,
            value: 1,
          });
        }
      }
      // for (let j = 0; j < keyNode.length; j++) {
      //     if (keyWordsSet[i].indexOf(keyNode[j].name) !== -1) {
      //         links.push({
      //             source: "tag" + i,
      //             target: keyNode[j].id,
      //             value: 1,
      //         });
      //     }
      // }

      for (let j = 0; j < keyNode.length; j++) {
        const keyword = /^[a-z]+$/i.test(keyWordsSet[i])
          ? keyWordsSet[i].toString().toLowerCase()
          : keyWordsSet[i];
        if (keyword.indexOf(keyNode[j].name) !== -1) {
          links.push({
            source: "tag" + i,
            target: keyNode[j].id,
            value: 1,
          });
        }
      }
    }
  }

  //1,id=10000,不能用10000+"",,只能用i+"".直接"10000"就好了
  let newsNode = {
    category: 1,
    id: "news",
    //searchtext在前面定义前面获取
    name: searchtext,
    value: id,
    type: "news",
  };
  //和key和tag都建立连接
  for (let i = 0; i < keyNode.length; i++) {
    links.push({
      source: "news",
      target: keyNode[i].id,
      value: 1,
    });
  }
  for (let i = 0; i < tagNode.length; i++) {
    links.push({
      source: "news",
      target: tagNode[i].id,
      value: 1,
    });
  }

  //    合并4个[],用concat(),
  nodes = nodes
    .concat(newsNode)
    .concat(tagNode)
    .concat(keyNode)
    .concat(sanNode);

  //data end

  return {
    nodes,
    links,
  };
}

function renderD3Graph(nodes, links, graph) {
  // 获取 graph 元素的宽度和高度
  const width = parseInt(graph.style.width);
  const height = parseInt(graph.style.height);

  d3.selectAll("graph > *").remove();

  // // 创建 D3.js SVG 元素，并设置其大小和位置
  const bbox = graph.getBoundingClientRect();

  const svg = d3
    .select(graph)
    .append("svg")
    .attr("id", "graph-svg")
    .attr("width", bbox.width)
    .attr("height", bbox.height)
    .style("position", "fixed")
    .style("top", bbox.y + "px")
    .style("left", bbox.x + "px")
    .style("z-index", "999");

  //   const svg = d3
  // .select(graph)
  // .append("svg")
  // .attr("width", width)
  // .attr("height", height)
  // .style("position", "fixed")
  // .style("top", "0")
  // .style("right", "0")
  // .style("z-index", "999");

  function dragStarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragging(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragEnded(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(50)
        .strength(1)
        .iterations(1)
    )
    .force("charge", d3.forceManyBody().strength(forceRate))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alphaDecay(0.05);

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    //        试着给每种type加一个class,要放在数据读取之后
    .attr("class", function (d) {
      // return "nodes";
      return "nodes " + d.type;
    })
    .attr("r", function (d) {
      //    make radius of node circle
      return sizes[d.category - 1]; // return r;
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

    .call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded)
    );

  //固定中心文章位置,用class来控制
  //固定中心文章位置,fx可以设置哈哈,或者大面积的可以用tick,详见https://stackoverflow.com/questions/10392505/fix-node-position-in-d3-force-directed-layout,实验证明,还可以用type属性来控制fx,fy

  svg
    .select(".news")
    .attr("fx", function (d) {
      return (d.fx = width / 2);
    })
    .attr("fy", function (d) {
      return (d.fy = height / 2);
    });

  //san文章点击, 没有name这个
  //存放三度文章size
  svg
    .selectAll(".san")
    .attr("r", function (d) {
      let uniqueWords = new Set(d.keyWords);
      let radius = uniqueWords.size * 10;
      // console.log("radius:", radius);
      return radius;
    })
    .style("fill-opacity", 0.5);

  //    显示所有的文本...
  const text = svg
    .append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("font-size", function (d) {
      // return d.size;
      let uniqueWords = new Set(d.keyWords);
      let radius = uniqueWords.size * 2;
      let fontSize = radius * sizes[d.category - 1];

      // console.log("d:", d, ";font-size return", fontSize);
      return fontSize;
    })
    .attr("fill", function (d) {
      // return "red";
      return colors[d.category - 1];
    })
    .attr("name", function (d) {
      return d.time;
    })
    .text(function (d) {
      return d.time ? d.time + d.name : d.name;
    })
    .attr("text-anchor", "center")
    .on("click", function (d) {
      if (d.url) {
        window.open(d.url, "_blank");
      }
    })
    .call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded)
    );

  //圆增加title...
  node.append("title").text(function (d) {
    return d.time + d.name;
  });

  /* //点击任意一个node, 不与之相连的节点和连线都变透明,怎么做

    可以在点击node事件处理函数中通过改变对应元素的透明度实现：

    获取点击的node的相邻节点
    对于不相邻的节点，修改其透明度
    对于不相邻的连线，修改其透明度
    代码示例： */

  var isTransparent = false;

  // 为每个node绑定点击事件
  node.on("click", function (d) {
    // 根据当前状态进行相应的操作
    if (!isTransparent) {
      link.style("opacity", function (l) {
        if (d === l.source || d === l.target) {
          return 1;
        } else {
          return 0.1;
        }
      });
      node.style("opacity", function (n) {
        // 只对与点击的圆圈不相关的圆圈透明度进行更改
        var linked = false;
        link.each(function (l) {
          if (d === l.source || d === l.target) {
            linked = true;
            return;
          }
        });
        if (!linked) {
          return 0.1;
        } else {
          return 1;
        }
      });
      isTransparent = true;
    } else {
      link.style("opacity", 1);
      node.style("opacity", 1);
      isTransparent = false;
    }
  });

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    text.attr("transform", function (d) {
      // return 'translate(' + d.x + ',' + (d.y + d.size / 2) + ')';
      return "translate(" + d.x + "," + (d.y + sizes[d.category - 1] / 2) + ")";
    });
  });
}

// (function () {
//   let button = document.createElement("button");
//   button.innerHTML = "ViSearch";
//   button.style.cssText =
//     "position: fixed; top: 0; right: 0; z-index: 999; width: 100px; height: 50px; background-color: green; color: white; font-size: 20px;";

//   // Add button to page
//   document.body.appendChild(button);

//   // Create graph element
//   const graph = document.createElement("div");
//   graph.style.position = "fixed";
//   graph.style.top = "50px";
//   graph.style.right = "0px";
//   graph.style.width = "500px";
//   graph.style.height = "500px";
//   graph.style.background = "#fff";
//   graph.style.border = "1px solid #ccc";
//   graph.style.display = "none";
//   graph.style.opacity = 0.9;

//   // Add graph to page
//   document.body.appendChild(graph);
//   let graphVisible = false;

//   // Toggle graph on button click
//   button.addEventListener("click", () => {
//     if (graphVisible) {
//       graph.style.display = "none";
//       graphVisible = false;
//     } else {
//       graph.style.display = "block";
//       graphVisible = true;
//       data = parseWebPage(searchtext);
//       console.log("data", data);
//       nodes = data.nodes;
//       links = data.links;
//       //remove the previous canvs
//       d3.select("#graph-svg").remove();
//       console.log("#graph-svg", d3.select("#graph-svg"));

//       renderD3Graph(nodes, links, graph);
//     }
//   });

//   // Hide graph on outside click
//   document.addEventListener("click", (event) => {
//     if (
//       graphVisible &&
//       event.target !== graph &&
//       !graph.contains(event.target) &&
//       event.target !== button
//     ) {
//       graph.style.display = "none";
//       graphVisible = false;
//     }
//   });
// })();

// Select the div element with id "svg"
const graph = document.getElementById("svg");

// Get the width and height of the div element
const width = parseInt(graph.style.width);
const height = parseInt(graph.style.height);

if (searchtext === "") {
  console.log("不是google或者没有searchtext");
//   let searchtext ="ViSearch is a Google search results enhancement extension."
//   const sample = {"nodes":[{"category":1,"id":"news","name":"visearch new4u top","value":0,"type":"news","index":0,"x":250,"y":250,"vy":0,"vx":0,"fx":250,"fy":250 },{"category":3,"id":"key0","name":"new4u","value":"30000","type":"key","index":1,"x":220.8819601820255,"y":314.90119328515595,"vy":-0.0029702389980556737,"vx":-0.0013971904302029295 },{"category":3,"id":"key1","name":"ViSearch","value":"30001","type":"key","index":2,"x":242.15746997850403,"y":160.53388262330634,"vy":-0.0022288155870392387,"vx":0.000724396243487838 },{"category":3,"id":"key2","name":"top","value":"30002","type":"key","index":3,"x":321.94827419334445,"y":343.40911485064515,"vy":-0.00016416628485374662,"vx":-0.0004934226395911182 },{"category":4,"id":"san0","name":"Issues · new4u/ViSearch - GitHub","value":null,"origin":"GitHub","time":null,"year":null,"url":"https://github.com/new4u/ViSearch/issues","keyWords":["new4u","ViSearch"],"type":"san","index":4,"x":165.83983210992497,"y":231.5341359457681,"vy":-0.003028695782835303,"vx":-0.00021534442969740346 },{"category":4,"id":"san1","name":"ViSearch with Google Chrome extension","value":"ViSearch with Google is a Chrome extension by new4u. This extension has 12 weekly active users,a perfect 5.0 rating,and is most similar to ...","time":"2023年5月26日","year":"2023","url":"https://chrome-stats.com/d/mnhdcngdkimhejdmhihhncebpanbccil","keyWords":["ViSearch","new4u"],"type":"san","index":5,"x":275.0424285197011,"y":213.1782525929967,"vy":-0.0013129169237991515,"vx":-0.0007791546698188358 },{"category":4,"id":"san2","name":"ViSearch/Google of Google[Beta version]...Beyond the AI with ...","value":"Introducing ViSearch:The Low-Carbon AI Assistant The Most Intuitive and Low-Carbon AI Assistant Today,ViSearch has migrated to the plugin ...","time":"2023年2月9日","year":"2023","url":"https://www.youtube.com/watch?v=wuQELy6nTjk","keyWords":["ViSearch","ViSearch"],"type":"san","index":6,"x":209.54033157753807,"y":67.37150428466128,"vy":-0.004551744083327162,"vx":0.006916094333669629 },{"category":4,"id":"san3","name":"免费试用，完美解决GPT-4的Token费用问题，专业Al玩家必备！","value":"CustomGPT:https://customgpt.ai/?fpr=homepage 使用优惠码ONEMONTHOFF，可得一个月免费使用 定制聊天机器人:https://customgpt.new4u.top/  ...","time":"2023年5月22日","year":"2023","url":"https://www.youtube.com/watch?v=OaQ6rrRncgk","keyWords":["new4u","top"],"type":"san","index":7,"x":258.4407771559011,"y":404.8905116306859,"vy":-0.0017527364397468984,"vx":-0.001612180920836246 },{"category":4,"id":"san4","name":"User scripts - Greasy Fork","value":null,"origin":"Greasy Fork","time":null,"year":null,"url":"https://greasyfork.org/en/scripts?q=today%27s&sort=daily_installs","keyWords":["ViSearch","new4u","ViSearch","new4u","top"],"type":"san","index":8,"x":306.1510018673872,"y":264.162268448693,"vy":-0.0008889408293049402,"vx":-0.0013104738304510492 }],"links":[{"source":{"category":3,"id":"key0","name":"new4u","value":"30000","type":"key","index":1,"x":220.8819601820255,"y":314.90119328515595,"vy":-0.0029702389980556737,"vx":-0.0013971904302029295 },"target":{"category":4,"id":"san0","name":"Issues · new4u/ViSearch - GitHub","value":null,"origin":"GitHub","time":null,"year":null,"url":"https://github.com/new4u/ViSearch/issues","keyWords":["new4u","ViSearch"],"type":"san","index":4,"x":165.83983210992497,"y":231.5341359457681,"vy":-0.003028695782835303,"vx":-0.00021534442969740346 },"value":1,"index":0 },{"source":{"category":3,"id":"key0","name":"new4u","value":"30000","type":"key","index":1,"x":220.8819601820255,"y":314.90119328515595,"vy":-0.0029702389980556737,"vx":-0.0013971904302029295 },"target":{"category":4,"id":"san1","name":"ViSearch with Google Chrome extension","value":"ViSearch with Google is a Chrome extension by new4u. This extension has 12 weekly active users,a perfect 5.0 rating,and is most similar to ...","time":"2023年5月26日","year":"2023","url":"https://chrome-stats.com/d/mnhdcngdkimhejdmhihhncebpanbccil","keyWords":["ViSearch","new4u"],"type":"san","index":5,"x":275.0424285197011,"y":213.1782525929967,"vy":-0.0013129169237991515,"vx":-0.0007791546698188358 },"value":1,"index":1 },{"source":{"category":3,"id":"key0","name":"new4u","value":"30000","type":"key","index":1,"x":220.8819601820255,"y":314.90119328515595,"vy":-0.0029702389980556737,"vx":-0.0013971904302029295 },"target":{"category":4,"id":"san3","name":"免费试用，完美解决GPT-4的Token费用问题，专业Al玩家必备！","value":"CustomGPT:https://customgpt.ai/?fpr=homepage 使用优惠码ONEMONTHOFF，可得一个月免费使用 定制聊天机器人:https://customgpt.new4u.top/  ...","time":"2023年5月22日","year":"2023","url":"https://www.youtube.com/watch?v=OaQ6rrRncgk","keyWords":["new4u","top"],"type":"san","index":7,"x":258.4407771559011,"y":404.8905116306859,"vy":-0.0017527364397468984,"vx":-0.001612180920836246 },"value":1,"index":2 },{"source":{"category":3,"id":"key0","name":"new4u","value":"30000","type":"key","index":1,"x":220.8819601820255,"y":314.90119328515595,"vy":-0.0029702389980556737,"vx":-0.0013971904302029295 },"target":{"category":4,"id":"san4","name":"User scripts - Greasy Fork","value":null,"origin":"Greasy Fork","time":null,"year":null,"url":"https://greasyfork.org/en/scripts?q=today%27s&sort=daily_installs","keyWords":["ViSearch","new4u","ViSearch","new4u","top"],"type":"san","index":8,"x":306.1510018673872,"y":264.162268448693,"vy":-0.0008889408293049402,"vx":-0.0013104738304510492 },"value":1,"index":3 },{"source":{"category":3,"id":"key1","name":"ViSearch","value":"30001","type":"key","index":2,"x":242.15746997850403,"y":160.53388262330634,"vy":-0.0022288155870392387,"vx":0.000724396243487838 },"target":{"category":4,"id":"san0","name":"Issues · new4u/ViSearch - GitHub","value":null,"origin":"GitHub","time":null,"year":null,"url":"https://github.com/new4u/ViSearch/issues","keyWords":["new4u","ViSearch"],"type":"san","index":4,"x":165.83983210992497,"y":231.5341359457681,"vy":-0.003028695782835303,"vx":-0.00021534442969740346 },"value":1,"index":4 },{"source":{"category":3,"id":"key1","name":"ViSearch","value":"30001","type":"key","index":2,"x":242.15746997850403,"y":160.53388262330634,"vy":-0.0022288155870392387,"vx":0.000724396243487838 },"target":{"category":4,"id":"san1","name":"ViSearch with Google Chrome extension","value":"ViSearch with Google is a Chrome extension by new4u. This extension has 12 weekly active users,a perfect 5.0 rating,and is most similar to ...","time":"2023年5月26日","year":"2023","url":"https://chrome-stats.com/d/mnhdcngdkimhejdmhihhncebpanbccil","keyWords":["ViSearch","new4u"],"type":"san","index":5,"x":275.0424285197011,"y":213.1782525929967,"vy":-0.0013129169237991515,"vx":-0.0007791546698188358 },"value":1,"index":5 },{"source":{"category":3,"id":"key1","name":"ViSearch","value":"30001","type":"key","index":2,"x":242.15746997850403,"y":160.53388262330634,"vy":-0.0022288155870392387,"vx":0.000724396243487838 },"target":{"category":4,"id":"san2","name":"ViSearch/Google of Google[Beta version]...Beyond the AI with ...","value":"Introducing ViSearch:The Low-Carbon AI Assistant The Most Intuitive and Low-Carbon AI Assistant Today,ViSearch has migrated to the plugin ...","time":"2023年2月9日","year":"2023","url":"https://www.youtube.com/watch?v=wuQELy6nTjk","keyWords":["ViSearch","ViSearch"],"type":"san","index":6,"x":209.54033157753807,"y":67.37150428466128,"vy":-0.004551744083327162,"vx":0.006916094333669629 },"value":1,"index":6 },{"source":{"category":3,"id":"key1","name":"ViSearch","value":"30001","type":"key","index":2,"x":242.15746997850403,"y":160.53388262330634,"vy":-0.0022288155870392387,"vx":0.000724396243487838 },"target":{"category":4,"id":"san4","name":"User scripts - Greasy Fork","value":null,"origin":"Greasy Fork","time":null,"year":null,"url":"https://greasyfork.org/en/scripts?q=today%27s&sort=daily_installs","keyWords":["ViSearch","new4u","ViSearch","new4u","top"],"type":"san","index":8,"x":306.1510018673872,"y":264.162268448693,"vy":-0.0008889408293049402,"vx":-0.0013104738304510492 },"value":1,"index":7 },{"source":{"category":3,"id":"key2","name":"top","value":"30002","type":"key","index":3,"x":321.94827419334445,"y":343.40911485064515,"vy":-0.00016416628485374662,"vx":-0.0004934226395911182 },"target":{"category":4,"id":"san3","name":"免费试用，完美解决GPT-4的Token费用问题，专业Al玩家必备！","value":"CustomGPT:https://customgpt.ai/?fpr=homepage 使用优惠码ONEMONTHOFF，可得一个月免费使用 定制聊天机器人:https://customgpt.new4u.top/  ...","time":"2023年5月22日","year":"2023","url":"https://www.youtube.com/watch?v=OaQ6rrRncgk","keyWords":["new4u","top"],"type":"san","index":7,"x":258.4407771559011,"y":404.8905116306859,"vy":-0.0017527364397468984,"vx":-0.001612180920836246 },"value":1,"index":8 },{"source":{"category":3,"id":"key2","name":"top","value":"30002","type":"key","index":3,"x":321.94827419334445,"y":343.40911485064515,"vy":-0.00016416628485374662,"vx":-0.0004934226395911182 },"target":{"category":4,"id":"san4","name":"User scripts - Greasy Fork","value":null,"origin":"Greasy Fork","time":null,"year":null,"url":"https://greasyfork.org/en/scripts?q=today%27s&sort=daily_installs","keyWords":["ViSearch","new4u","ViSearch","new4u","top"],"type":"san","index":8,"x":306.1510018673872,"y":264.162268448693,"vy":-0.0008889408293049402,"vx":-0.0013104738304510492 },"value":1,"index":9 },{"source":{"category":1,"id":"news","name":"visearch new4u top","value":0,"type":"news","index":0,"x":250,"y":250,"vy":0,"vx":0,"fx":250,"fy":250 },"target":{"category":3,"id":"key0","name":"new4u","value":"30000","type":"key","index":1,"x":220.8819601820255,"y":314.90119328515595,"vy":-0.0029702389980556737,"vx":-0.0013971904302029295 },"value":1,"index":10 },{"source":{"category":1,"id":"news","name":"visearch new4u top","value":0,"type":"news","index":0,"x":250,"y":250,"vy":0,"vx":0,"fx":250,"fy":250 },"target":{"category":3,"id":"key1","name":"ViSearch","value":"30001","type":"key","index":2,"x":242.15746997850403,"y":160.53388262330634,"vy":-0.0022288155870392387,"vx":0.000724396243487838 },"value":1,"index":11 },{"source":{"category":1,"id":"news","name":"visearch new4u top","value":0,"type":"news","index":0,"x":250,"y":250,"vy":0,"vx":0,"fx":250,"fy":250 },"target":{"category":3,"id":"key2","name":"top","value":"30002","type":"key","index":3,"x":321.94827419334445,"y":343.40911485064515,"vy":-0.00016416628485374662,"vx":-0.0004934226395911182 },"value":1,"index":12 }]}
//   const nodes = sample.nodes;
//   const links = sample.links;

// // Render the D3 graph on the div element
// renderD3Graph(nodes, links, graph);
var text = "";
text += "<p>即将支持本页面的可视化……<br/>Coming soon on supporting visualizations on this page...<br/>目前支持:谷歌搜索<br/>Supported:Google search<br/>已经在排期的可视化项目：百度、Bing、维基。<br/>Visualization projects already scheduled: Baidu, Bing, wiki<br/>Github: <a href=\"https://github.com/new4u/ViSearch\">https://github.com/new4u/ViSearch</a><br/>个人网站 About me: <a href=\"https://www.new4u.top/\">https://www.new4u.top</a></p>";
text += "";
text += "<h3>ViSearch 插件</h3>";
text += "";
text += "<p>ViSearch 是一款 Google 搜索结果增强插件。它可以使你在 Google 搜索结果页面直接浏览图片，并且可以使用“Visually Similar Images”功能查找相似图片。如果你不是用 Google 搜索，可能需要手动开启ViSearch插件。</p>";
text += "";
text += "<p>使用方法：</p>";
text += "";
text += "<ol><li>在 Google 搜索结果页面下，点击插件图标。</li><li>图片搜索：在想要搜索的图片上右键点击，选择“Search Visually Similar Images”。</li><li>搜索结果页面：点击“Visually Similar Images”按钮可以快速查找与搜索结果相似的图片。</li></ol>";
text += "";
text += "<p>未来愿景：</p>";
text += "";
text += "<p>我们的愿景是使 ViSearch 成为一个全球范围内最受欢迎的搜索结果增强插件。我们希望 ViSearch 能够为用户提供更好的搜索体验，帮助他们更轻松地找到他们需要的信息。同时，我们会不断优化 ViSearch，让它更加智能，更加易用。</p>";
text += "";
text += "<h3>ViSearch Extension</h3>";
text += "";
text += "<p>ViSearch is a Google search results enhancement extension. It allows you to browse images directly on the Google search results page and use the &quot;Visually Similar Images&quot; function to find similar images. If you are not using Google search, you may need to manually enable the ViSearch extension.</p>";
text += "";
text += "<p>Usage:</p>";
text += "";
text += "<ol><li>On the Google search results page, click the extension icon.</li><li>Image search: Right-click on the picture you want to search and choose &quot;Search Visually Similar Images&quot;.</li><li>Search results page: Click the &quot;Visually Similar Images&quot; button to quickly find images similar to the search results.</li></ol>";
text += "";
text += "<p>Future vision:</p>";
text += "";
text += "<p>Our vision is to make ViSearch the most popular search results enhancement extension globally. We hope that ViSearch can provide users with a better search experience and help them find the information they need more easily. At the same time, we will continue to optimize ViSearch to make it smarter and more user-friendly.</p>";


graph.innerHTML=text
} else {
  console.log("既是google也有searchtext:", searchtext);

  // 执行其他逻辑
  // Parse the web page context and get the nodes and links data
const data = parseWebPage(searchtext);
const nodes = data.nodes;
const links = data.links;

// Render the D3 graph on the div element
renderD3Graph(nodes, links, graph);

}


    
    
  });
};