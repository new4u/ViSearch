loadMorePage: async function() {
            if (curSite.pager) {
              let curPageEle = getElementByXpath(curSite.pager.nextLink);
              var url = this.getFullHref(curPageEle);
              if (curSite.SiteTypeID === SiteType.GOOGLE) {
                if (navigator.userAgent.toLowerCase().includes('macintosh')) {
                  // MARK 为了兼容百度在safari下的
                  url = url.replace('https://', 'http://');
                }
              }
              if (url === '') return;
              var sepImgs = {
                top: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWtJREFUeNrclE0rRGEUx8c1GUpRJIVIZGdhZCVr38GGhaI0ZXwCkliglChZEcvJxhdgYWOjLEUpm/EyiLzze+o8dTzdO3PljoVTv7rPc8/5d+6555xYrEhWop6boda5+6l9wjWcWpF+WIbqCJJ9hFRcDr3QAIkIhKugz5PDfkSixkphz5aiAnqgE8rgWRxGoSOPyBkswQuUwyscw4HrmFCZL8Kt/JAg7mEFPEmo4FdPwk0BUcsdzIap0TQ8qMAPuICcEjLnd+VjSjcfJNgIc/DkZGSymYGsnK9EZMrxe4MFaNGiZjC2fT5zQ3p7QDK1dR2GSljziclAvRUe8nHYVA4jjvC43NfAuk/smB2QNqcsWxKcLbAKTFnS0hWD6n27Fd6FLqiDI5iQmQ9jpiVT0sNJ6aYd7dAE3QHBbinSAX5JWWaxuLo8F35jh/bBK9Y+/r/Cl6pLcnna8NvuDGMnslpbZRpXZYT/3r4EGACZL3ZL2afNFAAAAABJRU5ErkJggg==",
                bottom: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXFJREFUeNrM1c8rBGEcx/FdtCEkLqYtpdwkKSUHUhxwITdK+Z3yM2cOLnJ39Cc44SgHScmJwlFxsIdlCScO6/2t76Onp52dXTtbnno1M8+Pz84+zzMzkcg/KA3oRTzM0A4cI4VTdIUVPIM3pPGO5aABJTkGx1BqjYmFFZxW7nnBwXmXogWX6bEGc2jEIU7+kNWDUSSwZyqndSvJ3N1g2Bm0oLtB2j+w7rQP4MpqXzRT0YRaPW/BthMedYLs60HsoE2vq9BsPwAJa8XFLUa0fUrvROo/saT1Q9adGimdlt8yj6TT6Q6d2vaida9YRbtP6EqmBZC5fHA6X+AAz1bwEc6cfk9+oaZM4NoZJL70+J2hTaZtNpet041zK8yP/Mgl+rOF1emr0UM1xnAfEPyISd0Jno6vtx+QuM6PZ22lpO7dbEV2Siv6rPeIjNs1HdYC7ixfG+YBqdTVDqPIv6iIWvO7iXGUFxAqi72PraJ9IH8EGACQcYjYRd5GHwAAAABJRU5ErkJggg==",
                pre: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAASlJREFUeNpiYBjOoBiIrwJxFRAzUsvQViD+CMT/gfgTEPdRy9BPUENh+AsQ91JiaAuSS9HxZ3INb8Hi0v+UurwF6qL/ROBvQNxDrKFfkTT+A+JnQPwBKfJA/L9Ian7ic7kMEHcC8Q80F3UAcRsQv4by30INaUJT9weaWhSQDRUB4uVYvLkYiAWAOBopvEFBlArEPEA8G4ue9UAsATM4EYuCJUgKMtAMLoSKCwPxXCx6c1igClTQgmUZVPNrHMEGy3mgYCkCYiYgTkCSV4UZvA2IjYBYDIgvQbPvOyJTECid5wHxbyA2BuL3QLwRWYEsEJvg0IweFEU41IEMlgcxWJAEH0MxJeAsjMFEq6Jw+Br8BimVfMCTDEkG7EBcA8T3oWUJx4DVYwABBgCannnSzbgwIQAAAABJRU5ErkJggg==",
                next: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNrc1b1KA0EYheEl/iARFFEkKl6D0UK8CrEVrCwEexFCtBIlRWIjsfEiLL0FKzs7QUWxM2piFMUkvhPOwLAs2TGuCn7wkNll5jC7+w0Jgv9avdjAObbQn1TwCu7QwhWW4xakPIOHMKzxGCaSCm6ioXHLZ0Hqpz7KrwRPIvvNvBlM2zYyNY8cMjhDHo9fCBzErnIqKNjgRSxpvIABbOLes2MKWHfuXdhXcR2avKrJ4zGhI9gLhQbq9XaZgGO1kutIOzIHpKp7NawhjYOINSeY6lFwHacw17P6NTWHd4xqnNbcS83LObtsaCPbEW+gXUW8ODswC27xoOsn3ODDmfOGss9XLuE54jGjvPqGuuG1mFDzZIfdNHynnde7DbW1r5DwTstJHP2iE55YqD36ebXZDvr+7L/sU4ABAIpVZWnoA5GkAAAAAElFTkSuQmCC",
                next_gray: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtxJREFUeNrclc9L2mEcx7/6NbVZqRVj7pIOlIUuZ1HMgv0BDcqT7JrskH13ELPBF7eTvz10HznWQBlBRIfBXIfBLmqXscvYZWPKrMNIU9Apmrr34/w6i0ovMZjw+H0+z/N8Xt+Pn/fn80hR/+WHYRhBIpFwRKPRz/F4/KnD4RB28xH0Ah4cHHyoUCjsIpFIIZPJHkml0m9Yfn2ZD78XcL1eH6rValIMCmMUtqKbD7/HbNQxaq15oxcH/lXpcmXgtnh2u/2mXC6/DqE+sSxLlUqlniE0TVPBYJAqFot6+GV9Pt+PJthms80sLS2xEonkhlgs/jgwMOBcXV3N5fP5rlCcp9bX1yWLi4uecrk8U6lUshDY3wRbLJYFGKZsNksq4N78/LwY9hOn05k5Ojqi+PzTGePxeFwZUl6vd8hkMvkPDg6sZJ2M5eXlr1wqUu2kA5JOpy2IAO+oO9fW1n5mMpk2nDjmcjkKNU25XC652Wx2pVIp65mXJ2nyjUPpqakpNZxuA8Y5T87OzsobjcYHpVKpGhsbe1CtVkXYqxQKhTdqtfqL1Wr1JpPJxxyU5Lq/vz8aCoX8TTDatYiFhF6vxx5tAJwm8OPj48m5ubmKSqUaAWwSa9eQw6JGo/luNBoNh4eHbAe0JhAINsLh8LNAIJCiudhxB+Qh2ludTifDAQLvI3AIch+Rkl8jJlrhCbOqgfoLmDepOF/BfGNra2sFFZFtvqgzMbFYjAiyp9Vqh4VC4cTJyYmQ90epIQJtHRO1bA5aRhAvdnZ2GI/H87cEz5YPgeOS2RsfHx9B7u+gOi68yQAtYX9zd3eXgZCna/s8By5ypGUUzhOISHgO9BfWXwG6chZ6IbiVc6LwnsFgGIVAepLzjk4rYW1ze3ubcbvd53fjZV2FaqGQ63fT09PDMO9i9BEoon0J9Rm/339xm3dr2f39fVLX7wFvoMVvoYWfRyIRFndD/Z/8nf0WYAA8EC1Z/ZNm4gAAAABJRU5ErkJggg==",
                pre_gray: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAslJREFUeNrclTtMWmEUxz/uvTzlIUhpNMR0aGNjrNHSmHTqRJyadujQDbSGRwJUaYCmDizqUEw6ODVNGgbpYCfSpFINCQzFR9oyMXRsXFCsAXkIKNL/R7gGWxOsSdPEk5zc3O+e87vn+59zv0vIpbSJiQmyubn5LBKJpNbX11+4XC5Buxy2XYDNZiMOh2OW4ziPTCbTi8XikeHh4SsSieQTXnIxsN1uJ1ardVYgEDgPDw+V9Xqd1Go1Mcuyg7AuuVy+sra29ndgVEnGx8dnhEKhs1qtKgE/eXZ8fCzC+q3+/n6tSqVaSSQS5wM7nU5iMplmsF1XpVI5BeXt6OhIBFkGAe9SKpV/wNmzKjWbzRT6tFwuK86CUqPrkIVWPjQwMKBWKBSn4Ozv0LGxsRmRSDSFSjua0Do8TRWAS+B5+B68g/IhixCNvQPN1WjuieZsS/f1aNQ0wzBuaCqlUCQRtVr9Es1K4kVDWJNhrQjAIiqMlkqle804FnkjBoOhEzv4vrGxkW2ALRaLFrq+QoAV2nE8tLe3dzEYDE5vb2939vX1PcBkiKVSaQ1jForFYq+NRqMum83ebsYzmJq7sGu4xhkKxsDfB/AxnO860ev1oeXlZU8gEMgmk0kFqmw8o9dUKiWfn58vhMPh54h7S+OpQXNSLBYfejyeR1yzw9dbRon09PS8W11dnfL5fJl8Pk+0Wi3hk5vyCNBY4vV6f0Im9+joKJNOp818o8G70ah4aWnpIzSKYCa/dXd3B+PxuHNycjKzs7NzAms1+qFQy+VydDRz0WjUpdPp3tB8TFM0FAqFGxXPzc19plJrNJqraMoXt9tNt3Suc+Tg4ICeJfmFhQVLoVAwoKG7fr//B8cHAL6Fy9ZFDinaG/r5w77ya8y/OhEvKRhjtIup2YMTeBb3mXY53HnAmNkP+/v7NzHTTwAO4f79f/ud/RJgAOLcRNZqLojMAAAAAElFTkSuQmCC",
              };
              CONST.flushNode.insert(await create_CSS_Node(".sp-separator{line-height:1.8 !important;opacity:1 !important;position:relative !important;float:none !important;top:0 !important;left:0 !important;min-width:366px;width:auto;text-align:center !important;font-size:14px !important;display:block !important;padding:3px 0 !important;margin:5px 10px 8px;clear:both !important;border-style:solid !important;border-color:#cccccc !important;border-width:1px !important;-moz-border-radius:30px !important;border-radius:30px !important;background-color:#ffffff !important;}.sp-separator:hover{box-shadow:0 0 11px rgba(33,33,33,0.2);}#sp-separator-hover{display:none;}.sp-separator:hover #sp-separator-hover{display:block;}.sp-separator .sp-someinfo{position:absolute !important;right:10px !important;font-size:12px !important;font-style:italic !important;background:none !important;}.sp-separator span{vertical-align: middle;cursor: pointer;padding: 0;margin: 0 5px;display: inline-block; width:22px;height:22px;}.sp-separator a{margin:0 20px 0 -6px !important;display:inline !important;text-shadow:#fff 0 1px 0 !important;background:none !important;color:#595959 !important;}.sp-separator input{padding:0 !important;line-height:23px !important;}.sp-separator .sp-md-span{font-weight:bold !important;margin:0 20px !important;}#sp-sp-md-number{width:6ch !important;vertical-align:middle !important;display:inline-block !important;text-align:left !important;}" +
                `.ac_sp_top{background-image:url('${ sepImgs.top }')}` +
                `.ac_sp_pre{background-image:url('${ sepImgs.pre }')}` +
                `.ac_sp_next{background-image:url('${ sepImgs.next }')}` +
                `.ac_sp_bottom{background-image:url('${ sepImgs.bottom }')}` +
                `.ac_sp_next_gray{background-image:url('${ sepImgs.next_gray }')}` +
                `.ac_sp_pre_gray{background-image:url('${ sepImgs.pre_gray }')}`,
                "AC-Preload"))
              if (curSite.pageUrl === url) {
                console.error("[AC-Script]", "翻页到达底部了 - 或者异常 - 出现异常请直接反馈作者修改");
                return;
              }// 不会重复加载相同的页面
              console.log("加载翻页地址：" + url)
              curSite.pageUrl = url;
              // 对url的数据进行读取**关键一步
              curSite.pager.startFilter && curSite.pager.startFilter();
              GM_xmlhttpRequest({
                url: url,
                method: "GET",
                timeout: 5000,
                onload: function(response) {
                  try {
                    var newBody = ShowPager.createDocumentByString(response.responseText);

                    let pageElems = getAllElements(curSite.pager.pageElement, newBody, newBody);
                    const scriptElems = getAllElements('//script', newBody, newBody);

                    let toElement = getAllElements(curSite.pager.HT_insert[0])[0];
                    if (pageElems.length >= 0) {
                      // 处理最后一个翻页按钮
                      let nextEs = document.querySelectorAll("#sp-sp-gonext");
                      if (nextEs.length > 0) {
                        let lastE = nextEs[nextEs.length - 1];
                        lastE.classList.replace("ac_sp_next_gray", "ac_sp_next");
                      }
                      // 插入翻页按钮元素
                      curSite.pageNum++;
                      let addTo = "beforeend";
                      if (curSite.pager.HT_insert[1] === 1) addTo = "beforebegin";
                      toElement.insertAdjacentHTML(addTo, `<div class='sp-separator AC' id='sp-separator-ACX'>
                          <a class='sp-sp-nextlink' target='_blank'><b>第 <span style='color:#595959!important;'>ACX</span> 页</b></a>
                          <span id="sp-sp-gotop" class='ac_sp_top' title='去到顶部'></span>
                          <span id="sp-sp-gopre" class='${ curSite.pageNum <= 2 ? "ac_sp_pre_gray" : "ac_sp_pre" }' title='上滚一页' ></span>
                          <span id="sp-sp-gonext" class='ac_sp_next_gray' title='下滚一页'></span>
                          <span id="sp-sp-gobottom" class='ac_sp_bottom' title='去到底部' ></span></div>`
                        .replace(/ACX/gm, curSite.pageNum));
                      // 插入新页面元素
                      pageElems.forEach(function(one) {
                        toElement.insertAdjacentElement(addTo, one);
                      });
                      document.querySelectorAll(".sp-separator.AC:not([bind])").forEach(function(per) {
                        per.setAttribute("bind", 1);
                        per.addEventListener("click", ac_spfunc);
                      });

                      // 插入scripts & style - 保证js加载
                      if (curSite.SiteTypeID === SiteType.GOOGLE) {
                        var scriptText = "";
                        scriptElems.forEach((one) => {
                          scriptText += one.innerHTML;
                        });

                        const scriptNode = document.createElement("script");
                        scriptNode.innerHTML = scriptText;
                        toElement.appendChild(scriptNode)
                      }

                      // 替换待替换元素
                      try {
                        if (curSite.pager.replaceE) {
                          let oriE = getAllElements(curSite.pager.replaceE);
                          let repE = getAllElements(curSite.pager.replaceE, newBody, newBody);
                          if (oriE.length === repE.length) {
                            if (oriE.length === 0) {
                              throw "翻页-替换翻页元素 'replaceE' 失效";
                            }
                            for (var i = 0; i < oriE.length; i++) {
                              oriE[i].outerHTML = repE[i].outerHTML;
                            }
                          }
                        }
                      } catch (e) {
                        console.log(e);
                      }
                    }
                  } catch (e) {
                    console.log(e);
                  }
                  curSite.pageLoading = false;
                },
                onerror: function() {
                  curSite.pageLoading = false;
                }
              });
            }
          },
        };