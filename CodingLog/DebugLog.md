## 2022-12-15 
### 21点
    error 
    ```
    Uncaught SyntaxError: Unexpected token '<' (at userscript.html?name=ViSearch.user.js&id=a1e8a54f-ccb1-4455-8950-29f8b42eee8b:17200:1)
    ```
    Why require *ViSearch.user.js*?
        1 clear all ViSearch.user.js
        2 ask google
    !有可能是因为调用,我也可以不用远程调用,直接同一个文件更新就行了.在github里点击"https://github.com/new4u/ViSearch/blob/3a8674ed8a352454b76088b155bf03eb2fa8cbeb/Debug/ViSearchDebug.user.js#L1-L6"页面的Raw,OK了再设置一个
    
### 21点31分 调试成功
    1 使用更新作为同步办法(之后有待检验),以后直接用固定更新?
    2 更新文件为最终commit版本,不带#L21xxx

## 2023-02-21
### 2023-02-21 21:33:47
> 麦当劳 
- [ ] 目标
  - [ ] 用户更新到目前的版本上来，去掉draft
  - [ ] x我能不能就直接讲之前的代码改一下？
  - [ ] 只能重新加载一个geasefork的号码，然后用新的方式同步，找一下好有没有偷懒地方法
  - [ ] 自动更新一些关键字：
    - [ ] slogan 用git？
    - [ ] 各版本一点更新自动同步
- [ ] 完成版本更新