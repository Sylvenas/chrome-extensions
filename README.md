# insight-targets

Insight Targets(洞察计划) -- from [Captain America 2](https://www.youtube.com/watch?v=3ru5wM7fl7g)

## 项目背景简介
目前前后端联调阶段效率较低，主要原因是四点：
- 部分服务端接口入参较为复杂，服务端开发同学确实难以mock入参进行自测
- 服务端接口部分未按照nei文档约束进行开发，接口变动未及时通知前端开发，导致后期对应不上
- 测试同学目前针对接口进行独立测试较少
- 前端在联调阶段才会发现某些request or response不对的时候，要去调试代码才能找到问题

所以使用Chrome extension的方式实现request和response的校验，可以在一定程度上缓解这个问题

## 实现思路

- 1.Chrome extension 增加一个popup的方式去手动录入
  - projectId([nei api](https://nei.hz.netease.com/interface/detail/?pid=27248&id=81511)根据path查询接口相关信息必须提供projectId)
  - 使用浏览器缓存projectId,不用重复录入(整个云音乐使用的project不超过10个，所以操作较简单)
  - 提供projectId的删除/禁用/激活

- 2.Chrome extension 拦截onBeforeRequest，onCompleted
  - 根据request path查询接口信息，生成校验规则校验request参数(如果参数已加密，可能无法进行解密校验)
  - 校验response信息：字段类型，字段必须等，通过browser notifications 提醒有错误信息

## Usage

### install extensions
* 打开chrome浏览器扩展程序，地址栏输入：`chrome://extensions/`
* 右上角切换为“开发者模式”
* 左上角点击“加载已解压的扩展程序”，选择Insight Targets文件夹中的dist文件夹

### usage
* 重新打开浏览器开发者工具,快捷键：`command + option + i`
* 在Tab页中选择`Insight Targets`
* Interface中添加需要检验的接口id，也可以一次添加多个(使用英语逗号分割即可)，接口id可以在nei平台查看，举例：查看当前抢擂活动接口地址为：`https://nei.hz.netease.com/interface/detail/?pid=53558&id=295190`，接口id就是路径中的id：`295190`,直接输入`295190`，点击`add`即可
* 此时刷新页面就可以在`RESULT`中查看校验结果,结果分为`校验成功`，`校验未通过`，`未检验`(原因可能是当前页面没有调用该接口，所以无法校验，调转到有调用该接口的页面即可)
* 点击校验未通过的行，可以查看具体的未通过的原因：一般常见的原因如：缺少必须字段，字段类型不一致等等

### others
* Clear all Interface Ids：清空之前设置的全部接口id
* Clear all Result Ids：清空之前的校验结果
* Allow null：暂未开发
* disabel/enable interface,可以设置不检验/校验该接口

# Dev
## Building and running on localhost

First install dependencies:

```sh
yarn
```

To run in hot module reloading mode:

```sh
yarn start-tool
yarn start-panel
```
然后在浏览器扩展程序中选择dist文件夹即可(dist中如果没有logo.png和manifest.json文件可以从项目根目录中找到复制进去即可)

To create a production build:

```sh
yarn build-tool
yarn build-panel
```
然后在浏览器扩展程序中选择dist文件夹即可(dist中如果没有logo.png和manifest.json文件可以从项目根目录中找到复制进去即可)

## Running

Open the file `dist/index.html` in your browser


