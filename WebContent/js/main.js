$(function() {

    params.authentication = window.authentication;
    params.loginTime = window.loginTime;

    $(document).attr('title', config.name + ' ' + config.ename);
    $('#name').text(config.name);

    com.post(api.system.queryModuleForLogin, {
        "module.system": config.system
    }, createMenu);

    $("#versionCode").text(config.versionCode);

    $(".userProfile").attr("href", api.index.userProfile.url + "?timestamp=" + new Date().getTime()).data("level", 1);
    $(".changePassword").attr("href", api.index.changePasswordIndex.url + "?timestamp=" + new Date().getTime()).data("level", 1);
    $(".messageList").attr("href", api.index.messageIndex.url + "?timestamp=" + new Date().getTime()).data("level", 1);

    var setCookie = function(cname, cvalue, minutes) {

        var d = new Date();
        d.setTime(d.getTime() + (minutes * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    $("#logout").on("click", function(e) {

        setCookie("authentication", "", -1);
        window.location.href = '/';
    });

    $(".userProfile").on("click", function(e) {

        $this = $(this);
        // navControl($this);

        e.preventDefault();
        var hrefStr = $this.attr("href");
        if (hrefStr != "#" && hrefStr != "null" && hrefStr != undefined) {
            com.switchPage(hrefStr);
        }
    });

    $(".changePassword").on("click", function(e) {

        $this = $(this);
        // navControl($this);

        e.preventDefault();
        var hrefStr = $this.attr("href");
        if (hrefStr != "#" && hrefStr != "null" && hrefStr != undefined) {
            com.switchPage(hrefStr);
        }
    });

    $(".messageList").on("click", function(e) {

        $this = $(this);
        // navControl($this);

        e.preventDefault();
        var hrefStr = $this.attr("href");
        if (hrefStr != "#" && hrefStr != "null" && hrefStr != undefined) {
            com.switchPage(hrefStr);
        }
        $('.breadcrumb .nav1').empty().append('<i class="icon-envelope"></i>&nbsp;消息查看');
    });

    $('#moreActivity').click(function() {

        params["notice.type"] = "活动";

        com.switchPage(api.index.moreNoticesIndex.url);
    });

    $('#moreNotice').click(function() {

        params["notice.type"] = "通知";

        com.switchPage(api.index.moreNoticesIndex.url);
    });

    $("#versionInfo").on("click", function(e) {

        $('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;版本');
        com.switchPage(api.index.versionIndex.url);
        $('.breadcrumb .nav2').hide();
        $('.breadcrumb .nav3').hide();
    });

    $("#faqInfo").on("click", function(e) {

        $('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;帮助');
        com.switchPage(api.index.faqIndex.url);
        $('.breadcrumb .nav2').hide();
        $('.breadcrumb .nav3').hide();
    });

    com.post(api.personel.queryUserForSelfByUserId, {}, function(res) {

        $(".user-info .user-name").text(res.user.currentName);

        com.showImg($("#personalPic"), res.user.userPhoto, 180, 180, '');
        com.showImg($("#userImg"), res.user.userPhoto, 30, 30, '');

        setWatermark(res.user.currentName, res.user.userId);
    });

    loadNotices();
    loadActivities();
    loadMessageCount();

    // setInterval(function(){
    // loadMessageCount();
    // }, 1800000);

    queryTopInfo('decorationDesignerRank', 'designerName', '设计分区业绩排名');
    loadTopSelf();
});

function queryTopInfo(url, name, info) {

    var url = api.report[url];

    var topTable = $('.top-table').html("");

    $('.nowTopType').html(info);

    com.post(url, {}, function(res) {

        var topList = "";

        $.each(res.ranks, function(i, v) {

            var _name = v[name];
            var _rank = v["rank"];

            var rankImg = '';

            var rankLi = $("<li></li>");
            var rankSpan = $("<span></span>").addClass("topPic").appendTo(rankLi);
            var rankNameSpan = $("<span></span>").addClass("topName").text(_name).appendTo(rankLi);

            if (_rank != null) {
                var rankNameSpan = $("<span></span>").addClass("topValue").text(_rank).appendTo(rankLi);
            }

            if (i == 0) {
                rankLi.addClass('bigger-150 orange');
                $('<i></i>').addClass('icon-trophy').appendTo(rankSpan);
            } else if (i == 1) {
                rankLi.addClass('bigger-120 blue');
                $('<i></i>').addClass('icon-trophy').appendTo(rankSpan);
            } else if (i == 2) {
                rankLi.addClass('bigger-120 blue');
                $('<i></i>').addClass('icon-trophy').appendTo(rankSpan);
            }

            rankLi.appendTo(topTable);
        });
    });
}

function reloadPage() {

    isF5 = true;
    location.reload(true);
    // window.location.href="index.do?timestamp="+new Date().getTime();
}

function loadTopSelf(opts) {

    com.post(api.report.queryRankForPlace, opts, function(res) {

        $("#decorationPlace").text(res.decorationPlace);
        $("#decorationRank").text(res.decorationRank);
        $("#materialPlace").text(res.materialPlace);
        $("#materialRank").text(res.materialRank);
        $("#zaterialPlace").text(res.zaterialPlace);
        $("#zaterialRank").text(res.zaterialRank);
    });
}

function loadNotices() {

    var options = {
        "paging.rows": 5,
        "paging.page": 1,
        "notice.type": "通知",
    }

    com.post(api.information.pageNoticeForSeenByType, options, function(res) {

        $("#noticeList").empty();
        $.each(res.paging.data, function(i, v) {

            getNoticeDOM(v).appendTo($("#noticeList"));
        });
    });
}

function loadActivities() {

    var options = {
        "paging.rows": 5,
        "paging.page": 1,
        "notice.type": "活动",
    }

    com.post(api.information.pageNoticeForSeenByType, options, function(res) {

        $("#activityList").empty();
        $.each(res.paging.data, function(i, v) {

            getNoticeDOM(v).appendTo($("#activityList"));
        });
    });
}

function getNoticeDOM(notice) {

    var $wrap = $('<div class="alert alert-info clearfix" style="padding:5px 12px;"></div>');
    var $title = $('<div><i class="icon-hand-right green"></i></div>');
    var $theme = $('<strong style="margin-left:7px;">' + notice.theme + ' </strong>').appendTo($title);

    var priorityStyle = "label-warning";

    $('<small class="detail" style="cursor:pointer">  [详细]</small>').on(ace.click_event, function() {

        $.gritter.add({
            title: notice.theme,
            text: notice.contents,
            class_name: 'gritter-info gritter-center'
        });

        return false;
    }).appendTo($theme);

    if (notice.priority == "紧急") {
        priorityStyle = "label-danger";
    } else if (notice.priority == "重要") {
        priorityStyle = "label-warning";
    } else if (notice.priority == "标准") {
        priorityStyle = "label-yellow";
    }

    $('<span class="label arrowed-in pull-right" style="line-height: 17px;">' + notice.priority + '</span>').addClass(priorityStyle).appendTo($title);
    var $contents = $('<div class="col-xs-12"><div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;margin-right:50px;">' + notice.contentsText + '</div><abbr title="' + notice.contentsText + '"></abbr></div>');
    var $bottomInfo = $('<small><div class="pull-right"><span><i class="icon-time bigger-110"></i>&nbsp;' + notice.startTime + ' 至 ' + notice.endTime + '</span>&nbsp;&nbsp;<span><i class="icon-user bigger-110"></i>&nbsp;' + notice.user.userName + '</span>&nbsp;&nbsp;</div></small>');
    if (notice.filePath != undefined && notice.filePath != null && notice.filePath != "") {
        $(".pull-right", $bottomInfo).append('<span><i class="icon-download-alt bigger-110"></i>&nbsp;<a href=' + config.media + notice.filePath + "?t=" + new Date().getTime() + ' onclick="window.open(this.href); return false;">下载附件</a></span>');
    }

    $wrap.append($title).append($contents).append($bottomInfo);

    return $wrap;
}

function loadMessageCount() {

    com.post(api.information.countMessage, {}, function(res) {

        if (res.messageCount == 0) {
            $("#messageCount").remove();
        } else {
            if ($("#messageCount").length == 0) {
                $("#messageBtn").append("<span id='messageCount' class='badge badge-pink'>" + res.messageCount + "</span>");
            } else {
                $("#messageCount").text(res.messageCount);
            }
        }
    }, function(res) {

    });
}

function createMenu(data) {

    var menuArr = {
        level1: [],
        level2: [],
        level3: [],
    };

    var menuObj = {
        level1: {},
        level2: {},
    }
    var treeData = data.modules;
    var $tree = $("ul.nav-list");
    var $main = $('<li class="active"><a href="#" onclick="reloadPage();"><i class="icon-home"></i><span class="menu-text">首页</span></a></li>');
    var arr;
    $tree.append($main);

    if (!treeData || !treeData.length) {
        return;
    }

    $.each(treeData, function(i, v) {

        arr = menuArr['level' + v.level]
        arr[arr.length] = v;
    });

    $.each(menuArr, function(key, val) {

        menuArr[key] = val.sort(function(a, b) {

            return a.order - b.order
        });
    });

    if (menuArr.level1.length) {
        $.each(menuArr.level1, function(i, v) {

            var $li = $('<li></li>');
            var $a = $('<a href="#"></a>');
            var $i = $('<i></i>').addClass(v.icon);
            var $span = $('<span></span>').addClass('menu-text').text(v.name);
            $a.append($i).append($span).appendTo($li);
            menuObj.level1[v.mid] = $li;
            $li.appendTo($tree);
        });
    }

    if (menuArr.level2.length) {
        $.each(menuArr.level2, function(i, v) {

            var $li = $('<li></li>');
            var $a = $('<a></a>').attr('href', v.url ? v.url : '#');
            var $i = $('<i></i>').addClass(v.icon);
            var $span = $('<span></span>').addClass('menu-text').text(v.name);
            $a.append($i).append($span).appendTo($li);
            menuObj.level2[v.mid] = $li;

            var $parent = menuObj.level1[v.fatherModule.mid];
            $parent.children('a').children('b').length || $('<b></b>').addClass('arrow icon-angle-down').appendTo($parent.children('a'));
            var $pul = $parent.children('ul').length ? $parent.children('ul') : $('<ul></ul>').addClass('submenu').appendTo($parent);
            $li.appendTo($pul);
        });
    }

    if (menuArr.level3.length) {
        $.each(menuArr.level3, function(i, v) {

            var $li = $('<li></li>');
            var $a = $('<a></a>').attr('href', v.url ? v.url : '#');
            var $i = $('<i></i>').addClass(v.icon);
            var $span = $('<span></span>').addClass('menu-text').text(v.name);
            $a.append($i).append($span).appendTo($li);

            var $parent = menuObj.level2[v.fatherModule.mid];
            $parent.children('a').children('b').length || $('<b></b>').addClass('arrow icon-angle-down').appendTo($parent.children('a'));
            var $pul = $parent.children('ul').length ? $parent.children('ul') : $('<ul></ul>').addClass('submenu').appendTo($parent);
            $li.appendTo($pul);
        });
    }

    $("a", $tree).on("click", function(e) {

        $this = $(this);
        // navControl($this);

        var hrefStr = $this.attr("href");

        if ($this.siblings('ul').length) {
            if (!$this.parent('li').hasClass('active')) {
                $this.parent('li').toggleClass('open');
                $this.parent('li').siblings('li').not('.active').removeClass('open');
            }
        } else {
            if (hrefStr != "#" && hrefStr != "null" && hrefStr != undefined) {
                com.switchPage(hrefStr);
                $('.active').not($this.parents('li')).removeClass('active').removeClass('open');
                $this.parent('li').addClass('active');
                $this.parents('.nav-list > li').addClass('active');
            }
        }

        e.preventDefault();
    });

}

function setWatermark(userName, userId) {

    // 用 canvas 画水印再 toDataURL('image/png'),替代 SVG Data URI。
    // PNG Data URI 浏览器兼容性远好于 SVG(IE9+/所有 win7 浏览器),
    // 且字体回退由 canvas 原生处理,规避 SVG <text> 在 win7 上中文乱码/不渲染的问题。
    var text = userName;
    if (userId) {
        text += ' ' + userId;
    }

    var style = window.templateStyle || 'ace';
    var dark = (style === 'dark' || style === 'metro');

    var canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 140;
    var ctx = canvas.getContext('2d');

    // win7 上 Microsoft Yahei 不一定可用,回退到 SimSun(宋体),与后端 WMCodeUtil 保持一致。
    ctx.font = '16px "Microsoft Yahei", "Microsoft YaHei", SimSun, sans-serif';
    ctx.textAlign = 'center';
    ctx.translate(120, 70);
    ctx.rotate(-25 * Math.PI / 180);

    // rgba 半透明颜色:亮色模板用黑,深色模板用白,平铺不叠加变深。
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.fillText(text, 0, 0);

    var dataUri;
    try {
        dataUri = canvas.toDataURL('image/png');
    } catch (e) {
        return;
    }

    var applyWatermark = function() {
        $('.watermark-overlay').remove();
        $('<div class="watermark-overlay"></div>').css({
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'width': '100%',
            'height': '100%',
            'pointer-events': 'none',
            'z-index': 9999,
            'background-image': 'url(' + dataUri + ')',
            'background-repeat': 'repeat'
        }).appendTo('body');
    };

    applyWatermark();

    // 防删除:用户在控制台 .remove() 掉水印后立即重建。
    if (window.MutationObserver) {
        var mo = new MutationObserver(function(records) {
            var removed = false;
            for (var i = 0; i < records.length; i++) {
                for (var j = 0; j < records[i].removedNodes.length; j++) {
                    if (records[i].removedNodes[j] &&
                        records[i].removedNodes[j].className === 'watermark-overlay') {
                        removed = true;
                    }
                }
            }
            if (removed && $('.watermark-overlay').length === 0) {
                applyWatermark();
            }
        });
        mo.observe(document.body, { childList: true });
    }
}
