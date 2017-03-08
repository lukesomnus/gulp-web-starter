# gulp-web-starter
🎉🎉🎉🎉🎉🎉🎉  A web  starter kit featuring  Gulp, Karma, Jasmin, BrowserSync, Pug, Sass, Babel ...

## Quick Start
```
# clone our repo
git clone https://github.com/lukesomnus/gulp-web-starter.git

# change directory to our repo
cd gulp-web-starter

# install the repo with npm
npm install

# start the server
npm start
# or npm run server:dev
```
运行 **npm start**后会生成一个dev文件夹，保存gulp处理后的临时文件。

在浏览器输入localhost:3000即可访问到页面。
## 项目结构
 >           
    ├── dev  //开发临时文件
    │   ├── images
    │   ├── index.html
    │   ├── javascript
    │   └── styles
    ├── dist  //发布文件
    │   ├── images
    │   ├── index.html
    │   ├── javascript
    │   └── styles
    ├── gulpfile.js   //gulp配置文件
    │   ├── config.json
    │   └── index.js
    ├── karma.conf.js  //karma测试配置文件
    ├── package.json
    ├── src   //项目源文件
    │   ├── fonts  //字体
    │   ├── html  //html(pug)文件
    │   ├── images  //图片
    │   ├── javascript  //自定义js文件
    │   ├── lib  //js、css库文件
    │   └── styles   //自定义css文件
    └── test   //测试文件
                
## Test 测试 
```
npm run test
```
该命令通过运行test文件下的测试代码来测试dev代码。

如果你想实时监听测试代码进行测试，运行如下命令：
```
npm run test:watch
```
## Production
```
npm run prodcution
```
gulp处理后的文件保存在dist目录下，production包括css,html,js代码和图片的压缩，sass预处理，对js进行babel转义等等。
也可以通过下面的命令直接启动一个服务来查看dist文件下代码运行的结果。
```
npm run server:dist
```
在浏览器输入localhost:3000可查看处理后项目的运行结果。
## config.json 配置文件
可通过修改gulp.js目录下的config.json文件来修改gulp运行配置。如服务器运行端口，项目生成地址等。

