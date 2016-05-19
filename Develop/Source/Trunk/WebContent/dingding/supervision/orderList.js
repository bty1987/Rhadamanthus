var OrderList = (function(){

    var getUrlParams = function(){
        var url = location.search;

        var theRequest = new Object();
        url && (url = decodeURI(url));
        if (url.indexOf("?") != -1) {
            strs = url.substr(1).split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    };

    var paging = {
        loading : false,
        searchParam : {},
        page : {
            page : 1,
            rows : 10,
            totalPage : 0,
            totalRecords : 0
        },
        getData : function(params, callBack){
            $('.infinite-scroll-preloader').show();

            var that = this;
            // 如果正在加载，则退出
            if (that.loading) return;
            that.loading = true;
            $.ajax({
                type: 'POST',
                url: config.serverHost + "pageDecorationOrderForSupervisionByUserId.do?timestamp=" + new Date().getTime(),
                data: params,
                async: false,
                dataType : "json",
                success: function(res){
                    that.loading = false;
                    paging.page.page = res.paging.page;

                    paging.page.rows = res.paging.rows;
                    paging.page.totalPage = res.paging.totalPage;
                    paging.page.totalRecords = res.paging.totalRecords;

                    $('.infinite-scroll-preloader').hide();

                    callBack(res.paging.data);

                },error: function (xhr, errorType, error) {
                    $.alert("错误" + error + errorType);
                }

            });
        }

    };

    var painter = {
        renderList : function(list){
            var that = this;
            $.each(list, function(i, v){
                var $line = that.drawLine(v);
                $('.infinite-scroll .list-container').append($line);
            });
        },
        drawLine : function(v){
            var $a, $h4, $p;
            var href = "orderDetail.html?authentication=" + paging.searchParam.authentication;
            var replaceStr = "#";
            href += '&orderId=' + v.orderId;
            href += '&addr=' + v.village.cityProper.cityProperName + v.village.villageName + " "+ v.houseNumber;
            href += '&designer=' + v.designer;
            href += '&designerPhone=' + (v.designerPhone ? v.designerPhone : "---" );
            href += '&salesman=' + v.salesman;
            href += '&salesmanPhone=' + (v.salesmanPhone ? v.salesmanPhone : "---");
            href = encodeURI(href);
            href = href.replace(new RegExp(replaceStr,'gm'),'%23')

            $a = $('<a></a>').addClass('weui_media_box weui_media_text').attr('href', href);
            $h4 = $('<h4></h4>').addClass('weui_media_title arrow-r').text('订单编号' + v.orderId);
            $p = $('<p></p>').addClass('weui_media_desc').text( v.village.cityProper.cityProperName + v.village.villageName + " "+ v.houseNumber);
            $a.append($h4).append($p);

            return $a;

        }
    };

    return {
        init : function(){



            paging.searchParam = getUrlParams();
            paging.getData($.extend(true, {}, paging.searchParam, {"paging.page": 1,"paging.rows" : paging.page.rows}), function(list){
                list.length ? painter.renderList(list) :($.alert('未找到订单'),
                        // 加载完毕，则注销无限加载事件，以防不必要的加载
                        $.detachInfiniteScroll($('.infinite-scroll')),
                        // 删除加载提示符
                        $('.infinite-scroll-preloader').remove()
                ) ;
            })
        },
        getList : function(){
            var page = parseInt(paging.page.page) == parseInt(paging.page.totalPage) ? null : parseInt(paging.page.page) + 1;
            page ? paging.getData($.extend(true, {}, paging.searchParam, {"paging.page": page,"paging.rows" : paging.page.rows}), function(list){

                list.length ? (painter.renderList(list),$.refreshScroller()): $.alert('未找到订单');
            }) :(
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    $.detachInfiniteScroll($('.infinite-scroll'))
                    // 删除加载提示符
                    //$('.infinite-scroll-preloader').remove(),
            );
        }
    };

})();


$(function () {

    OrderList.init();


    //无限滚动
    $(document).on("pageInit", "#page-infinite-scroll-bottom", function(e, id, page) {

        $(page).on('infinite', function() {

            OrderList.getList();

        });
    });

    $.init();


    // .container 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
    // 相关 issue: https://github.com/weui/weui/issues/15
    // 解决方法:
    // 0. .container 去掉 overflow 属性, 但此 demo 下会引发别的问题
    // 1. 参考 http://stackoverflow.com/questions/23757345/android-does-not-correctly-scroll-on-input-focus-if-not-body-element
    //    Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
    if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
    }

});