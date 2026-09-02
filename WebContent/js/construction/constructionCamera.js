jQuery(function($) {

    var constructionCamera = {
        editFlg: false,
        current: null,
        medias: [],
        playIndex: 0,
        playTimer: null,
        livePlayerObj: null,
        liveHlsObj: null,
        liveEzuikitCallbacks: [],
        liveEzuikitLoading: false,
        liveEzuikitScripts: ["https://unpkg.com/ezuikit-js@9.0.20/ezuikit.js", "assets/ezuikit/ezuikit.js"],
        livePlayerLoading: false,
        livePlayerCallbacks: [],
        livePlayerScript: "https://open.ys7.com/sdk/js/2.0/ezuikit.js",
        liveHlsLoading: false,
        liveHlsCallbacks: [],
        liveHlsScript: "https://open.ys7.com/sdk/js/2.0/js/hls.min.js",

        modals: {
            cameraModal: com.focusPage("#cameraModal"),
            liveModal: com.focusPage("#liveModal"),
            mediaModal: com.focusPage("#mediaModal"),
            captureModal: com.focusPage("#captureModal")
        },

        btns: {
            saveCameraBtn: com.focusPage("#saveCameraBtn"),
            loadLiveBtn: com.focusPage("#loadLiveBtn"),
            loadMediaBtn: com.focusPage("#loadMediaBtn"),
            playMediaBtn: com.focusPage("#playMediaBtn"),
            pauseMediaBtn: com.focusPage("#pauseMediaBtn")
        },

        items: {
            ccid: com.focusPage("#ccid"),
            orderId: com.focusPage("#orderId"),
            deviceSerial: com.focusPage("#deviceSerial"),
            channelNo: com.focusPage("#channelNo"),
            name: com.focusPage("#name"),
            provider: com.focusPage("#provider"),
            verifyCode: com.focusPage("#verifyCode"),
            visibleStart: com.focusPage("#visibleStart"),
            visibleEnd: com.focusPage("#visibleEnd"),
            openLive: com.focusPage("#openLive"),
            openCapture: com.focusPage("#openCapture"),
            openAlbum: com.focusPage("#openAlbum"),
            openPlayback: com.focusPage("#openPlayback"),
            liveProtocol: com.focusPage("#liveProtocol"),
            livePlayer: com.focusPage("#livePlayer"),
            liveVideo: com.focusPage("#liveVideo"),
            livePlayerBox: com.focusPage("#livePlayerBox"),
            liveStatus: com.focusPage("#liveStatus"),
            liveUrl: com.focusPage("#liveUrl"),
            openLiveUrl: com.focusPage("#openLiveUrl"),
            mediaStartTime: com.focusPage("#mediaStartTime"),
            mediaEndTime: com.focusPage("#mediaEndTime"),
            mediaCount: com.focusPage("#mediaCount"),
            mediaStage: com.focusPage("#mediaStage"),
            mediaThumbs: com.focusPage("#mediaThumbs"),
            captureResult: com.focusPage("#captureResult")
        }
    };

    var openStatus = [{key: 0, value: "关闭"}, {key: 1, value: "开启"}];
    var providers = [{key: "ys7", value: "萤石"}];
    var protocols = [{key: "ezopen", value: "萤石播放器"}, {key: "2", value: "HLS"}, {key: "1", value: "RTMP"}];

    constructionCamera.items.provider.bindData(providers, "key", "value");
    constructionCamera.items.openLive.bindData(openStatus, "key", "value");
    constructionCamera.items.openCapture.bindData(openStatus, "key", "value");
    constructionCamera.items.openAlbum.bindData(openStatus, "key", "value");
    constructionCamera.items.openPlayback.bindData(openStatus, "key", "value");
    constructionCamera.items.liveProtocol.bindData(protocols, "key", "value");

    com.datetime(constructionCamera.items.visibleStart, "time");
    com.datetime(constructionCamera.items.visibleEnd, "time");
    com.datetime(constructionCamera.items.mediaStartTime);
    com.datetime(constructionCamera.items.mediaEndTime);

    constructionCamera.btns.saveCameraBtn.bindClick(saveCamera);
    constructionCamera.btns.loadLiveBtn.bindClick(loadLive);
    constructionCamera.btns.loadMediaBtn.bindClick(loadMedia);
    constructionCamera.btns.playMediaBtn.bindClick(playMedia);
    constructionCamera.btns.pauseMediaBtn.bindClick(pauseMedia);

    constructionCamera.modals.cameraModal.on("hide.bs.modal", function() {
        com.clearValidator();
        com.closeTip();
    });

    constructionCamera.modals.liveModal.on("hide.bs.modal", function() {
        resetLivePlayer(true);
    });

    constructionCamera.modals.mediaModal.on("hide.bs.modal", function() {
        pauseMedia();
    });

    defaults();

    var pageConfig = constructionPage.getConfig("constructionCamera");

    function btnVisible(key) {
        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var propertyMap = {
        "orderId": {field: "orderId", name: "装修单号", prop: "orderId", clazz: "blue"},
        "deviceSerial": {field: "deviceSerial", name: "设备号", prop: "deviceSerial", clazz: "grey"},
        "channelNo": {field: "channelNo", name: "通道", prop: "channelNo", clazz: "blue"},
        "provider": {field: "provider", name: "厂商", prop: function(v) { return providerText(v.provider); }, clazz: "grey"},
        "onlineStatus": {field: "onlineStatus", name: "在线", prop: function(v) { return onlineText(v.onlineStatus); }, clazz: "green"},
        "visibleTime": {field: "visibleStart", name: "可见时间", prop: function(v) { return (v.visibleStart || "") + " - " + (v.visibleEnd || ""); }, clazz: "blue"},
        "openLive": {field: "openLive", name: "直播", prop: function(v) { return openText(v.openLive); }, clazz: "red"},
        "openCapture": {field: "openCapture", name: "抓图", prop: function(v) { return openText(v.openCapture); }, clazz: "red"},
        "openAlbum": {field: "openAlbum", name: "图片集", prop: function(v) { return openText(v.openAlbum); }, clazz: "red"},
        "createTime": {field: "createTime", name: "创建时间", prop: "createTime", clazz: "green"}
    };

    var lineprops = (function() {
        if (pageConfig.propertyArr.length == 0) return [propertyMap.orderId, propertyMap.deviceSerial, propertyMap.channelNo, propertyMap.provider, propertyMap.onlineStatus, propertyMap.visibleTime, propertyMap.openLive, propertyMap.openCapture, propertyMap.openAlbum, propertyMap.createTime];

        var props = [];
        $.each(pageConfig.propertyArr, function(i, key) {
            if (propertyMap[key]) props.push(propertyMap[key]);
        });

        return props;
    })();

    var linebtns = {
        live: {
            name: "直播",
            clazz: "btn-success",
            handle: function(v) {
                constructionCamera.current = v;
                showLive(v);
            },
            show: function(v) {
                return btnVisible("live") && v.openLive == 1;
            }
        },
        capture: {
            name: "抓图",
            clazz: "btn-primary",
            handle: function(v) {
                capture(v);
            },
            show: function(v) {
                return btnVisible("capture") && v.openCapture == 1;
            }
        },
        media: {
            name: "图片集",
            clazz: "btn-warning",
            handle: function(v) {
                constructionCamera.current = v;
                showMedia(v);
            },
            show: function(v) {
                return btnVisible("media") && v.openAlbum == 1;
            }
        },
        update: {
            name: "编辑",
            clazz: "btn-yellow",
            handle: function(v) {
                edit(v);
            },
            show: function() {
                return btnVisible("update");
            }
        },
        remove: {
            name: "删除",
            clazz: "btn-danger",
            handle: function(v) {
                remove(v);
            },
            show: function() {
                return btnVisible("remove");
            }
        }
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", pageConfig.apiPage || api.construction.pageConstructionCamera);
    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ["construction-orderId", "construction-camera-deviceSerial", "construction-camera-onlineStatus"]);
    searcher.button([{id: "addConstructionCamera", name: "添加", clazz: "btn-primary", icon: "icon-plus"}]);
    searcher.history("constructionCameraPostData");
    searcher.line(function(v) { return v.name || v.orderId; }, lineprops, linebtns).render();

    com.focusPage('a[name="addConstructionCamera"]', '#pagenation').click(function() {
        constructionCamera.editFlg = false;
        clearCameraItems();
        defaults();
        com.focusPage("#cameraModalTitle").text("绑定施工摄像头");
        constructionCamera.items.orderId.removeAttr("readonly");
        constructionCamera.items.deviceSerial.removeAttr("readonly");
        constructionCamera.items.channelNo.removeAttr("readonly");
        constructionCamera.items.provider.removeAttr("disabled");
        constructionCamera.modals.cameraModal.modal("show");
    });

    function defaults() {
        constructionCamera.items.channelNo.val("1");
        constructionCamera.items.provider.val("ys7");
        constructionCamera.items.openLive.val("1");
        constructionCamera.items.openCapture.val("1");
        constructionCamera.items.openAlbum.val("1");
        constructionCamera.items.openPlayback.val("0");
        constructionCamera.items.visibleStart.val("08:00:00");
        constructionCamera.items.visibleEnd.val("18:00:00");
        constructionCamera.items.mediaCount.val("20");
        constructionCamera.items.liveProtocol.val("ezopen");
    }

    function clearCameraItems() {
        constructionCamera.items.ccid.val("");
        constructionCamera.items.orderId.val("");
        constructionCamera.items.deviceSerial.val("");
        constructionCamera.items.channelNo.val("");
        constructionCamera.items.name.val("");
        constructionCamera.items.verifyCode.val("");
        constructionCamera.items.provider.removeAttr("disabled");
        constructionCamera.items.orderId.removeAttr("readonly");
        constructionCamera.items.deviceSerial.removeAttr("readonly");
        constructionCamera.items.channelNo.removeAttr("readonly");
    }

    function edit(v) {
        constructionCamera.editFlg = true;
        constructionCamera.current = v;

        clearCameraItems();
        defaults();

        com.focusPage("#cameraModalTitle").text("编辑施工摄像头");
        constructionCamera.items.ccid.val(v.ccid);
        constructionCamera.items.orderId.val(v.orderId).attr("readonly", "readonly");
        constructionCamera.items.deviceSerial.val(v.deviceSerial).attr("readonly", "readonly");
        constructionCamera.items.channelNo.val(v.channelNo).attr("readonly", "readonly");
        constructionCamera.items.provider.val(v.provider).attr("disabled", "disabled");
        constructionCamera.items.name.val(v.name || "");
        constructionCamera.items.visibleStart.val(v.visibleStart || "08:00:00");
        constructionCamera.items.visibleEnd.val(v.visibleEnd || "18:00:00");
        constructionCamera.items.openLive.val(v.openLive);
        constructionCamera.items.openCapture.val(v.openCapture);
        constructionCamera.items.openAlbum.val(v.openAlbum);
        constructionCamera.items.openPlayback.val(v.openPlayback);

        constructionCamera.modals.cameraModal.modal("show");
    }

    function saveCamera() {
        if (com.validate("cameraModal")) return false;

        var options = {
            "constructionCamera.name": constructionCamera.items.name.val(),
            "constructionCamera.visibleStart": shortTime(constructionCamera.items.visibleStart.val()),
            "constructionCamera.visibleEnd": shortTime(constructionCamera.items.visibleEnd.val()),
            "constructionCamera.openLive": constructionCamera.items.openLive.val(),
            "constructionCamera.openCapture": constructionCamera.items.openCapture.val(),
            "constructionCamera.openAlbum": constructionCamera.items.openAlbum.val(),
            "constructionCamera.openPlayback": constructionCamera.items.openPlayback.val()
        };

        if (constructionCamera.items.verifyCode.val()) options["constructionCamera.verifyCode"] = constructionCamera.items.verifyCode.val();

        if (constructionCamera.editFlg) {
            options["constructionCamera.ccid"] = constructionCamera.items.ccid.val();

            com.post(api.construction.updateConstructionCamera, options, function() {
                com.post(api.construction.updateConstructionCameraForVisible, options, function() {
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
        } else {
            options["constructionCamera.orderId"] = constructionCamera.items.orderId.val();
            options["constructionCamera.deviceSerial"] = constructionCamera.items.deviceSerial.val();
            options["constructionCamera.channelNo"] = constructionCamera.items.channelNo.val() || 1;
            options["constructionCamera.provider"] = constructionCamera.items.provider.val() || "ys7";

            com.post(api.construction.addConstructionCamera, options, function() {
                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        }

        constructionCamera.modals.cameraModal.modal("hide");
    }

    function showLive(v) {
        resetLivePlayer(true);
        constructionCamera.modals.liveModal.modal("show");
        loadLive();
    }

    function loadLive() {
        if (!constructionCamera.current) return false;

        com.post(api.construction.queryConstructionCameraLiveUrl, {
            "constructionCamera.ccid": constructionCamera.current.ccid,
            "protocol": constructionCamera.items.liveProtocol.val() || "ezopen"
        }, function(res) {
            renderLive(res.constructionCameraLive || {});
        });
    }

    function renderLive(live) {
        var url = live.url || "";

        resetLivePlayer(false);

        constructionCamera.items.liveUrl.val(url);
        constructionCamera.items.openLiveUrl.attr("href", url || "javascript:void(0);");

        if (constructionCamera.items.liveProtocol.val() == "ezopen" && live.ezopenUrl && live.accessToken) {
            playEzopenLive(live);
            return;
        }

        if (!url) {
            liveStatus("暂无直播地址");
            return;
        }

        var type = liveType(url);

        if (type == "native") {
            playNativeLive(url);
            return;
        }

        if (type == "hls") {
            playHlsLive(url);
            return;
        }

        playByYs7(url, type);
    }

    function playNativeLive(url) {
        var video = constructionCamera.items.liveVideo.get(0);
        var play;

        liveStatus("正在加载直播");
        video.oncanplay = function() {
            liveStatus("");
        };
        video.onerror = function() {
            liveStatus("浏览器不能直接播放该直播地址, 请切换为萤石播放方式");
        };
        video.src = url;
        video.load();

        if (video.play) {
            play = video.play();

            if (play && play.catch) {
                play.catch(function() {
                    liveStatus("浏览器未自动播放, 请点击播放器播放");
                });
            }
        }
    }

    function playByYs7(url, type) {
        var video = constructionCamera.items.liveVideo.get(0);
        var Player = getYs7Player();

        liveStatus(liveTypeText(type) + "需要萤石播放器, 正在加载");
        video.src = url;
        video.load();

        if (Player) {
            initYs7Player(Player);
            return;
        }

        loadYs7Player(function(loaded) {
            Player = getYs7Player();

            if (!loaded || !Player) {
                liveStatus(liveTypeText(type) + "不能直接使用浏览器 video 播放, 萤石播放器加载失败");
                return;
            }

            initYs7Player(Player);
        });
    }

    function playHlsLive(url) {
        var video = constructionCamera.items.liveVideo.get(0);

        liveStatus("HLS地址需要播放器解析, 正在加载");

        loadHlsPlayer(function(loaded) {
            if (!loaded || !window.Hls || !window.Hls.isSupported()) {
                playByYs7(url, "hls");
                return;
            }

            constructionCamera.liveHlsObj = new Hls({defaultAudioCodec: "mp4a.40.2"});
            constructionCamera.liveHlsObj.loadSource(url);
            constructionCamera.liveHlsObj.attachMedia(video);
            constructionCamera.liveHlsObj.on(Hls.Events.MANIFEST_PARSED, function() {
                liveStatus("");
                if (video.play) video.play();
            });
            constructionCamera.liveHlsObj.on(Hls.Events.ERROR, function(event, data) {
                if (data && data.fatal) liveStatus("HLS播放失败(设备可能为H.265编码), 请切换萤石播放器后重试");
            });
        });
    }

    function playEzopenLive(live) {
        liveStatus("正在加载萤石播放器");

        loadEzuikitPlayer(function(loaded) {
            if (!loaded) {
                liveStatus("萤石播放器加载失败");
                return;
            }

            try {
                constructionCamera.items.liveVideo.hide();
                constructionCamera.items.livePlayerBox.show();

                var width = Math.floor(constructionCamera.items.livePlayerBox.width()) || 870;

                constructionCamera.livePlayerObj = new EZUIKit.EZUIKitPlayer({
                    id: "livePlayerBox",
                    accessToken: live.accessToken,
                    url: live.ezopenUrl,
                    template: "simple",
                    width: width,
                    height: 420,
                    handleError: function(e) {
                        liveStatus("萤石播放器提示: " + ((e && (e.msg || e.retmsg || e.message)) || "播放异常"));
                    }
                });

                liveStatus("萤石播放器播放中");
            } catch (e) {
                liveStatus("萤石播放器初始化失败: " + (e && e.message ? e.message : ""));
            }
        });
    }

    function loadEzuikitPlayer(callback) {
        if (window.EZUIKit && window.EZUIKit.EZUIKitPlayer) {
            callback(true);
            return;
        }

        constructionCamera.liveEzuikitCallbacks.push(callback);

        if (constructionCamera.liveEzuikitLoading) return;

        constructionCamera.liveEzuikitLoading = true;

        loadEzuikitScript(0);
    }

    function loadEzuikitScript(index) {
        if (index >= constructionCamera.liveEzuikitScripts.length) {
            notifyEzuikitPlayer(false);
            return;
        }

        var done = false;
        var script = document.createElement("script");
        script.src = constructionCamera.liveEzuikitScripts[index];

        var timer = setTimeout(function() {
            if (done) return;
            done = true;
            loadEzuikitScript(index + 1);
        }, 10000);

        script.onload = function() {
            if (done) return;
            done = true;
            clearTimeout(timer);

            if (window.EZUIKit && window.EZUIKit.EZUIKitPlayer) {
                notifyEzuikitPlayer(true);
            } else {
                loadEzuikitScript(index + 1);
            }
        };
        script.onerror = function() {
            if (done) return;
            done = true;
            clearTimeout(timer);
            loadEzuikitScript(index + 1);
        };

        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function notifyEzuikitPlayer(loaded) {
        var callbacks = constructionCamera.liveEzuikitCallbacks;

        constructionCamera.liveEzuikitLoading = false;
        constructionCamera.liveEzuikitCallbacks = [];

        $.each(callbacks, function(i, callback) {
            callback(loaded);
        });
    }

    function initYs7Player(Player) {
        try {
            constructionCamera.livePlayerObj = new Player("liveVideo");
            liveStatus("正在使用萤石播放器加载直播");
        } catch (e) {
            liveStatus(e && e.message ? e.message : "萤石播放器初始化失败");
        }
    }

    function getYs7Player() {
        if (window.EZuikit && window.EZuikit.EZUIPlayer) return window.EZuikit.EZUIPlayer;
        if (window.EZUIPlayer) return window.EZUIPlayer;

        return null;
    }

    function loadYs7Player(callback) {
        if (getYs7Player()) {
            callback(true);
            return;
        }

        constructionCamera.livePlayerCallbacks.push(callback);

        if (constructionCamera.livePlayerLoading) return;

        constructionCamera.livePlayerLoading = true;

        var script = document.createElement("script");
        script.src = constructionCamera.livePlayerScript;
        script.onload = function() {
            notifyYs7Player(true);
        };
        script.onerror = function() {
            notifyYs7Player(false);
        };

        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function notifyYs7Player(loaded) {
        var callbacks = constructionCamera.livePlayerCallbacks;

        constructionCamera.livePlayerLoading = false;
        constructionCamera.livePlayerCallbacks = [];

        $.each(callbacks, function(i, callback) {
            callback(loaded);
        });
    }

    function loadHlsPlayer(callback) {
        if (window.Hls) {
            callback(true);
            return;
        }

        constructionCamera.liveHlsCallbacks.push(callback);

        if (constructionCamera.liveHlsLoading) return;

        constructionCamera.liveHlsLoading = true;

        var script = document.createElement("script");
        script.src = constructionCamera.liveHlsScript;
        script.onload = function() {
            notifyHlsPlayer(true);
        };
        script.onerror = function() {
            notifyHlsPlayer(false);
        };

        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function notifyHlsPlayer(loaded) {
        var callbacks = constructionCamera.liveHlsCallbacks;

        constructionCamera.liveHlsLoading = false;
        constructionCamera.liveHlsCallbacks = [];

        $.each(callbacks, function(i, callback) {
            callback(loaded);
        });
    }

    function liveType(url) {
        var value = (url || "").toLowerCase();
        var video = document.createElement("video");

        if (value.indexOf("ezopen://") == 0) return "ezopen";
        if (value.indexOf("rtmp://") == 0) return "rtmp";
        if (value.indexOf("ws://") == 0 || value.indexOf("wss://") == 0) return "ws";
        if (value.indexOf(".flv") != -1) return "flv";
        if (value.indexOf(".m3u8") != -1) return video.canPlayType("application/vnd.apple.mpegURL") ? "native" : "hls";

        return "native";
    }

    function liveTypeText(type) {
        if (type == "ezopen") return "萤石播放地址";
        if (type == "rtmp") return "RTMP地址";
        if (type == "ws") return "WS地址";
        if (type == "flv") return "FLV地址";
        if (type == "hls") return "HLS地址";

        return "直播地址";
    }

    function resetLivePlayer(clearInfo) {
        if (constructionCamera.livePlayerObj) {
            try {
                if (constructionCamera.livePlayerObj.stop) constructionCamera.livePlayerObj.stop();
                if (constructionCamera.livePlayerObj.destroy) constructionCamera.livePlayerObj.destroy();
            } catch (e) {}
        }

        if (constructionCamera.liveHlsObj) {
            try {
                if (constructionCamera.liveHlsObj.destroy) constructionCamera.liveHlsObj.destroy();
            } catch (e) {}
        }

        constructionCamera.livePlayerObj = null;
        constructionCamera.liveHlsObj = null;
        constructionCamera.items.livePlayer.empty().append($('<video id="liveVideo" style="width: 100%; height: 420px; background: #111; padding: 0;" controls autoplay></video>')).append($('<div id="livePlayerBox" style="width: 100%; height: 420px; background: #111; display: none;"></div>'));
        constructionCamera.items.liveVideo = com.focusPage("#liveVideo");
        constructionCamera.items.livePlayerBox = com.focusPage("#livePlayerBox");
        constructionCamera.items.liveStatus.text("");

        if (clearInfo) {
            constructionCamera.items.liveUrl.val("");
            constructionCamera.items.openLiveUrl.attr("href", "javascript:void(0);");
        }
    }

    function liveStatus(text) {
        constructionCamera.items.liveStatus.text(text || "");
    }

    function capture(v) {
        com.showConfirm("确认抓取当前摄像头画面?", function() {
            com.post(api.construction.captureConstructionCamera, {
                "constructionCamera.ccid": v.ccid,
                "constructionCameraMedia.source": 2,
                "constructionCameraMedia.visible": 1
            }, function(res) {
                var media = res.constructionCameraMedia || {};
                var url = media.mediaUrl || media.coverUrl || media.originUrl || "";

                constructionCamera.items.captureResult.empty();
                if (url) {
                    $('<img />').attr("src", url).css({"max-width": "100%", "max-height": "460px"}).appendTo(constructionCamera.items.captureResult);
                    $('<div></div>').addClass("space-6").appendTo(constructionCamera.items.captureResult);
                    $('<a></a>').addClass("btn btn-sm btn-success").attr("href", url).attr("target", "_blank").text("打开图片").appendTo(constructionCamera.items.captureResult);
                } else {
                    constructionCamera.items.captureResult.text("抓图成功, 暂无可展示地址");
                }

                constructionCamera.modals.captureModal.modal("show");
                searcher.doSearch();
            });
        });
    }

    function showMedia(v) {
        constructionCamera.current = v;
        constructionCamera.medias = [];
        constructionCamera.playIndex = 0;
        constructionCamera.items.mediaStage.empty().append($('<div></div>').css({"padding-top": "190px", "color": "#999"}).text("正在加载图片集"));
        constructionCamera.items.mediaThumbs.empty();
        constructionCamera.modals.mediaModal.modal("show");
        loadMedia();
    }

    function loadMedia() {
        if (!constructionCamera.current) return false;

        pauseMedia();

        var options = {
            "orderId": constructionCamera.current.orderId,
            "constructionCameraPlay.cameraId": constructionCamera.current.ccid,
            "constructionCameraPlay.count": constructionCamera.items.mediaCount.val() || 20
        };

        if (constructionCamera.items.mediaStartTime.val()) options["startTime"] = constructionCamera.items.mediaStartTime.val() + " 00:00:00";
        if (constructionCamera.items.mediaEndTime.val()) options["endTime"] = constructionCamera.items.mediaEndTime.val() + " 23:59:59";

        com.post(api.construction.queryConstructionCameraPlayList, options, function(res) {
            constructionCamera.medias = res.constructionCameraMedias || [];
            constructionCamera.playIndex = 0;
            renderMedias();
        });
    }

    function renderMedias() {
        constructionCamera.items.mediaThumbs.empty();

        if (!constructionCamera.medias.length) {
            constructionCamera.items.mediaStage.empty().append($('<div></div>').css({"padding-top": "190px", "color": "#999"}).text("暂无图片"));
            return;
        }

        $.each(constructionCamera.medias, function(i, media) {
            var url = media.coverUrl || media.mediaUrl || media.originUrl;
            var $li = $('<li></li>').css({"width": "120px", "height": "90px", "overflow": "hidden", "margin": "3px"}).appendTo(constructionCamera.items.mediaThumbs);

            $('<img />').attr("src", url).css({"width": "120px", "height": "90px", "object-fit": "cover", "cursor": "pointer"}).appendTo($li).click(function() {
                constructionCamera.playIndex = i;
                renderStage(i);
            });
        });

        renderStage(0);
    }

    function renderStage(index) {
        var media = constructionCamera.medias[index];
        if (!media) return;

        var url = media.mediaUrl || media.coverUrl || media.originUrl;
        var caption = media.caption || media.captureTime || "";

        constructionCamera.items.mediaStage.empty();
        $('<img />').attr("src", url).css({"max-width": "100%", "max-height": "390px", "margin-top": "10px"}).appendTo(constructionCamera.items.mediaStage);
        $('<div></div>').addClass("text-center grey").css("line-height", "24px").text(caption).appendTo(constructionCamera.items.mediaStage);

        constructionCamera.items.mediaThumbs.find("li").css("border", "0").eq(index).css("border", "2px solid #428bca");
    }

    function playMedia() {
        if (!constructionCamera.medias.length) return false;

        pauseMedia();

        constructionCamera.playTimer = setInterval(function() {
            constructionCamera.playIndex = constructionCamera.playIndex + 1 >= constructionCamera.medias.length ? 0 : constructionCamera.playIndex + 1;
            renderStage(constructionCamera.playIndex);
        }, 2500);
    }

    function pauseMedia() {
        if (constructionCamera.playTimer) {
            clearInterval(constructionCamera.playTimer);
            constructionCamera.playTimer = null;
        }
    }

    function remove(v) {
        com.showConfirm("确认删除该摄像头绑定?", function() {
            com.post(api.construction.deleteConstructionCamera, {
                "constructionCamera.ccid": v.ccid
            }, function() {
                com.showAlert(com.info, "删除成功");
                searcher.doSearch();
            });
        });
    }

    function providerText(value) {
        return value == "ys7" ? "萤石" : value;
    }

    function onlineText(value) {
        if (value == 1) return "在线";
        return "未知";
    }

    function openText(value) {
        return value == 1 ? "开启" : "关闭";
    }

    function shortTime(value) {
        if (!value) return "";
        return value.length >= 5 ? value.substr(0, 5) : value;
    }

});
