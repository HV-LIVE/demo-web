# demo-web
网页端demo

###开发环境
* NodeJS版本为v12.4.0
* npm版本为6.9.0
* 如果未安装过yarn需要先执行`npm i -g yarn`

###安装依赖

```bash
yarn
```

###启动开发服务

```bash
yarn start
```

###编译正式服务

```bash
cross-env API_URL=http://120.78.91.237:10050 yarn build
```

###编译docker镜像（需要先编译正式服务）

```bash
docker build -t hvlive/demo-web -f ./Dockerfile dist
```
