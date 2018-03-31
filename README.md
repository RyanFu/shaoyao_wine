### 芍药酒铺小程序+管理界面+服务端api
+ admin-client 
```
	后台管理界面 本地运行
	1- npm install (或者 cnpm i) 如果报模块找不到再npm install 模块
	2- src目录搜索所有文件包含 https://127.0.0.1:8360 ,server-node(服务端接口)调试本地就不用改，如果上线了记得全部替换成 http://域名/
	3- npm run dev (我这个就在本机运行 所有没有打包出来 你们可以 npm run build )
```
+ server-node 
	服务端接口 测试可本地 上线部署到服务器
	1- 创建数据库 CREATE SCHEMA `syjpshop` DEFAULT CHARACTER SET utf8mb4 ;
	2- 把根目录syjpdb.sql 导入到数据库 (我本地用的phpMyAdmin导入的 你们可以用自己方式来)
	3- src/common/config/database.js 先打开看看 暂时不改啥 （用户名和密码可能要改你自己的）
	4- src/admin/controller/upload.js (你们自己本地测试上传图片可能不会成功)这里我上传到七牛的,你们可以去注册个七牛然后直接配置就可以用，有用upy的我也可以帮大家写个
	5- npm install (或者 cnpm i) 安装依赖包 
	6- npm run dev (到这里 你已经开了两个命令窗口了)
+ syjp-app       
	芍药酒铺小程序源码
	1- 这个就简单了 打开config/api.js 本地测试不用改了(应该) 
	2- 用微信web开发者工具打开
	3- 可以看看效果了
	还有什么问题的话 那就是多来买酒呗 不打广告那是不可能的
#这里感谢tumobi的开源nideshop

### 微信小程序预览
![二维码](http://image.diyelf.com/gh_5d9016a8f227_1280.jpg?imageMogr2/auto-orient/thumbnail/300x/blur/1x0/quality/95|imageslim)
