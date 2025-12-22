/**
 * 企业微信登录脚本 - iframe版本 直接使用iframe显示企业微信登录页面
 */

jQuery(function($) {
    // ========== 配置信息 ==========
    var WORK_WECHAT_CONFIG = {
        // 企业微信接口地址
        socialAuthCodeUrl: config.server + 'socialAuthCode.do',
        // 本地回调地址
        redirectUri: window.location.origin + '/xlogin.html',
        // iframe高度
        iframeHeight: 500,
        // 加载超时时间（毫秒）
        loadTimeout: 15000
    };

    // ========== 全局变量 ==========
    var currentMethod = 'qrcode'; // 当前登录方式
    var currentAuthCode = null; // 当前授权码
    var currentWechatUrl = null; // 当前企业微信URL

    // ========== 初始化 ==========
    initPage();

    /**
     * 页面初始化
     */
    function initPage() {
        console.log('企业微信登录页面初始化（iframe版本）...');

        // 优先检查URL参数中的socialCode和socialState
        if (checkSocialAuthCallback()) {
            return; // 如果有socialCode/socialState，直接处理回调，不继续初始化登录流程
        }

        // 初始化登录方式切换
        initMethodSwitch();

        // 初始化帮助弹窗
        initHelpModal();

        // 初始化iframe事件
        initIframeEvents();

        // 检查登录回调
        checkLoginCallback();

        // 默认初始化扫码登录
        initQRCodeLogin();
    }

    /**
     * 初始化登录方式切换
     */
    function initMethodSwitch() {
        $('.method-item').on('click', function() {
            var $this = $(this);
            var method = $this.data('method');

            if (method === currentMethod) return;

            // 切换激活状态
            $('.method-item').removeClass('active');
            $this.addClass('active');

            // 切换面板
            $('.login-form-panel').removeClass('active');
            if (method === 'qrcode') {
                $('#qrcodePanel').addClass('active');
                initQRCodeLogin();
            } else if (method === 'click') {
                $('#clickPanel').addClass('active');
                initClickLogin();
            }

            currentMethod = method;
        });
    }

    /**
     * 初始化帮助弹窗
     */
    function initHelpModal() {
        $('#helpLink').on('click', function() {
            $('#helpModal').modal('show');
        });

        // 其他登录链接
        $('#dingdingLink').on('click', function() {
            window.location.href = 'login.html#qrcode';
        });
    }

    /**
     * 初始化iframe事件
     */
    function initIframeEvents() {
        // 关闭iframe按钮
        $('#closeIframeBtn').on('click', function() {
            closeIframe();
        });

        // iframe加载事件
        $('#workWechatIframe').on('load', function() {
            showIframeLoadingComplete();
            console.log('企业微信页面加载完成');
        });

        // iframe加载错误事件
        $('#workWechatIframe').on('error', function() {
            showIframeLoadError();
            console.error('企业微信页面加载失败');
        });
    }

    /**
     * 检查socialCode和socialState参数并处理回调
     */
    function checkSocialAuthCallback() {
        // 检查URL参数中的socialCode和socialState
        var urlParams = new URLSearchParams(window.location.search);
        var socialCode = urlParams.get('socialCode');
        var socialState = urlParams.get('socialState');

        if (socialCode && socialState) {
            console.log('检测到socialCode/socialState回调:', {
                socialCode: socialCode,
                socialState: socialState
            });

            handleSocialAuthCallback(socialCode, socialState);
            return true;
        }else{
            console.log('检测到socialCode/socialState回调:', window.location.search);
        }

        return false;
    }

    /**
     * 检查登录回调
     */
    function checkLoginCallback() {
        // 检查URL参数
        var urlParams = new URLSearchParams(window.location.search);
        var code = urlParams.get('code');
        var state = urlParams.get('state');

        if (code && state) {
            console.log('检测到企业微信登录回调:', { code: code, state: state });
            handleWorkWechatCallback(code, state);
        }
    }

    /**
     * 初始化扫码登录
     */
    function initQRCodeLogin() {
        console.log('初始化企业微信扫码登录（iframe版本）...');
        resetQRCodeUI();

        if (config.demo) {
            // Demo模式
            showQRCodeDemo();
            return;
        }

        // 显示加载状态
        showQRCodeLoading('正在获取企业微信登录页面...');

        // 调用企业微信接口获取登录URL
        console.log('开始请求企业微信登录URL:', WORK_WECHAT_CONFIG.socialAuthCodeUrl);
        $.ajax({
            url: WORK_WECHAT_CONFIG.socialAuthCodeUrl,
            method: 'GET',
            timeout: WORK_WECHAT_CONFIG.loadTimeout,
            data:{
                //"domain": "https://daily-zq.fanglin.vip/organization/employee",
                "domain": "https://platform-erp.fanglin.vip/xlogin.html",
            },
            success: function(response) {
                console.log('获取企业微信登录URL响应:', response);

                // 检查响应格式
                if (!response) {
                    console.error('响应为空');
                    showQRCodeError('服务器响应为空');
                    return;
                }

                if (typeof response !== 'object') {
                    console.error('响应格式错误:', typeof response);
                    showQRCodeError('服务器响应格式错误');
                    return;
                }

                if (response.errorCode === 0 && response.domain) {
                    // 成功获取企业微信登录URL
                    var wechatUrl = response.domain;
                    console.log('企业微信登录URL:', wechatUrl);

                    // 验证URL格式
                    if (typeof wechatUrl !== 'string' || !wechatUrl.startsWith('http')) {
                        console.error('URL格式无效:', wechatUrl);
                        showQRCodeError('企业微信登录链接格式无效');
                        return;
                    }

                    try {
                        // 解析URL获取domain
                        var urlObj = new URL(wechatUrl);
                        var domain = urlObj.protocol + '//' + urlObj.host + urlObj.pathname;
                        console.log('解析URL成功:', domain);

                        // 提取state参数
                        var state = urlObj.searchParams.get('state');
                        if (state) {
                            currentAuthCode = state;
                            console.log('提取state成功:', state);
                        }

                        // 使用iframe显示企业微信登录页面
                        showIframe(wechatUrl);

                        // 生成并显示二维码作为备用
                        generateQRCodeAsFallback(wechatUrl);

                    } catch (e) {
                        console.error('解析URL失败:', e.message);
                        showQRCodeError('企业微信登录链接解析失败');
                    }

                } else {
                    var errorMsg = response.msg || '获取企业微信登录URL失败';
                    console.error('接口返回错误:', errorMsg);
                    showQRCodeError(errorMsg);
                }
            },
            error: function(xhr, status, error) {
                console.error('获取企业微信登录URL失败:', {
                    status: status,
                    error: error,
                    responseText: xhr.responseText,
                    statusCode: xhr.status
                });

                var errorMsg = '网络错误，请检查连接';
                if (xhr.status === 0) {
                    errorMsg = '网络连接失败，请检查网络';
                } else if (xhr.status === 404) {
                    errorMsg = '登录接口不存在，请联系管理员';
                } else if (xhr.status === 500) {
                    errorMsg = '服务器内部错误，请稍后重试';
                }

                showQRCodeError(errorMsg);
            }
        });
    }

    /**
     * 显示iframe加载企业微信登录页面
     */
    function showIframe(url) {
        // 隐藏二维码区域
        $('#workWechatQR').addClass('hide');

        // 显示iframe容器
        $('#iframeContainer').removeClass('hide');

        // 设置iframe源
        $('#workWechatIframe').attr('src', url);

        // 显示加载状态
        showIframeLoading('正在加载企业微信登录页面...');

        // 更新提示信息
        $('#qrcodeTip').html('<i class="ace-icon fa fa-desktop"></i><span>正在打开<strong>企业微信登录页面</strong></span>');

        // 设置iframe高度
        $('.work-wechat-iframe').css('height', WORK_WECHAT_CONFIG.iframeHeight + 'px');

        console.log('开始加载企业微信页面:', url);
    }

    /**
     * 关闭iframe，返回二维码显示
     */
    function closeIframe() {
        // 显示二维码区域
        $('#workWechatQR').removeClass('hide');

        // 隐藏iframe容器
        $('#iframeContainer').addClass('hide');

        // 清空iframe源
        $('#workWechatIframe').attr('src', '');

        // 恢复提示信息
        $('#qrcodeTip').html('<i class="ace-icon fa fa-mobile"></i><span>请使用<strong>企业微信</strong>扫码登录</span>');

        console.log('iframe已关闭');
    }

    /**
     * 生成二维码作为备用显示
     */
    function generateQRCodeAsFallback(wechatUrl) {
        console.log('=== 开始生成二维码作为备用 ===');
        console.log('企业微信URL:', wechatUrl);

        if (!wechatUrl) {
            console.error('企业微信URL为空，无法生成二维码');
            showQRCodeError('企业微信登录链接无效');
            return;
        }

        // 使用多个二维码生成服务作为备选
        var qrApis = [
            'https://api.qrserver.com/v1/create-qr-code/?size=200&data=',
            'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=',
            'https://quickchart.io/qr?size=200&text=',
            'https://api.qrify.io/?format=png&size=200&text='
        ];

        var currentApiIndex = 0;

        function tryNextApi() {
            if (currentApiIndex >= qrApis.length) {
                console.error('所有二维码API都失败了');
                showQRCodeError('所有二维码生成服务都不可用，请稍后重试');
                return;
            }

            var qrApiUrl = qrApis[currentApiIndex] + encodeURIComponent(wechatUrl);
            console.log('尝试二维码API #' + (currentApiIndex + 1) + ':', qrApiUrl);

            // 在二维码区域显示二维码
            if (currentApiIndex === 0) {
                $('#workWechatQR').html(`
                    <div class="qrcode-wrapper">
                        <div class="qrcode-loading">
                            <i class="ace-icon fa fa-spinner fa-spin fa-2x"></i>
                            <p>正在生成二维码...</p>
                        </div>
                        <img src="${qrApiUrl}" alt="企业微信二维码" class="qrcode-image"
                             onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'qrcode-error\\'><i class=\\'ace-icon fa fa-exclamation-triangle fa-2x\\'></i><p>二维码生成失败，正在尝试其他方式...</p></div>'; setTimeout(function(){ tryNextApi(); }, 1000);"
                             onload="handleQrCodeSuccess(this)">
                        <div class="qrcode-border"></div>
                    </div>
                `);
            } else {
                // 后续API尝试，直接替换图片
                var $img = $('#workWechatQR img.qrcode-image');
                if ($img.length === 0) {
                    $('#workWechatQR').html(`
                        <div class="qrcode-wrapper">
                            <div class="qrcode-loading">
                                <i class="ace-icon fa fa-spinner fa-spin fa-2x"></i>
                                <p>正在尝试其他二维码服务...</p>
                            </div>
                            <img src="${qrApiUrl}" alt="企业微信二维码" class="qrcode-image"
                                 onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'qrcode-error\\'><i class=\\'ace-icon fa fa-exclamation-triangle fa-2x\\'></i><p>二维码生成失败，正在尝试其他方式...</p></div>'; setTimeout(function(){ tryNextApi(); }, 1000);"
                                 onload="handleQrCodeSuccess(this)">
                            <div class="qrcode-border"></div>
                        </div>
                    `);
                } else {
                    $img.attr('src', qrApiUrl);
                }
            }

            currentApiIndex++;
        }

        // 设置加载超时检查
        setTimeout(function() {
            var $img = $('#workWechatQR img.qrcode-image');
            var $loading = $('#workWechatQR .qrcode-loading');
            if ($loading.length > 0) {
                console.warn('二维码生成时间较长，正在继续等待...');
            }
            if ($img.length > 0 && !$img[0].complete && $img[0].naturalWidth === 0) {
                console.warn('二维码图片可能加载失败，尝试下一个API');
                if (currentApiIndex < qrApis.length) {
                    tryNextApi();
                }
            }
        }, 8000); // 8秒超时检查

        tryNextApi();
        console.log('二维码生成流程已启动');
    }

    /**
     * 处理二维码加载成功
     */
    function handleQrCodeSuccess(img) {
        console.log('二维码加载成功:', img.src);
        $('.qrcode-loading').remove();
        console.log('二维码显示完成');
    }

    /**
     * 处理二维码加载错误
     */
    function handleQrCodeError(img) {
        console.error('二维码加载失败:', img.src);
        $('.qrcode-loading').remove();

        // 显示错误信息和重试按钮
        $('#workWechatQR').html(`
            <div class="qrcode-error">
                <i class="ace-icon fa fa-exclamation-triangle fa-2x"></i>
                <p>二维码生成失败</p>
                <p class="error-details">URL: ' + img.src + '</p>
                <button type="button" class="btn btn-sm btn-default" onclick="retryQRCode()">
                    <i class="ace-icon fa fa-refresh"></i> 重试
                </button>
            </div>
        `);
    }

    /**
     * 重试二维码生成
     */
    function retryQRCode() {
        console.log('=== 重试二维码生成 ===');

        // 首先尝试从iframe获取URL
        var currentUrl = '';
        if ($('#iframeContainer').is(':visible')) {
            currentUrl = $('#workWechatIframe').attr('src');
            console.log('从iframe获取URL:', currentUrl);
        }

        // 如果iframe没有URL，重新请求企业微信登录接口
        if (!currentUrl) {
            console.log('iframe没有有效URL，重新请求企业微信登录接口');
            resetQRCodeUI();
            showQRCodeLoading('正在重新获取登录链接...');

            $.ajax({
                url: WORK_WECHAT_CONFIG.socialAuthCodeUrl,
                method: 'GET',
                timeout: WORK_WECHAT_CONFIG.loadTimeout,
                success: function(response) {
                    console.log('重试 - 获取企业微信登录URL响应:', response);

                    if (response.errorCode === 0 && response.domain) {
                        var wechatUrl = response.domain;
                        console.log('重试 - 企业微信登录URL:', wechatUrl);
                        generateQRCodeAsFallback(wechatUrl);
                    } else {
                        showQRCodeError('重新获取登录链接失败: ' + (response.msg || '未知错误'));
                    }
                },
                error: function(xhr, status, error) {
                    console.error('重试 - 获取企业微信登录URL失败:', error);
                    showQRCodeError('网络错误，请检查连接后重试');
                }
            });
        } else {
            // 使用现有的URL重新生成二维码
            console.log('使用现有URL重新生成二维码:', currentUrl);
            generateQRCodeAsFallback(currentUrl);
        }
    }

    // 添加全局重试函数供外部调用
    window.retryQRCode = retryQRCode;

    /**
     * iframe加载中状态
     */
    function showIframeLoading(message) {
        $('#workWechatIframe').hide();

        // 在iframe位置显示加载状态
        $('#workWechatIframe').parent().append(`
            <div class="iframe-loading" id="iframeLoading">
                <i class="ace-icon fa fa-spinner fa-spin fa-2x"></i>
                <p>${message || '正在加载...'}</p>
            </div>
        `);
    }

    /**
     * iframe加载完成
     */
    function showIframeLoadingComplete() {
        // 移除加载状态
        $('#iframeLoading').remove();

        // 显示iframe
        $('#workWechatIframe').show();

        // 更新提示
        $('#qrcodeTip').html('<i class="ace-icon fa fa-check-circle"></i><span><strong>企业微信登录页面已就绪</strong>，请在上方页面中扫码登录</span>');
    }

    /**
     * iframe加载错误
     */
    function showIframeLoadError() {
        // 移除加载状态
        $('#iframeLoading').remove();

        // 显示错误信息
        $('#workWechatIframe').parent().append(`
            <div class="iframe-error" id="iframeError">
                <i class="ace-icon fa fa-exclamation-triangle fa-2x"></i>
                <p>企业微信页面加载失败</p>
                <button type="button" class="btn btn-sm btn-default" onclick="location.reload()">重新加载</button>
            </div>
        `);

        // 更新提示
        $('#qrcodeTip').html('<i class="ace-icon fa fa-exclamation-triangle"></i><span>企业微信页面加载失败，请查看下方的二维码</span>');
    }

    /**
     * 处理企业微信登录回调
     */
    function handleWorkWechatCallback(code, state) {
        console.log('处理企业微信登录回调:', { code: code, state: state });

        // 显示成功状态
        showQRCodeSuccess();

        // 设置登录信息
        var token = 'workwechat_token_' + Date.now();
        setCookie("authentication", token, config.timeout);
        setCookie("loginTime", new Date().getTime(), config.timeout);
        setCookie("loginType", "work_wechat", config.timeout);
        setCookie("workwechatCode", code, config.timeout);
        setCookie("userName", "企业微信用户", config.timeout);

        // 跳转到主页面
        setTimeout(function() {
            window.location.href = "index.html?timestamp=" + new Date().getTime();
        }, 2000);
    }

    /**
     * 处理socialCode/socialState回调 - 调用stateAuthCode.do接口
     */
    function handleSocialAuthCallback(socialCode, socialState) {
        console.log('处理socialCode/socialState回调，调用stateAuthCode.do接口...');

        // 显示加载状态
        $('body').html(`
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                <div style="text-align: center;">
                    <i class="ace-icon fa fa-spinner fa-spin fa-4x" style="color: #00D084; margin-bottom: 20px;"></i>
                    <h3 style="color: #333; margin: 0 0 10px 0;">正在处理登录认证...</h3>
                    <p style="color: #666; margin: 0;">请稍候，正在验证您的身份</p>
                </div>
            </div>
        `);

        // 调用stateAuthCode.do接口
        $.ajax({
            url: config.server + 'stateAuthCode.do',
            method: 'POST',
            data: {
                socialCode: socialCode,
                socialState: socialState
            },
            timeout: 15000,
            success: function(response) {
                console.log('stateAuthCode.do接口响应:', response);

                // 检查响应是否包含osstoken
                if (response && response.domain) {
                    console.log('获取到domain，准备跳转到主页:', response.domain);

                    // 参考dlogin.js第68行的跳转逻辑
                    window.location.replace(config.server + "/redirect.html?authentication=" +
                        response.domain.replace(/[\r\n]/g, ""));
                } else {
                    console.error('stateAuthCode.do接口响应无效，缺少domain');
                    showLoginFailure('登录认证失败，响应数据无效');
                }
            },
            error: function(xhr, status, error) {
                console.error('stateAuthCode.do接口调用失败:', {
                    status: status,
                    error: error,
                    responseText: xhr.responseText,
                    statusCode: xhr.status
                });

                var errorMsg = '登录认证失败，请重试';
                if (xhr.status === 0) {
                    errorMsg = '网络连接失败，请检查网络';
                } else if (xhr.status === 404) {
                    errorMsg = '认证接口不存在，请联系管理员';
                } else if (xhr.status === 500) {
                    errorMsg = '服务器内部错误，请稍后重试';
                }

                showLoginFailure(errorMsg);
            }
        });
    }

    /**
     * 初始化点击登录
     */
    function initClickLogin() {
        console.log('初始化企业微信点击登录...');
        resetClickLoginUI();

        $('#workWechatLoginBtn').on('click', function() {
            startWorkWechatClickLogin();
        });
    }

    /**
     * 开始企业微信点击登录
     */
    function startWorkWechatClickLogin() {
        console.log('启动企业微信点击登录...');

        if (config.demo) {
            simulateDemoLogin();
            return;
        }

        showClickLoginLoading('正在跳转到企业微信...');

        // 直接跳转到企业微信登录页面
        var wechatUrl = 'https://work.weixin.qq.com/';
        console.log('跳转到企业微信:', wechatUrl);

        setTimeout(function() {
            window.open(wechatUrl, '_blank');
            showClickLoginError('请在新打开的企业微信页面中完成登录，然后返回本页面');
        }, 1000);
    }

    // ========== UI状态管理 ==========

    function showQRCodeLoading(message) {
        $('#workWechatQR').html(`
            <div class="qrcode-placeholder">
                <i class="ace-icon fa fa-spinner fa-spin fa-2x"></i>
                <p>${message || '正在处理...'}</p>
            </div>
        `);
    }

    function showQRCodeError(message) {
        $('#workWechatQR').html(`
            <div class="qrcode-error">
                <i class="ace-icon fa fa-exclamation-triangle fa-2x"></i>
                <p>${message}</p>
                <button type="button" class="btn btn-sm btn-default" onclick="location.reload()">重新加载</button>
            </div>
        `);

        $('#qrcodeRefresh').removeClass('hide').find('#refreshText').text(message);
    }

    function showQRCodeSuccess() {
        $('#qrcodePanel').find('.qrcode-area').addClass('success');
        $('#qrcodeSuccess').removeClass('hide');
        $('#qrcodeTip').addClass('hide');
    }

    function resetQRCodeUI() {
        $('#qrcodePanel').find('.qrcode-area').removeClass('success');
        $('#qrcodeSuccess, #qrcodeRefresh, #qrcodeScanning, iframeLoading, iframeError').addClass('hide');
        $('#qrcodeTip').removeClass('hide');
    }

    function showClickLoginLoading(message) {
        $('#workWechatLoginBtn')
            .prop('disabled', true)
            .html('<i class="ace-icon fa fa-spinner fa-spin"></i><span>' + (message || '正在处理...') + '</span>');
    }

    function showClickLoginError(message) {
        $('#workWechatLoginBtn')
            .prop('disabled', false)
            .html('<i class="ace-icon fa fa-weixin"></i><span>使用企业微信登录</span><i class="ace-icon fa fa-arrow-right"></i>');

        // 显示错误提示
        if (!$('#clickError').length) {
            $('#workWechatLoginBtn').after(`
                <div class="alert alert-warning" id="clickError">
                    <i class="ace-icon fa fa-info-circle"></i>
                    ${message}
                </div>
            `);
        }

        setTimeout(function() {
            $('#clickError').fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
    }

    function showClickLoginSuccess() {
        $('#clickPanel').find('.login-info').html(`
            <i class="ace-icon fa fa-check-circle fa-3x text-success"></i>
            <h3>登录成功！</h3>
            <p>正在跳转到系统主页...</p>
        `);
        $('#workWechatLoginBtn').hide();
    }

    function resetClickLoginUI() {
        $('#workWechatLoginBtn')
            .prop('disabled', false)
            .html('<i class="ace-icon fa fa-weixin"></i><span>使用企业微信登录</span><i class="ace-icon fa fa-arrow-right"></i>');
        $('#clickError').remove();
    }

    /**
     * 显示Demo模式
     */
    function showQRCodeDemo() {
        $('#workWechatQR').html(`
            <div class="demo-qr-code">
                <img src="images/verifyCode.jpg" alt="Demo二维码" class="qrcode-image">
                <div class="demo-badge">Demo</div>
            </div>
        `);

        $('.qrcode-tip').html('<i class="ace-icon fa fa-info-circle"></i><span>Demo模式：点击<span class="demo-link">模拟登录</span></span>');

        $('.demo-link').on('click', function() {
            simulateDemoLogin();
        });
    }

    /**
     * 模拟Demo登录
     */
    function simulateDemoLogin() {
        // 显示iframe加载Demo页面
        var demoUrl = 'about:blank';
        showIframe(demoUrl);

        // 在iframe中显示Demo内容
        setTimeout(function() {
            var iframeDoc = $('#workWechatIframe')[0].contentDocument;
            if (iframeDoc) {
                iframeDoc.body.innerHTML = `
                    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                        <h2 style="color: #00D084;">企业微信登录 - Demo模式</h2>
                        <p>这是一个模拟的企业微信登录页面</p>
                        <button onclick="parent.simulateLoginSuccess()" style="padding: 10px 20px; background: #00D084; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            模拟登录成功
                        </button>
                    </div>
                `;
            }
        }, 100);
    }

    /**
     * 模拟登录成功（供iframe调用）
     */
    window.simulateLoginSuccess = function() {
        console.log('模拟登录成功');
        handleWorkWechatCallback('demo_code_12345', 'demo_state_67890');
    };

    /**
     * 显示登录失败页面并返回登录
     */
    function showLoginFailure(errorMessage) {
        $('body').html(`
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                <div style="text-align: center; max-width: 400px; padding: 40px; background: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <i class="ace-icon fa fa-exclamation-triangle fa-4x" style="color: #ff6b6b; margin-bottom: 20px;"></i>
                    <h3 style="color: #333; margin: 0 0 15px 0;">登录失败</h3>
                    <p style="color: #666; margin: 0 0 25px 0; line-height: 1.5;">${errorMessage}</p>
                    <button type="button" onclick="location.reload()"
                            style="background: #00D084; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500;">
                        <i class="ace-icon fa fa-refresh"></i> 返回登录页
                    </button>
                </div>
            </div>
        `);
    }

    // ========== 工具函数 ==========

    /**
     * 设置 Cookie
     */
    function setCookie(cname, cvalue, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
    }

    // ========== 页面卸载清理 ==========
    $(window).on('beforeunload', function() {
        // 清理定时器和事件监听器
    });
});