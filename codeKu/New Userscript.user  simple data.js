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
//@resource     http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css
// @grant        none
// ==/UserScript==


window.addEventListener('load', function() {

    const xmlns = "http://www.w3.org/2000/svg";
    let width="300px";
    let height="300px"
    let svg1 = document.createElementNS(xmlns, "svg")
    svg1.setAttributeNS(null,'id',"svg")
    // svg.setAttributeNS("class","jscreated");
    svg1.style.width=width;
    svg1.style.height=height;

    let  p = document.querySelector("#hdtb-msb")
    p.insertBefore(document.createElement('br'), p.childNodes[0]);
    p.insertBefore(svg1, p.childNodes[0]);

    $(document).ready(function () {
        var svg = d3.select("#svg");

        //remember its, not . var svg from d3,width,height from svg

        // console.log(svg);
        //        alter:define the (category)
        var types = ['中心文章', '分段', '关键分词', '搜索结果'];
        var colors = ['#6ca46c', '#4e88af', '#c72eca', '#d2907c'];
        //临时大小控制
        var sizes = [30, 5, 10, 2.5];


        var forceRate = 50;


        var simulation = d3.forceSimulation()
        //key makethe link follow id as indicator to find nodes
        .force("link", d3.forceLink().id(function (d) {
            return d.id;

        }))
        .force("charge", d3.forceManyBody())
        //centre setting up
        .force("center", d3.forceCenter(width / 2, height / 2));

        //试着改变力图的nodes吸引力和排斥力
        // simulation.alphaDecay(0.05) // 衰减系数，值越大，图表稳定越快
        simulation.force('charge')
            .strength(-forceRate) // 排斥力强度，正值相互吸引，负值相互排斥
        // simulation.force('link')
        //     .id(d => d.id) // set id getter
        //     .distance(100) // 连接距离
        //     .strength(1) // 连接力强度 0 ~ 1
        //     .iterations(1) // 迭代次数


        //    <!--    loading data-->
        var graph;
        // d3.json("new.json", function (error, data) {
        // d3.json("nodesAndLinks.json", function (error, data) {
        // if (error) throw error;
            const data={
        "newsData": [
            {
                "title": "AgglomerativeCluster",
                "id": "1"
            },
            {
                "title": "CommunityStructure",
                "id": "3812"
            },
            {
                "title": "HierarchicalCluster",
                "id": "6714"
            },
            {
                "title": "MergeEdge",
                "id": "743"
            }
        ],
        "newsKey": [
            {
                "name": "AgglomerativeCluster",
                "id": "1",
                "kcount": "3"
            },
            {
                "name": "AgglomerativeCluster",
                "id": "1",
                "kcount": "3"
            },
            {
                "name": "AgglomerativeCluster",
                "id": "1",
                "kcount": "3"
            }
        ],
        "newsSan": [
            {
                "title": "4ssss",
                "id": "11",
                "year": "2333",
                "month": "11",
                "url": "www.baidu.com"
            },
            {
                "title": "4ssss",
                "id": "11",
                "year": "2333",
                "month": "11",
                "url": "www.baidu.com"
            },
            {
                "title": "4ssss",
                "id": "11",
                "year": "2333",
                "month": "11",
                "url": "www.baidu.com"
            }
        ],
        "sanKey": [
            {
                "kid": "4",
                "sanid": "1"
            },
            {
                "kid": "4",
                "sanid": "1"
            },
            {
                "kid": "4",
                "sanid": "1"
            }
        ],
        "tagKey": [
            {
                "tagid": "4",
                "keyid": "1"
            },
            {
                "tagid": "4",
                "keyid": "1"
            },
            {
                "tagid": "4",
                "keyid": "1"
            }
        ],
        "tagData": [
            {
                "tag": "dfwefasd",
                "tagid": "1"
            },
            {
                "tag": "dfwefasd",
                "tagid": "1"
            },
            {
                "tag": "dfwefasd",
                "tagid": "1"
            }
        ],
        "dataList": [
            "1999",
            "2000",
            "2003"
        ]
    };
        // 不需要“”括起来，但是最后要用分号；

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
            console.log(d.category);
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
            var r1 = r1 * size * ratio;
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

        //san文章
        // svg.selectAll(".san")
        // .attr("r", rSan);


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

        //    未完待续... xampp for cross origin requests


    });
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
});