# gulp-web-starter
🎉🎉🎉🎉🎉🎉🎉  A web  starter kit featuring  Gulp, Karma, Jasmin, BrowserSync, Pug, Sass, Babel ...

## Quick Start
```
# clone our repo
https://github.com/lukesomnus/gulp-web-starter.git

# change directory to our repo
cd gulp-web-starter

# install the repo with npm
npm install

# start the server
npm start
// or npm run server:dev

```
运行 **npm start**后会生成一个dev文件夹，保存gulp处理后的临时代码。

## 项目结构
 >           
            ├── dev  //开发临时文件
            │   ├── images
            │   │   └── gulp.png
            │   ├── index.html
            │   ├── javascript
            │   │   ├── bundle.js
            │   │   ├── bundle.js.map
            │   │   └── vendors.js
            │   └── styles
            │       ├── bundle.css
            │       ├── fonts
            │       └── vendors.css
            ├── dist  //发布文件
            │   ├── images
            │   │   └── gulp.png
            │   ├── index.html
            │   ├── javascript
            │   │   ├── bundle.min.js
            │   │   └── vendors.min.js
            │   └── styles
            │       ├── bundle.min.css
            │       ├── fonts
            │       └── vendors.min.css
            ├── gulpfile.js
            │   ├── config.json
            │   └── index.js
            ├── src   //项目源文件
            │   ├── fonts
            │   │   └── OpenSans-Bold-webfont.ttf
            │   ├── html
            │   │   ├── index.pug
            │   │   └── share
            │   ├── images
            │   │   └── gulp.png
            │   ├── javascript
            │   │   └── main.js
            │   ├── lib
            │   │   ├── css
            │   │   └── js
            │   └── styles
            │       ├── main.sass
            │       └── share
            └── test
                └── index.test.js
## Production
```
npm run prodcution
```
gulp处理后的文件保存在dist目录下，production包括css,html,js代码和图片的压缩，sass预处理，对js进行babel转义等等。
也可以通过下面的命令直接启动一个服务来查看dist文件下代码运行的结果。
```
npm run server:dist
```
## Test 测试

## config.json 配置文件
```
{
    "root": {
        "src": "src",
        "dev": "dev",
        "dist": "dist"
    },
    "tasks": {
        "browserSync": {
            "server": {
                "baseDir": "./dev"
            }
        },
        "static": {
            "src": "static",
            "dest": "/static"
        },

        "css": {
            "vendors": {
                "src": ["src/lib/css/normalize.css"],
                "dest": "styles"
            },
            "bundle": {
                "src": "styles",
                "dest": "styles",
                "autoprefixer": {
                    "browsers": ["last 3 versions"]
                },
                "options": {
                    "preCompile": true,
                    "compileType": "less"
                },
                "sass": {
                    "indentedSyntax": true
                },
                "extensions": ["sass", "scss", "css"]
            }
        },

        "html": {
            "src": "html",
            "dest": "",
            "pug": true
        },

        "images": {
            "src": "images",
            "dest": "images",
            "extensions": ["png", "jpg", "svg", "gif"]
        },

        "fonts": {
            "src": "fonts",
            "dest": "styles/fonts",
            "extensions": ["woff2", "woff", "eot", "ttf", "svg"]
        },

        "js": {
            "vendors": {
                "src": [
                    "src/lib/js/jquery.min.js",
                    "src/lib/js/dropload.js"
                ],
                "dest": "javascript"
            },
            "bundle": {
                "src": "javascript",
                "dest": "javascript"
            },
            "entry": "app/app.js",
            "babel": {
                "presets": ["es2015", "stage-1"],
                "plugins": ["transform-runtime"]
            }
        }
    }
}

```


