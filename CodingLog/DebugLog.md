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
## 2023-1-19
### 2023-1-19 10:27:33
> 对于分支的起名，最佳实践是使用有意义的名称，并遵循统一的命名规则。常见的命名规则有：

feature/xxx：新功能分支，xxx 为具体功能名称。

bugfix/xxx：修复 bug 分支，xxx 为 bug 编号或描述。

hotfix/xxx：紧急修复分支，xxx 为修复的 bug 编号或描述。

release/xxx：发布分支，xxx 为发布版本号。

对于工作流，可以考虑使用 Git Flow 工作流。Git Flow 工作流是一种基于 Git 的高效团队协作开发模式，它分为五个主要分支：

master：主分支，用于发布正式版本。

develop：开发分支，用于集成所有新功能。

feature：新功能分支，用于开发新功能。

release：发布分支，用于准备发布版本。

hotfix：紧急修复分支，用于修复线上 bug。

通过使用 Git Flow 工作流，可以有效组织团队协作，提高代码质量，更好的管理项目版本。

