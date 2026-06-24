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
        iframeHeight: 400,
        // 加载超时时间（毫秒）
        loadTimeout: 15000
    };

    // ========== 全局变量 ==========
    var currentMethod = 'qrcode'; // 当前登录方式
    var currentAuthCode = null; // 当前授权码
    var params = {}; // 全局参数对象（用于存储securityCode等）

    function getTemplateIndexUrl() {

        var template = null;

        try {
            template = window.localStorage && window.localStorage.getItem("fl_template");
        } catch (e) {
        }

        if (!template) {
            var cookies = document.cookie.split(";");

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].replace(/^\s+|\s+$/g, "");

                if (cookie.indexOf("templateStyle=") == 0) {
                    template = cookie.substring("templateStyle=".length);
                    break;
                }
            }
        }

        var urls = {
            ace: "index.html",
            metro: "index-metro.html",
            clear: "index-clear.html"
        };

        return urls[template] || "index.html";
    }
    
    function deleteAllCookies() {
        var cookies = document.cookie.split(';');
        
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf('=');
            var name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

            if (name == 'templateStyle') {
                continue;
            }
            
            // 删除cookie，需要指定路径
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
    }
    
    deleteAllCookies();

    // ========== 初始化 ==========
    initPage();

    /**
     * 页面初始化
     */
    function initPage() {
        // 优先检查URL参数中的socialCode和socialState
        if (checkSocialAuthCallback()) {
            return; // 如果有socialCode/socialState，直接处理回调，不继续初始化登录流程
        }

        // 初始化轮播功能
        initCarousel();

        // 初始化标签切换
        initTabSwitch();

        // 初始化密码登录功能
        initPasswordLogin();

        // 初始化帮助弹窗
        initHelpModal();

        // 初始化iframe事件
        initIframeEvents();

        // 检查登录回调
        checkLoginCallback();

        // 预加载验证码图片（确保缓存失效）
        preloadVerifyCode();

        // 默认初始化扫码登录
        initQRCodeLogin();
    }

    /**
     * 预加载验证码
     */
    function preloadVerifyCode() {
        var $verifyImg = $('#Verify');
        if ($verifyImg.length > 0) {
            // 直接调用刷新验证码接口
            refreshVerifyCode();
        }
    }

    /**
     * 初始化标签切换
     */
    function initTabSwitch() {
        $('.login-tab').on('click', function() {
            var $this = $(this);
            var targetTab = $this.data('tab');

            //if ($this.hasClass('active')) return;

            // 切换标签激活状态
            $('.login-tab').removeClass('active');
            $this.addClass('active');

            // 强制重置所有面板状态
            $('.login-form-panel').each(function() {
                $(this).removeClass('active')
                    .css({'display': 'none', 'opacity': '0'});
            });

            // 强制重绘
            document.body.offsetHeight; // 触发重绘

            if (targetTab === 'workwechat') {
                // 重置企业微信登录状态
                resetWorkWechatPanel();

                // 使用原生JavaScript强制设置样式
                var qrcodePanel = document.getElementById('qrcodePanel');
                qrcodePanel.style.display = 'block';
                qrcodePanel.style.opacity = '1';
                $(qrcodePanel).addClass('active');

                // 延迟初始化企业微信登录
                setTimeout(function() {
                    initQRCodeLogin();
                }, 100);

            } else if (targetTab === 'password') {

                // 使用原生JavaScript强制设置样式
                var passwordPanel = document.getElementById('passwordPanel');
                passwordPanel.style.display = 'block';
                passwordPanel.style.opacity = '1';
                $(passwordPanel).addClass('active');

                // 重置密码表单状态
                resetPasswordForm();

                // 延迟刷新验证码（确保DOM已经渲染完成）
                setTimeout(function() {
                    refreshVerifyCode();
                }, 50);
            }
        });
    }

    /**
     * 重置企业微信登录面板状态
     */
    function resetWorkWechatPanel() {
        // 强制隐藏所有可能的加载状态和错误状态
        $('#iframeLoading, #iframeError').remove();

        // 重置二维码区域
        resetQRCodeUI();

        // 确保二维码区域可见
        $('#workWechatQR').removeClass('hide');

        // 确保iframe容器隐藏
        $('#iframeContainer').addClass('hide');

        // 清空iframe源
        $('#workWechatIframe').attr('src', '').hide();

        // 恢复提示信息
        //$('#qrcodeTip').html('<i class="ace-icon fa fa-mobile"></i><span>请使用<strong>企业微信</strong>扫码登录</span>');

        // 清除之前的授权码
        currentAuthCode = null;
    }

    /**
     * 重置密码登录表单状态
     */
    function resetPasswordForm() {
        // 清空表单
        $('#loginForm')[0].reset();

        // 重置按钮状态
        $('#loginBtn').prop('disabled', false).html('<i class="ace-icon fa fa-key"></i> 登录账号');

        // 清除错误信息
        $('#errorMsg').hide();

        // 重置密码显示状态
        $('#password').attr('type', 'password');
        $('#passwordToggle').removeClass('fa-eye').addClass('fa-eye-slash');
    }

    /**
     * 初始化密码登录功能
     */
    function initPasswordLogin() {
        // 密码显示/隐藏切换
        $('#passwordToggle').on('click', function() {
            var $passwordInput = $('#password');
            var $toggle = $(this);

            if ($passwordInput.attr('type') === 'password') {
                $passwordInput.attr('type', 'text');
                $toggle.removeClass('fa-eye-slash').addClass('fa-eye');
            } else {
                $passwordInput.attr('type', 'password');
                $toggle.removeClass('fa-eye').addClass('fa-eye-slash');
            }
        });

        // 验证码图片点击刷新
        $(document).on('click', '#Verify', function() {
            refreshVerifyCode();
        });

        // 登录按钮点击事件
        $('#loginBtn').on('click', function() {
            handlePasswordLogin();
        });

        // 回车键登录
        $('#loginForm input').on('keypress', function(e) {
            if (e.which === 13) {
                handlePasswordLogin();
            }
        });
    }

    /**
     * 处理密码登录
     */
    function handlePasswordLogin() {
        var userId = $('#userId').val().trim();
        var password = $('#password').val().trim();
        var verifyCode = $('#nowCode').val().trim();

        // 表单验证
        if (!userId) {
            showError('请输入用户名');
            return;
        }

        if (!password) {
            showError('请输入密码');
            return;
        }

        if (!verifyCode) {
            showError('请输入验证码');
            return;
        }

        // Demo 模式直接跳转
        if (config.demo) {
            setCookie("loginTime", new Date().getTime(), config.timeout);
            window.location.href = getTemplateIndexUrl() + "?timestamp=" + new Date().getTime();
            return;
        }

        // 显示加载状态
        showLoginLoading();

        // 清空错误提示（不清除display属性，只清空内容）
        $('#errorMsg').html('');

        // 获取 MD5 函数
        function getMD5(str) {
            // 使用 CryptoJS.MD5
            if (typeof CryptoJS !== 'undefined' && CryptoJS.MD5) {
                return CryptoJS.MD5(str).toString().toUpperCase();
            }
            // 使用 flcry 函数
            else if (typeof flcry !== 'undefined') {
                return flcry(str).toUpperCase();
            }
            else {
                return '';
            }
        }

        // 第一步：请求登录挑战（nonce）
        $.ajax({
            type: "POST",
            dataType: "json",
            url: config.communion + "requestLoginChallenge.do",
            data: { userId: userId },
            success: function(data) {
                if (data.errorCode != 0) {
                    showError(data.errorMsg || "获取登录挑战失败");
                    resetLoginButton();
                    return;
                }

                var nonce = data.nonce;

                // 第二步：计算响应哈希
                var passwordMD5 = getMD5(password);
                var responseHash = getMD5(passwordMD5 + nonce);

                // 第三步：发送响应哈希进行登录
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: config.communion + "doLogin.do",
                    data: {
                        userId: userId,
                        password: passwordMD5,  // 使用 MD5 密码
                        verifyCode: verifyCode,
                        company: config.company || '',
                        securityCode: params.securityCode || ''
                    },
                    success: function(data) {
                        if (data.errorCode == 1) {
                            // 验证码错误
                            showError(data.errorMsg || "验证码错误");
                            refreshVerifyCode();
                            resetLoginButton();
                        } else if (data.errorCode == 0) {
                            // 登录成功
                            var authentication = data.authentication.replace(/[\r\n]/g, "");
                            setCookie("authentication", authentication, config.timeout);
                            setCookie("loginTime", new Date().getTime(), config.timeout);
                            setCookie("versionCode", config.versionCode, config.timeout);
                            showLoginSuccess();
                            setTimeout(function() {
                                window.location.href = getTemplateIndexUrl() + "?timestamp=" + new Date().getTime();
                            }, 1000);
                        } else {
                            // 其他错误（账号或密码错误）
                            var errorMsg = data.errorMsg || data.msg || "登录失败，请检查用户名和密码";
                            showError(errorMsg);
                            refreshVerifyCode();
                            resetLoginButton();
                        }
                    },
                    error: function(xhr, status, error) {
                        // 尝试解析响应内容
                        var errorMsg = "网络错误，请重试";
                        try {
                            if (xhr.responseText) {
                                var response = JSON.parse(xhr.responseText);
                                errorMsg = response.errorMsg || response.msg || errorMsg;
                            }
                        } catch (e) {
                            // 解析失败，使用默认错误信息
                        }

                        showError(errorMsg);
                        resetLoginButton();
                    }
                });
            },
            error: function(xhr, status, error) {
                showError("网络错误，请重试");
                resetLoginButton();
            }
        });
    }

    /**
     * 重置登录按钮状态
     */
    function resetLoginButton() {
        $('#loginBtn').prop('disabled', false).html('<i class="ace-icon fa fa-key"></i> 登录账号');
    }

    /**
     * 刷新验证码
     */
    function refreshVerifyCode() {
        var $verifyImg = $('#Verify');
        if ($verifyImg.length > 0) {
            // Demo模式使用静态图片
            if (config.demo) {
                var timestamp = new Date().getTime();
                $verifyImg.attr('src', 'images/verifyCode.jpg?t=' + timestamp);
                return;
            }

            // 生产模式：先获取securityCode，再加载验证码图片
            $.ajax({
                url: config.communion + '/securityCode.do',
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response && response.securityCode) {
                        // 保存securityCode到params供后续登录使用
                        params.securityCode = response.securityCode.replace(/[\r\n]/g, '');

                        // 构建验证码图片URL
                        var timestamp = new Date().getTime();
                        var securityCodeEncoded = params.securityCode.replace(/\+/g, '%2B');
                        var verifyCodeUrl = config.communion + '/verifyCode.do?timestamp=' + timestamp + '&securityCode=' + securityCodeEncoded;

                        // 设置验证码图片源
                        $verifyImg.attr('src', verifyCodeUrl);
                    }
                },
                error: function(xhr, status, error) {
                    // 失败时显示占位图或错误提示
                    $verifyImg.attr('alt', '验证码加载失败');
                }
            });
        }
    }

    /**
     * 显示错误信息
     */
    function showError(message) {
        var $errorMsg = $('#errorMsg');
        if ($errorMsg.length > 0) {
            // 清除之前的定时器（如果有）
            if ($errorMsg.data('timer')) {
                clearTimeout($errorMsg.data('timer'));
            }

            // 显示错误信息
            $errorMsg.html(message).show();

            // 3秒后自动清空
            var timer = setTimeout(function() {
                $errorMsg.html('');
            }, 3000);
            $errorMsg.data('timer', timer);
        } else {
            // 如果DOM中不存在errorMsg元素，使用alert作为降级方案
            alert(message);
        }
    }

    /**
     * 显示登录加载状态
     */
    function showLoginLoading() {
        $('#loginBtn').prop('disabled', true).html('<i class="ace-icon fa fa-spinner fa-spin"></i> 登录中...');
    }

    /**
     * 显示登录成功状态
     */
    function showLoginSuccess() {
        $('#loginBtn').prop('disabled', false).html('<i class="ace-icon fa fa-check"></i> 登录成功');
    }

    /**
     * 初始化轮播功能
     */
    function initCarousel() {
        var currentSlide = 0;
        var totalSlides = $('.carousel-slide').length;
        var slideInterval;

        // 显示指定幻灯片
        function showSlide(index) {
            $('.carousel-slide').removeClass('active');
            $('.indicator').removeClass('active');

            $('.carousel-slide').eq(index).addClass('active');
            $('.indicator').eq(index).addClass('active');

            currentSlide = index;
        }

        // 下一张幻灯片
        function nextSlide() {
            var nextIndex = (currentSlide + 1) % totalSlides;
            showSlide(nextIndex);
        }

        // 上一张幻灯片
        function prevSlide() {
            var prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(prevIndex);
        }

        // 开始自动轮播
        function startAutoPlay() {
            slideInterval = setInterval(nextSlide, 4000); // 每4秒切换一次
        }

        // 停止自动轮播
        function stopAutoPlay() {
            clearInterval(slideInterval);
        }

        // 绑定控制按钮事件
        $('#nextSlide').on('click', function() {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });

        $('#prevSlide').on('click', function() {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });

        // 绑定指示器点击事件
        $('.indicator').on('click', function() {
            var slideIndex = $(this).data('slide');
            stopAutoPlay();
            showSlide(slideIndex);
            startAutoPlay();
        });

        // 鼠标悬停时暂停轮播
        $('.carousel-container').on('mouseenter', stopAutoPlay);
        $('.carousel-container').on('mouseleave', startAutoPlay);

        // 启动自动轮播
        startAutoPlay();
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
        });

        // iframe加载错误事件
        $('#workWechatIframe').on('error', function() {
            showIframeLoadError();
        });
    }

    /**
     * 检查socialCode和socialState参数并处理回调
     */
    function checkSocialAuthCallback() {
        // 检查URL参数中的socialCode和socialState
        var urlParams = new URLSearchParams(window.location.search);
        var socialCode = urlParams.get('code');
        var socialState = urlParams.get('state');

        if (socialCode && socialState) {
            handleSocialAuthCallback(socialCode, socialState);
            return true;
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
            handleWorkWechatCallback(code, state);
        }
    }

    /**
     * 初始化扫码登录
     */
    function initQRCodeLogin() {
        resetQRCodeUI();

        if (config.demo) {
            // Demo模式
            showQRCodeDemo();
            return;
        }

        // 显示加载状态
        showQRCodeLoading('正在获取企业微信登录页面...');

        // 调用企业微信接口获取登录URL
        $.ajax({
            url: WORK_WECHAT_CONFIG.socialAuthCodeUrl,
            method: 'GET',
            timeout: WORK_WECHAT_CONFIG.loadTimeout,
            data:{
                //"domain": "https://daily-zq.fanglin.vip/organization/employee",
                "domain": "https://platform-erp.fanglin.vip/xlogin.html",
            },
            success: function(response) {

                // 检查响应格式
                if (!response) {
                    showQRCodeError('服务器响应为空');
                    return;
                }

                if (typeof response !== 'object') {
                    showQRCodeError('服务器响应格式错误');
                    return;
                }

                if (response.errorCode === 0 && response.domain) {
                    // 成功获取企业微信登录URL
                    var wechatUrl = response.domain;

                    // 验证URL格式
                    if (typeof wechatUrl !== 'string' || !wechatUrl.startsWith('http')) {
                        showQRCodeError('企业微信登录链接格式无效');
                        return;
                    }

                    try {
                        // 解析URL获取domain
                        var urlObj = new URL(wechatUrl);
                        var domain = urlObj.protocol + '//' + urlObj.host + urlObj.pathname;

                        // 提取state参数
                        var state = urlObj.searchParams.get('state');
                        if (state) {
                            currentAuthCode = state;
                        }

                        // 使用iframe显示企业微信登录页面
                        showIframe(wechatUrl);

                    } catch (e) {
                        showQRCodeError('企业微信登录链接解析失败');
                    }

                } else {
                    var errorMsg = response.msg || '获取企业微信登录URL失败';
                    showQRCodeError(errorMsg);
                }
            },
            error: function(xhr, status, error) {

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
        //$('#qrcodeTip').html('<i class="ace-icon fa fa-desktop"></i><span>正在打开<strong>企业微信登录页面</strong></span>');

        // 设置iframe高度
        $('.work-wechat-iframe').css('height', WORK_WECHAT_CONFIG.iframeHeight + 'px');

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
        //$('#qrcodeTip').html('<i class="ace-icon fa fa-mobile"></i><span>请使用<strong>企业微信</strong>扫码登录</span>');

    }

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
        //$('#qrcodeTip').html('<i class="ace-icon fa fa-check-circle"></i><span><strong>企业微信登录页面已就绪</strong>，请在上方页面中扫码登录</span>');
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
            window.location.href = getTemplateIndexUrl() + "?timestamp=" + new Date().getTime();
        }, 2000);
    }

    /**
     * 处理socialCode/socialState回调 - 调用stateAuthCode.do接口
     */
    function handleSocialAuthCallback(socialCode, socialState) {

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

                // 检查响应是否包含osstoken
                if (response && response.domain) {

                    window.authentication = response.domain;

                    setTimeout(function(){
                        
                        setCookie("authentication", response.domain.replace(/[\r\n]/g, ""), config.timeout);
                        setCookie("loginTime", new Date().getTime(), config.timeout);
                        setCookie("versionCode", config.versionCode, config.timeout);
                        
                        window.location.replace(config.server + "/redirect.html?authentication=" + response.domain.replace(/[\r\n]/g, ""));
                    }, 3000);

                } else {
                    showLoginFailure('登录认证失败，响应数据无效');
                }
            },
            error: function(xhr, status, error) {

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
        resetClickLoginUI();

        $('#workWechatLoginBtn').on('click', function() {
            startWorkWechatClickLogin();
        });
    }

    /**
     * 开始企业微信点击登录
     */
    function startWorkWechatClickLogin() {

        if (config.demo) {
            simulateDemoLogin();
            return;
        }

        showClickLoginLoading('正在跳转到企业微信...');

        // 直接跳转到企业微信登录页面
        var wechatUrl = 'https://work.weixin.qq.com/';

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
     * 显示Demo模式 - 仅使用iframe
     */
    function showQRCodeDemo() {
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