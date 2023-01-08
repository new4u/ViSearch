// ==UserScript==
// @name         ViSearch
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
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js
// @resource    http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css
// @grant        none
// ==/UserScript==
const styleSheet = `
 body {
       background-color: #272b30;
       padding: 30px 40px;
       text-align: center;
       font-family: OpenSans-Light, PingFang SC, Hiragino Sans GB, Microsoft Yahei, Microsoft Jhenghei, sans-serif;
   }

   .links line {
       stroke: rgb(240, 240, 240);
       stroke-opacity: 0.2;
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

// inject styles
const s = document.createElement("style");
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);

const width = 800;
const height = 560;

window.addEventListener("load", function () {
  const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg1.setAttributeNS(null, "width", width);
  svg1.setAttributeNS(null, "height", height);
  svg1.innerHTML = `<svg width="${width}" height="${height}" style="margin-left:80px;margin-bottom:-40px;" id="svg"></svg>
    <div id="indicator"></div>
    <div id="mode">
      <span class="active" style="border-top-right-radius: 0;border-bottom-right-radius:0;">Node</span>
      <span style="border-top-left-radius:0;border-bottom-left-radius:0;position: relative;left: -5px">文字</span>
    </div>
    <div id="search1"><input type="text" class="form-control"></div>
    <div id="info">
      <h4></h4>
    </div>`;
  document.body.insertBefore(svg1, document.body.firstChild);
  $(document).ready(function () {
    const svg = d3.select("#svg"),
      width = svg.attr("width"),
      height = svg.attr("height");
    const colors = ["#6ca46c", "#4e88af", "#c72eca", "#d2907c"];
    const sizes = [30, 5, 10, 2.5];
    const forceRate = 50;
    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function (d) {
          return d.id;
        })
      )
      .force("charge", d3.forceManyBody())
      //centre setting up
      .force("center", d3.forceCenter(width / 2, height / 2));
    // some functions
    let dragging = false;
    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
      dragging = true;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      dragging = false;
    }
    //试着改变力图的nodes吸引力和排斥力
    // simulation.alphaDecay(0.05) // 衰减系数，值越大，图表稳定越快
    simulation.force("charge").strength(-forceRate); // 排斥力强度，正值相互吸引，负值相互排斥
    // simulation.force('link')
    //     .id(d => d.id) // set id getter
    //     .distance(100) // 连接距离
    //     .strength(1) // 连接力强度 0 ~ 1
    //     .iterations(1) // 迭代次数

    //** 开始解析网页 */
    //成功在page之外获取到页面元素内容，发现百度的下一页，就是
    const elements = Array.from(
      document.querySelectorAll(".c-container" && ".result")
    );
    //读取数组里内容map为value
    const dataPage = elements.map((element) => {
      //搜索到文章的标题
      let title = element.querySelector(".t");
      title !== null ? (title = title.innerText) : (title = null);

      //搜索到文章的url
      let url = element.querySelector(".t > a");
      url !== null ? (url = url.href) : (url = null);

      //搜索到的文章的来源网站
      let siteName = element.querySelector(".t > a");
      siteName !== null
        ? (siteName = siteName.innerText.split(" - ")[1])
        : (siteName = null);
      let time = element.querySelector(
        "div> div:nth-child(1) > div:nth-child(3) > div > span.c-color-gray2"
      );
      time !== null ? (time = time.innerText) : (time = null); //google几天前时间可以计算一下

      //搜索到的文章的摘要
      let abstract = element.querySelector(
        "div> div:nth-child(1) > div:nth-child(3) > div > span.content-right_8Zs40"
      );
      abstract !== null ? (abstract = abstract.innerText) : (abstract = null);
      // 搜索到文章的关键词(related to经过百度分词的搜索框内容)
      let keyWords = Array.from(element.querySelectorAll("em"));
      keyWords !== null
        ? (keyWords = keyWords.map((item) => {
            return item.innerText;
          }))
        : (keyWords = null);
      const elementEach = {
        title,
        url,
        siteName,
        time,
        abstract,
        keyWords,
      };
      return elementEach;
    });
    let keyWords = [];
    for (let i in dataPage) {
      const temp = dataPage[i].keyWords;
      keyWords = keyWords.concat(temp);
    }
    const keyWordsSet = Array.from(new Set(keyWords));

    //将nodes,links写成json,到d3里面读
    let nodes = [];
    const links = [];
    const id = 0;

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
    const sanNode = [];
    for (let j = 0; j < dataPage.length; j++) {
      sanNode.push({
        category: 4,
        id: "san" + j,
        name: dataPage[j].title,
        value: dataPage[j].abstract,
        origin: "baidu.com",
        time: dataPage[j].time,
        //    提取前四个数字做年.replace(/[^0-9]/ig,"").substr(0,4)
        year:
          dataPage[j].time !== null &&
          dataPage[j].time.replace(/[^0-9]/gi, "") !== ""
            ? dataPage[j].time.replace(/[^0-9]/gi, "").substr(0, 4)
            : null,
        url: dataPage[j].url,
        //为了前面能找到,再加一条,也可以用这个循环,就少了一个!,这样资料全一些
        keyWords: dataPage[j].keyWords,
        type: "san",
      });
    }
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
    const keyNode = [];
    for (let i = 0; i < keyWordsSet.length; i++) {
      if (keyWordsSet[i].length <= 4) {
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

    //2,tag,id=20000-29999,
    const tagNode = [];
    for (let i = 0; i < keyWordsSet.length; i++) {
      if (keyWordsSet[i].length > 4) {
        tagNode.push({
          category: 2,
          id: "tag" + i,
          type: "tag",
          name: keyWordsSet[i],
          value: id,
        });

        for (let j = 0; j < keyNode.length; j++) {
          //如果tagNode.name包含了keyNode.name(indexof),就连一条线
          if (keyWordsSet[i].indexOf(keyNode[j].name) !== -1) {
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
    const newsNode = {
      category: 1,
      id: "news",
      //先用searchtext代替
      name: "searchText",
      value: id,
      type: "news",
    };

    for (let i = 0; i < tagNode.length; i++) {
      links.push({
        source: "news",
        target: tagNode[i].id,
        value: 1,
      });
    }
    nodes = nodes
      .concat(newsNode)
      .concat(tagNode)
      .concat(keyNode)
      .concat(sanNode);
    const graph = { nodes: nodes, links: links };
    //d3 mapping data to html,make line with = 1
    //    links
    const link = svg
      .append("g")

      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("stroke-width", function (d) {
        return d.value;
      });
    //   nodes
    const node = svg
      .append("g")
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
        return sizes[d.category - 1]; // return r;
      })
      .attr("fill", function (d) {
        //    配合现在category从1开始,今后可以重新设计一下category make color of node circle,也可以加到后面,统一修改
        return colors[d.category - 1];
      })
      .attr("stroke", "none")
      .attr("name", function (d) {
        //    make text of node
        return d.name;
      })

      // set drag event
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
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
    // .attr("r", function (d) {
    //     return 2 * r;
    // });
    // .call(force.drag);

    /**
     * 获取坐标数组
     * r 圆的半径
     * ratio 压缩比例
     * size 等分值 需要将圆划分为多少份d3.selectAll(".san")._groups[0].length
     */
    function getXYS(r, ratio, type) {
      const xys = [];
      const typeString = "." + type;
      const size = d3.selectAll(typeString.toString())._groups[0].length;
      for (let i = 0; i < size; i++) {
        //圆心坐标
        const x = width / 2,
          y = height / 2;
        // 计算弧度
        const rad = (i * 2 * Math.PI) / size;

        // r*Math.cos(rad) 弧线的终点相对dot的水平偏移
        // r*Math.sin(rad) 弧线的终点相对dot的垂直偏移
        // compressionRatio 垂直压缩比例
        // 定义了x_,y_
        const x_ = ratio * r * Math.sin(rad) + x;
        const y_ = -r * Math.cos(rad) + y;
        xys.push({
          px: x_,
          py: y_,
        });
      }

      return xys;
    }

    //暂且将各自的个数(tag和key)用links.length代替,R=输入的r*size(个数)
    const tagXys = getXYS(sizes[2], 1, "tag"); //段落
    const keyXys = getXYS(sizes[3], width / height, "key"); //关键字
    //固定段落位置
    svg.selectAll(".tag").attr("type", function (d, i) {
      const obj = tagXys[i];
      d.fx = obj.px;
      d.fy = obj.py;
    });
    //固定关键字位置
    svg.selectAll(".key").attr("type", function (d, i) {
      const obj = keyXys[i];
      d.fx = obj.px;
      d.fy = obj.py;
    });
    //san文章
    // svg.selectAll(".san")
    // .attr("r", rSan);
    //    显示所有的文本...
    const text = svg
      .append("g")
      .attr("class", "texts")
      .selectAll("text")
      .data(graph.nodes)
      .enter()
      .append("text")
      .attr("font-size", function (d) {
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
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    //圆增加title...
    node.append("title").text(function (d) {
      return d.name;
    });
    //    simulation里面的ticked初始化生成图形
    simulation.nodes(graph.nodes).on("tick", ticked);
    simulation.force("link").links(graph.links);

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
        });

      node
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });
      text.attr("transform", function (d) {
        // return 'translate(' + d.x + ',' + (d.y + d.size / 2) + ')';
        return (
          "translate(" + d.x + "," + (d.y + sizes[d.category - 1] / 2) + ")"
        );
      });
    }
  });
  $("#mode span").click(function (event) {
    $("#search1 input").keyup(function (event) {
      if ($(this).val() == "") {
        d3.select("#svg .texts").selectAll("text").attr("class", "");
        d3.select("#svg .nodes").selectAll("circle").attr("class", "");
        d3.select("#svg .links").selectAll("line").attr("class", "");
      } else {
        const name = $(this).val();
        d3.select("#svg .nodes")
          .selectAll("circle")
          .attr("class", function (d) {
            if (d.id.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
              return "";
            } else {
              return "inactive";
            }
          });
        d3.select("#svg .texts")
          .selectAll("text")
          .attr("class", function (d) {
            if (d.id.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
              return "";
            } else {
              return "inactive";
            }
          });
        d3.select("#svg .links")
          .selectAll("line")
          .attr("class", function (d) {
            return "inactive";
          });
      }
    });
  });
});
