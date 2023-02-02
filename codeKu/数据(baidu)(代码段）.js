 let resultPages=[];
    //成功在page之外获取到页面元素内容，发现百度的下一页，就是
                let elements = Array.from(document.querySelectorAll(".c-container" && ".result"));
                console.log(elements);
                //读取数组里内容map为value
                let data = elements.map(element => {
                     console.log(element);

                    //搜索到文章的标题
                    let title = element.querySelector(".t");
                    (title !== null) ? title = title.innerText : title = null;

                    console.log(title);

                    //搜索到文章的url
                    let url = element.querySelector(".t > a");
                    (url !== null) ? url = url.href : url = null;

                    console.log(url);

                    //搜索到的文章的来源网站
                    let siteName = element.querySelector(".t > a");
                    (siteName !== null) ? siteName = siteName.innerText : siteName = null;

                    console.log(siteName);

                    //搜索到的文章的发布日期
                    let time = element.querySelector(".c-abstract>.newTimeFactor_before_abs");
                    (time !== null) ? time = time.innerText : time = null;

                    console.log(time);

                    //搜索到的文章的摘要
                    let abstract = element.querySelector(".c-abstract");
                    (abstract !== null) ? abstract = abstract.innerText : abstract = null;

                    console.log(abstract);

                    // 搜索到文章的关键词(relaited to经过百度分词的搜索框内容)
                    let keyWords = Array.from(element.querySelectorAll("em"));
                    (keyWords !== null) ? keyWords = keyWords.map(item => {
                        return item.innerText
                    }) : keyWords = null;
                    console.log(keyWords);


                    let elementEach = {
                        title,
                        url,
                        siteName,
                        time,
                        abstract,
                        keyWords
                    };

                                

// console.log(elementEach);
                                return elementEach
                    
                });


               let searchResultString = JSON.stringify(resultPages);
    let searchResult = JSON.parse(searchResultString);
    let keyWords = []
    for (let i in searchResult) {
        let temp = searchResult[i].keyWords;
        console.log(temp);
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
    //     searchresult.title
    //   value
    //     id
    // searchresult.abstract
    //   origin
    //     baidu
    //   time
    //     SearchResult.time
    //       可以控制颜色
    //       year
    //   url
    //     SearchResult.url
    //   links
    //     source:
    //     link
    //      都是目的地之前都指向了
    let sanidstart = id;
    let sanNode = []

    for (let j = 0; j < searchResult.length; j++) {
        sanNode.push(
            {
                category: 4,
                id: "san" + j,
                name: searchResult[j].title,
                value: searchResult[j].abstract,
                origin: "baidu.com",
                time: searchResult[j].time,
                //    提取前四个数字做年.replace(/[^0-9]/ig,"").substr(0,4)
                year: (searchResult[j].time !== null && (searchResult[j].time).replace(/[^0-9]/ig, "") !== "") ? (searchResult[j].time).replace(/[^0-9]/ig, "").substr(0, 4) : null,
                url: searchResult[j].url,
                //为了前面能找到,再加一条,也可以用这个循环,就少了一个!,这样资料全一些
                keyWords: searchResult[j].keyWords,
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
            //     !!! link 如果 keyNode.name 在searchResult.keywords li indexof 就连接(先写san)
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
    //2,tag,id=20000-29999,
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
    let nodesAndLinks = {'nodes': nodes, 'links': links};
console.log(nodesAndLinks)


   