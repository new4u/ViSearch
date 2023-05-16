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

// 获取DOM内容和数据处理
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
  
      let keyWords = Array.from(element.querySelectorAll(".t55VCb"));
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
  
  // 当弹出窗口请求数据时，发送处理后的数据
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getData') {
      const data = parseWebPage(searchtext);
      sendResponse({ data: data });
    }
  });