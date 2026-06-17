var config = {

    intranet: false,

    versionCode: "",
    system: 1,
    uploadTimeout: 30,
    quotationLimitDiscount: 5,
    timeout: 120,
    singlePointTime: 60000,
    serviceRate: 0.1,
    addreduceManagerPrice: true,
    addreduceDiscount: 8.8,
    spacing: 5,
    planTimeLimit: 5,
    prefix: '', // 使用在获取二维码路径
    iconImg: './images/icon_fanglin.png',
    backgroundImg: './images/bg_fanglin.jpg',
    shakingColor: '#197bb5', // 1918: #892f89 , ehome: #3d677c

    // 文件上传配置
    isAliOss: false,  // 是否启用阿里云 OSS 上传（false=本地上传，true=OSS上传）
    uploadMode: 'sts', // OSS 上传模式：'sts'（STS临时凭证，推荐）| 'policy'（旧Policy签名，兼容）

    // OSS 图片显示配置（type=3 时使用）
    ossConfig: {
        bucket: '',            // OSS Bucket 名称（如：fanglin-erp）
        endpoint: '',          // OSS 端点（如：oss-cn-hangzhou.aliyuncs.com）
        region: '',            // 地域（如：cn-hangzhou，STS直传必填）
        dir: '',               // 图片目录前缀（如：images/，可选）
        host: ''               // OSS 访问域名（可选，如：https://cdn.fanglin.com 或自动构建）
    },

    communion: '',
    server: '',
    media: '',
    dmedia: '',
    library: '',
    store: ''
};

window.console && window.console.log && console.log("%c有时候，正是那些人们认为的无用之人成就了无人能成之事。\nSometimes it's the very people who no one imagines anything of who do the things no one can imagine.\n--Alan·Mathison·Turing'sayings\n", "color:#428bca; font-size:1em");
window.console && window.console.log && console.log("%c台湾是中国领土不可分割的一部分。\nTaiwan is an inalienable part of the Chinese territory.\n", "color:#f00; font-size:1.2em");