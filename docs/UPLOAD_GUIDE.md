# 文件上传功能使用指南

> 更新时间：2025-12-06
> 负责人：优化 uploadify 方法以兼容 OSS 和本地上传

---

## 📋 目录

- [概述](#概述)
- [配置说明](#配置说明)
- [使用方法](#使用方法)
- [完整示例](#完整示例)
- [常见问题](#常见问题)
- [迁移指南](#迁移指南)

---

## 概述

### 优化内容

本次优化重构了 `com.uploadify()` 方法，实现了以下改进：

✅ **智能模式切换**：通过 `config.isAliOss` 配置自动切换本地/OSS上传
✅ **代码复用**：拆分为 `_uploadifyLocal` 和 `_uploadifyOss` 两个私有方法
✅ **错误处理增强**：统一错误处理机制，提供详细错误信息
✅ **回调格式统一**：OSS 和本地上传返回一致的数据格式
✅ **注释完善**：添加详细的 JSDoc 注释和中文说明
✅ **可扩展性**：便于未来扩展其他存储方式（华为云OBS等）

### 核心特性

| 特性 | 本地上传 | OSS上传 |
|------|---------|--------|
| **配置开关** | `config.isAliOss = false` | `config.isAliOss = true` |
| **上传目标** | 应用服务器 | 阿里云OSS |
| **API接口** | `api.common.uploadImg/uploadOther` | `api.upgrade.generatePostSignature` |
| **返回格式** | `{ errorCode, errorMsg, uploadPath, ... }` | `{ errorCode, errorMsg, uploadPath, fileName, ... }` |
| **超时设置** | `config.uploadTimeout` | `config.uploadTimeout` |

---

## 配置说明

### 1. 启用/禁用 OSS 上传

**文件**：`WebContent/js/com/config.js`

```javascript
var config = {
    // ... 其他配置

    // 文件上传配置
    isAliOss: false,  // false=本地上传，true=OSS上传

    // ... 其他配置
};
```

### 2. OSS 配置参数

当启用 OSS 上传时，需要在调用时传递以下参数：

```javascript
{
    accessKeyId: 'your-access-key-id',     // OSS AccessKey ID
    endpoint: 'oss-cn-hangzhou.aliyuncs.com', // OSS 端点
    bucket: 'your-bucket-name',            // OSS Bucket名称
    dir: 'uploads/images/'                 // 上传目录（可选）
}
```

**注意**：这些参数通常由后端提供，可以通过接口查询获取。

### 3. 服务器配置

**文件**：`WebContent/js/com/server.js`

```javascript
// 本地上传模式需要配置
config.media = 'http://your-server.com/';  // 媒体服务器地址
```

---

## 使用方法

### 方法签名

```javascript
com.uploadify(container, title, uapi, clazz, exts, args, limit, success, fail, complete)
```

### 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `container` | String/Object | ✅ | - | 上传按钮容器（ID、选择器或jQuery对象） |
| `title` | String | ✅ | - | 按钮文本 |
| `uapi` | Object | ❌ | `null` | 自定义上传API（本地上传时使用） |
| `clazz` | String | ❌ | `'btn btn-success'` | 按钮样式类名 |
| `exts` | String | ❌ | `'*.jpg;*.jpeg;*.gif;*.png'` | 允许的文件扩展名 |
| `args` | Object | ❌ | `{}` | 上传参数（本地上传为formData，OSS上传为配置参数） |
| `limit` | Number | ❌ | `1` | 文件数量限制 |
| `success` | Function | ✅ | - | 成功回调 `function(result, file)` |
| `fail` | Function | ❌ | `null` | 失败回调 `function(error)` |
| `complete` | Function | ❌ | `null` | 完成回调 `function()` |

### 回调函数格式

#### success 回调

```javascript
function(result, file) {
    // result 格式（本地上传和OSS上传统一格式）
    {
        errorCode: 0,              // 错误码（0表示成功）
        errorMsg: '上传成功',       // 错误信息
        uploadPath: 'http://...',  // 文件访问路径
        fileName: 'example.jpg',   // 文件名（仅OSS）
        fileSize: 102400,          // 文件大小（仅OSS）
        fileType: 'image/jpeg'     // 文件类型（仅OSS）
    }

    // file 对象（Huploadify提供）
    {
        name: 'example.jpg',
        size: 102400,
        type: 'image/jpeg'
    }
}
```

#### fail 回调

```javascript
function(error) {
    // error 格式
    {
        errorCode: -1,              // 错误码
        errorMsg: '上传失败原因',   // 错误信息
        file: { ... },              // 文件对象（可选）
        xhr: { ... }                // XMLHttpRequest对象（可选，仅OSS）
    }
}
```

---

## 完整示例

### 示例 1: 本地上传单张图片

```javascript
// HTML
<div id="uploadBtn"></div>
<img id="previewImg" style="display:none; max-width: 200px;">

// JavaScript
$(function() {
    // 配置本地上传
    config.isAliOss = false;

    // 初始化上传组件
    com.uploadify(
        '#uploadBtn',           // 容器
        '上传图片',              // 按钮文本
        null,                   // 使用默认API
        'btn btn-primary',      // 按钮样式
        '*.jpg;*.png;*.gif',    // 允许的格式
        {},                     // 表单附加数据
        1,                      // 限制1个文件
        function(result, file) {
            // 上传成功
            console.log('上传成功:', result.uploadPath);

            // 显示图片预览
            $('#previewImg')
                .attr('src', config.media + result.uploadPath)
                .show();

            // 保存路径到表单
            $('#hiddenImagePath').val(result.uploadPath);

            com.showAlert(com.info, '图片上传成功');
        },
        function(error) {
            // 上传失败
            console.error('上传失败:', error);
            com.showAlert(com.error, '上传失败: ' + error.errorMsg);
        },
        function() {
            // 所有文件上传完成
            console.log('上传队列完成');
        }
    );
});
```

### 示例 2: OSS 上传多张图片

```javascript
// HTML
<div id="uploadBtn"></div>
<div id="imageList"></div>

// JavaScript
$(function() {
    // 启用 OSS 上传
    config.isAliOss = true;

    // 先获取 OSS 配置（通常从后端接口获取）
    com.post(api.system.querySystemConfigByGroup, {
        'systemConfig.group': 'oss'
    }, function(res) {

        var ossConfig = {
            accessKeyId: res.configs.accessKeyId,
            endpoint: res.configs.endpoint,
            bucket: res.configs.bucket,
            dir: 'decoration/images/'
        };

        // 初始化上传组件
        com.uploadify(
            '#uploadBtn',
            '批量上传图片',
            null,
            'btn btn-success',
            '*.jpg;*.png;*.jpeg',
            ossConfig,        // 传递 OSS 配置
            5,                // 最多5张图片
            function(result, file) {
                // 每张图片上传成功时触发
                console.log('图片上传成功:', result.fileName);

                // 添加到列表
                var html = '<div class="image-item">';
                html += '  <img src="' + result.uploadPath + '" style="max-width: 100px;">';
                html += '  <p>' + result.fileName + ' (' + (result.fileSize / 1024).toFixed(2) + 'KB)</p>';
                html += '</div>';
                $('#imageList').append(html);
            },
            function(error) {
                // 上传失败
                com.showAlert(com.error, '上传失败: ' + error.errorMsg);
            },
            function() {
                // 所有图片上传完成
                com.showAlert(com.info, '所有图片上传完成');
            }
        );
    });
});
```

### 示例 3: 本地上传文档文件

```javascript
// 上传 PDF、Word、Excel 等文档
com.uploadify(
    '#uploadDocBtn',
    '上传文档',
    null,
    'btn btn-warning',
    '*.pdf;*.doc;*.docx;*.xls;*.xlsx',  // 文档格式
    {},
    1,
    function(result, file) {
        console.log('文档上传成功:', result.uploadPath);

        // 创建下载链接
        var downloadLink = config.media + api.common.downloadFile.url +
            '?downloadFilePath=' + result.uploadPath +
            '&fileName=' + file.name;

        $('#docLink').attr('href', downloadLink).text('下载文档');
    },
    function(error) {
        com.showAlert(com.error, '文档上传失败: ' + error.errorMsg);
    }
);
```

### 示例 4: 动态切换上传模式

```javascript
// 根据用户设置动态切换上传模式
function initUpload(useOss) {
    // 设置上传模式
    config.isAliOss = useOss;

    if (useOss) {
        // OSS 模式：先获取配置
        com.post(api.system.queryOssConfig, {}, function(res) {
            com.uploadify(
                '#uploadBtn',
                '上传图片（OSS）',
                null, null,
                '*.jpg;*.png',
                {
                    accessKeyId: res.ossConfig.accessKeyId,
                    endpoint: res.ossConfig.endpoint,
                    bucket: res.ossConfig.bucket,
                    dir: 'uploads/'
                },
                1,
                handleUploadSuccess,
                handleUploadFail
            );
        });
    } else {
        // 本地模式
        com.uploadify(
            '#uploadBtn',
            '上传图片（本地）',
            null, null,
            '*.jpg;*.png',
            {},
            1,
            handleUploadSuccess,
            handleUploadFail
        );
    }
}

function handleUploadSuccess(result, file) {
    console.log('上传成功:', result.uploadPath);
    $('#imagePath').val(result.uploadPath);
}

function handleUploadFail(error) {
    com.showAlert(com.error, '上传失败: ' + error.errorMsg);
}

// 根据系统配置初始化
com.post(api.system.querySystemConfigByKey, {
    'systemConfig.key': 'uploadMode'
}, function(res) {
    initUpload(res.systemConfig.value === 'oss');
});
```

---

## 常见问题

### Q1: 如何切换上传模式？

**A**: 修改 `js/com/config.js` 中的 `isAliOss` 配置项：

```javascript
// 本地上传
config.isAliOss = false;

// OSS上传
config.isAliOss = true;
```

### Q2: OSS 上传失败，提示"获取签名失败"？

**A**: 检查以下几点：

1. 确认后端接口 `api.upgrade.generatePostSignature` 正常工作
2. 确认传递的 OSS 配置参数正确（accessKeyId、endpoint、bucket、dir）
3. 查看浏览器控制台的网络请求，确认签名接口返回正确

### Q3: 本地上传后如何显示图片？

**A**: 使用 `com.showImg()` 方法：

```javascript
com.uploadify('#uploadBtn', '上传图片', null, null, '*.jpg;*.png', {}, 1,
    function(result, file) {
        // 方式1: 直接使用 uploadPath
        $('#myImage').attr('src', config.media + result.uploadPath);

        // 方式2: 使用 com.showImg() 方法（推荐，支持缩略图）
        com.showImg($('#myImage'), result.uploadPath, 200, 150, '默认图');
    }
);
```

### Q4: 如何限制上传文件大小？

**A**: 修改 `com.uploadify()` 方法中的 `fileSizeLimit` 配置（目前硬编码为 5MB）。

**临时方案**：在优化前手动修改 `js/com/core.js` 的 1736 行和 1887 行：

```javascript
// 修改前
fileSizeLimit: '5MB',

// 修改后（例如改为 10MB）
fileSizeLimit: '10MB',
```

**推荐方案**：在 `config.js` 中添加配置项：

```javascript
config.maxUploadSize = '10MB';
```

然后修改 `uploadify` 方法使用 `config.maxUploadSize`。

### Q5: 如何上传多种文件类型？

**A**: 设置 `exts` 参数为多种格式的组合：

```javascript
// 上传图片和文档
com.uploadify(
    '#uploadBtn',
    '上传文件',
    null, null,
    '*.jpg;*.png;*.pdf;*.doc;*.docx;*.xls;*.xlsx',  // 多种格式
    {},
    3,
    successCallback
);
```

### Q6: OSS 上传成功后，返回的 uploadPath 是什么格式？

**A**: 完整的 HTTP URL 格式：

```
https://your-bucket.oss-cn-hangzhou.aliyuncs.com/uploads/example.jpg
```

可以直接用于 `<img>` 标签的 `src` 属性。

### Q7: 本地上传和 OSS 上传的回调参数有什么区别？

**A**: 经过优化后，两种模式的回调格式已统一：

```javascript
// 统一的 success 回调格式
{
    errorCode: 0,
    errorMsg: '上传成功',
    uploadPath: 'http://...',  // 完整访问路径
    fileName: 'example.jpg',   // 文件名（OSS特有，本地上传可能没有）
    fileSize: 102400,          // 文件大小（OSS特有）
    fileType: 'image/jpeg'     // 文件类型（OSS特有）
}
```

### Q8: 如何实现上传进度显示？

**A**: Huploadify 插件支持进度回调，可以在初始化时添加 `onUploadProgress` 事件：

```javascript
// 需要修改 _uploadifyLocal 或 _uploadifyOss 方法，添加以下配置
'onUploadProgress': function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
    var percent = (bytesUploaded / bytesTotal * 100).toFixed(2);
    $('#progressBar').css('width', percent + '%');
    $('#progressText').text(percent + '%');
}
```

---

## 迁移指南

### 从旧版本迁移

如果你的项目之前使用旧版的 `com.uploadify()` 方法，迁移步骤如下：

#### 步骤 1: 检查现有代码

旧版本调用示例：

```javascript
// 旧版本代码
com.uploadify('#uploadBtn', '上传图片', null, null, '*.jpg;*.png', {}, 1,
    function(file) {  // 注意：只有 file 参数
        console.log('上传成功:', file.name);
    }
);
```

#### 步骤 2: 更新回调函数

新版本需要调整回调函数签名：

```javascript
// 新版本代码
com.uploadify('#uploadBtn', '上传图片', null, null, '*.jpg;*.png', {}, 1,
    function(result, file) {  // 增加了 result 参数
        console.log('上传成功:', result.uploadPath);
        console.log('文件名:', file.name);
    },
    function(error) {  // 新增 fail 回调（可选）
        console.error('上传失败:', error.errorMsg);
    }
);
```

#### 步骤 3: 测试验证

1. 测试本地上传功能是否正常
2. 测试 OSS 上传功能是否正常
3. 测试错误处理是否正确
4. 测试批量上传是否正常

---

## 技术架构

### 方法调用流程

```
com.uploadify()
    ├─ 参数处理与验证
    ├─ 提取公共配置
    └─ 判断上传模式
        ├─ config.isAliOss = true
        │   └─ com._uploadifyOss()
        │       ├─ 初始化 Huploadify
        │       ├─ onUploadStart
        │       │   ├─ 获取 OSS 签名 (api.upgrade.generatePostSignature)
        │       │   ├─ 构建 FormData
        │       │   └─ 直接上传到 OSS ($.ajax)
        │       └─ onUploadError
        │
        └─ config.isAliOss = false
            └─ com._uploadifyLocal()
                ├─ 构建上传 URL
                ├─ 初始化 Huploadify
                ├─ onUploadSuccess
                └─ onUploadError
```

### 依赖关系

```
com.uploadify()
    ├─ 依赖: config.isAliOss
    ├─ 依赖: config.uploadTimeout
    ├─ 依赖: config.media
    ├─ 依赖: api.common.uploadImg / api.common.uploadOther
    ├─ 依赖: api.upgrade.generatePostSignature (仅OSS)
    └─ 依赖: Huploadify 插件
```

---

## 后续优化建议

1. **配置化文件大小限制**：将 `fileSizeLimit` 从硬编码改为可配置
2. **支持更多云存储**：扩展支持华为云 OBS、腾讯云 COS 等
3. **进度显示优化**：统一本地和 OSS 的上传进度显示
4. **断点续传**：实现大文件断点续传功能
5. **图片压缩**：上传前自动压缩图片（可选）
6. **水印添加**：上传图片时自动添加水印（可选）

---

## 相关文档

- [前端架构文档](../WebContent/CLAUDE.md)
- [API 接口文档](./API.md)
- [Huploadify 插件文档](https://github.com/pengkobe/huploadify)
- [阿里云 OSS 文档](https://help.aliyun.com/product/31815.html)

---

**维护者**: AI 优化生成
**更新时间**: 2025-12-06
**版本**: v2.0
