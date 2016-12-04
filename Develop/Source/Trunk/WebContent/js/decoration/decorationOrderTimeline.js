/**
 * Created by Administrator on 2016/11/15.
 */

$(function(){

    var order = {
        oid : params.decorationOrderId,
        $pic : {
            $picList : $('#orderpics')
        }
    };

    $('#oid').text(order.oid);

    var initPhotoSwipeFromDOM = function(gallerySelector) {

        // parse slide data (url, title, size ...) from DOM elements
        // (children of gallerySelector)
        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item;

            for(var i = 0; i < numNodes; i++) {

                figureEl = thumbElements[i]; // <figure> element

                // include only element nodes
                if(figureEl.nodeType !== 1) {
                    continue;
                }

                linkEl = figureEl.children[0]; // <a> element

                size = linkEl.getAttribute('data-size').split('x');

                // create slide object
                item = {
                    src: linkEl.getAttribute('imgpath'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };

                if(figureEl.children.length > 1) {
                    // <figcaption> content
                    item.title = figureEl.children[1].innerHTML;
                }

                if(linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute('src');
                }

                item.el = figureEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }

            return items;
        };

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && ( fn(el) ? el : closest(el.parentNode, fn) );
        };

        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            // find root element of slide
            var clickedListItem = closest(eTarget, function(el) {
                return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
            });

            if(!clickedListItem) {
                return;
            }

            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            var clickedGallery = clickedListItem.parentNode,
                childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;

            for (var i = 0; i < numChildNodes; i++) {
                if(childNodes[i].nodeType !== 1) {
                    continue;
                }

                if(childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }

            if(index >= 0) {
                // open PhotoSwipe if valid index found
                openPhotoSwipe( index, clickedGallery );
            }
            return false;
        };

        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
                params = {};

            if(hash.length < 5) {
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if(pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }

            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

            items = parseThumbnailElements(galleryElement);

            // define options (if needed)
            options = {
                history:false,

                // define gallery index (for URL)
                //galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                getThumbBoundsFn: function(index) {
                    // See Options -> getThumbBoundsFn section of documentation for more info
                    var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect();

                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                }
            };

            // PhotoSwipe opened from URL
            if(fromURL) {
                if(options.galleryPIDs) {
                    // parse real index when custom PIDs are used
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }

            // exit if index not found
            if( isNaN(options.index) ) {
                return;
            }

            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll( gallerySelector );

        for(var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].onclick = onThumbnailsClick;
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        /*var hashData = photoswipeParseHash();
         if(hashData.pid && hashData.gid) {
         openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
         }*/
    };

    $('.widget-box').addClass('flloading');
    $('.widget-box', '#orderId').removeClass('flloading');

//    获取订单基本信息
    com.post(api.decoration.queryDecorationOrderForDesignerByOrderId, {"decorationOrder.orderId": order.oid}, function(req){
        var $info = $('#baseinfo');

        var decorationOrder = req.decorationOrder;

        $('[name="uname"]',$info).text(decorationOrder.customer.customerName);
        $('[name="addr"]',$info).text(decorationOrder.village.villageName+' '+decorationOrder.houseNumber);
        $('[name="dname"]',$info).text(decorationOrder.designer);
        $('[name="dphone"]',$info).text(decorationOrder.designerPhone|| '');
        $('[name="sname"]',$info).text(decorationOrder.salesman);
        $('[name="sphone"]',$info).text(decorationOrder.designerPhone|| '');
        $('[name="status"]',$info).text(decorationOrder.status);

        $('.widget-box', '#baseinfo').removeClass('flloading');
    });

//    获取图纸信息
    com.post(api.decoration.queryDecorationPictureByOrderId, {"decorationPicture.orderId": order.oid}, function(res){
        var pics = res.decorationPictures;

        if(pics.length){
            $.each(pics, function(i, v){
                if(v.type == 1 || v.type == 2){
                    var path = {
                        url1 : config.media + api.common.showImg.url + '?imgBasePath=' + v.path + '&divFlag=1&width=50&height=50',
                        url2: config.media + api.common.showImg.url + '?imgBasePath=' + v.path + '&divFlag=1&width=600&height=600'
                    };
                    var $pic = createPic(path, v.uploadTime,'700x700');

                    $pic.appendTo(v.type == 1 ? $('[name="effect"]',order.$pic.$picList) : $('[name="project"]',order.$pic.$picList));
                }

            });

            initPhotoSwipeFromDOM('#orderpics [name="effect"]');
            initPhotoSwipeFromDOM('#orderpics [name="project"]');
            order.$pic.$picList.find('.widget-box').removeClass('flloading');
        }
    });

    //获取款项信息
    com.post(api.payment.queryDecorationPaymentByOrderId, {"decorationPayment.orderId": order.oid}, function(res){
        var decorationPayments = res.decorationPayments;

        if(decorationPayments.length){
            $.each(decorationPayments, function(i, v){
                var $li = createPayment(v, i);
                $li.appendTo('[name="list"]', '#payment');
            });
            $('.widget-box', '#payment').removeClass('flloading');
        }
    }, null, false);

    //铲大白
    getProjectInfo(
        api.construction.queryChanConstructionScheduleByOrderId,
        "chanConstructionSchedule.orderId",
        'chanConstructionSchedule',
        null, null, null,null,
        api.construction.queryChanDrawingByCsId, 'chanDrawing.csId', 'csId','chanDrawings',
        'cdb'
    );

    //放线
    getProjectInfo(
        api.construction.queryPutlineConstructionScheduleByOrderId,
        "putlineConstructionSchedule.orderId",
        'putlineConstructionSchedule',
        null, null, null,null,
        api.construction.queryPutlineDrawingByCsId, 'putlineDrawing.csId', 'csId','putlineDrawings',
        'fx'
    );

    //水力电
    getProjectInfo(
        api.construction.queryWaterwayCircuitPowerConstructionScheduleByOrderId,
        "waterwayCircuitPowerConstructionSchedule.orderId",
        'waterwayCircuitPowerConstructionSchedule',
        api.construction.queryWaterwayCircuitPowerConstructionScheduleWorker, 'waterwayCircuitPowerConstructionSchedule.wcpcsId', 'wcpcsId','constructionScheduleWorkers',
        api.construction.queryWaterwayCircuitPowerDrawingByCsId, 'waterwayCircuitPowerDrawing.csId', 'csId','waterwayCircuitPowerDrawings',
        'project'
    );

    //瓦工
    getProjectInfo(
        api.construction.queryBricklayConstructionScheduleByOrderId,
        "bricklayConstructionSchedule.orderId",
        'bricklayConstructionSchedule',
        api.construction.queryBricklayConstructionScheduleWorker, 'bricklayConstructionSchedule.bcsId', 'bcsId','constructionScheduleWorkers',
        api.construction.queryBricklayDrawingByCsId, 'bricklayDrawing.csId', 'csId','bricklayDrawings',
        'wg'
    );

    //地面找平
    getProjectInfo(
        api.construction.queryGroundLevelingConstructionScheduleByOrderId,
        "groundLevelingConstructionSchedule.orderId",
        'groundLevelingConstructionSchedule',
        api.construction.queryGroundLevelingConstructionScheduleWorker, 'groundLevelingConstructionSchedule.glcsId', 'glcsId','constructionScheduleWorkers',
        api.construction.queryGroundLevelingDrawingByCsId, 'groundLevelingDrawing.csId', 'csId','groundLevelingDrawings',
        'dmzp'
    );

    // 木工
    getProjectInfo(
        api.construction.queryCarpentConstructionScheduleByOrderId,
        "carpentConstructionSchedule.orderId",
        'carpentConstructionSchedule',
        api.construction.queryCarpentConstructionScheduleWorker, 'carpentConstructionSchedule.ccsId', 'ccsId','constructionScheduleWorkers',
        api.construction.queryCarpentDrawingByCsId, 'carpentDrawing.csId', 'csId','carpentDrawings',
        'mg'
    );

    // 油工
    getProjectInfo(
        api.construction.queryOilConstructionScheduleByOrderId,
        "oilConstructionSchedule.orderId",
        'oilConstructionSchedule',
        api.construction.queryOilConstructionScheduleWorker, 'oilConstructionSchedule.ocsId', 'ocsId','constructionScheduleWorkers',
        api.construction.queryOilDrawingByCsId, 'oilDrawing.csId', 'csId','oilDrawings',
        'yg'
    );

    // 水电安装
    getProjectInfo(
        api.construction.queryWaterwayCircuitCheckConstructionScheduleByOrderId,
        "waterwayCircuitCheckConstructionSchedule.orderId",
        'waterwayCircuitCheckConstructionSchedule',
        api.construction.queryWaterwayCircuitCheckConstructionScheduleWorker, 'waterwayCircuitPowerConstructionSchedule.wcpcsId', 'wcpcsId','constructionScheduleWorkers',
        api.construction.queryWaterwayCircuitCheckDrawingByCsId, 'waterwayCircuitCheckDrawing.csId', 'csId','waterwayCircuitPowerDrawings',
        'sdaz'
    );

    // 保洁
    getProjectInfo(
        api.construction.queryCleaningConstructionScheduleByOrderId,
        "cleaningConstructionSchedule.orderId",
        'cleaningConstructionSchedule',
        api.construction.queryCleaningConstructionScheduleWorker, 'cleaningConstructionSchedule.ccsId', 'ccsId','constructionScheduleWorkers',
        api.construction.queryCleaningDrawingByCsId, 'cleaningDrawing.csId', 'csId','cleaningDrawings',
        'bj'
    );


    //
    /**
     *获取施工信息的方法
     * @orderApi 根据订单编号获取信息的接口
     * @orderParamName 根据订单编号获取信息的接口的参数名
     * @orderRes 根据订单编号获取信息的接口返回值取值
     *
     * @workerApi 获取工人信息接口
     * @workerParamName 工人接口参数名
     * @workerParamValueName 工人接口参数值
     * @workerRes 工人接口返回值
     *
     * @workerApi 获取图片信息接口
     * @workerParamName 图片接口参数名
     * @workerParamValueName 图片接口参数值
     * @workerRes 图片接口返回值
     *
     * @domid html页面上的标签id
     */
    function getProjectInfo(orderApi, orderParamName, orderRes,
                            workerApi, workerParamName, workerParamValueName,workerRes,
                            picApi, picParamName, picParamValueName,picRes,
                            domid
    ){
        var params = {};
        params[orderParamName] = order.oid;

        com.post(orderApi, params, function(res){

            var info = res[orderRes], wokerDfd, picDfd, params;

            //工人 v.workerPhoto v.workerPhone v.workerName
            if(workerApi){
                if(info[workerParamValueName]){
                    params = {};
                    params[workerParamName] = info[workerParamValueName];
                    com.post(workerApi, params, function(res){
                        var workers = res[workerRes];
                        if(workers && workers.length){

                            $.each(workers, function(i, v){
                                var $worker = createWoker(v);
                                $('[name="workers"]','#'+domid).append($worker);
                            });
                        }else{
                            $('[name="workers"]','#'+domid).append('<div class="alert alert-info">当前进度没有分配工人!</div>');
                        }
                    }, null, false);
                }

            }else{
                var $worker = createWoker(info);
                $('[name="workers"]','#'+domid).append($worker);
            }

            //图片
            if(info[picParamValueName]){
                params = {};
                params[picParamName] = info[picParamValueName];
                com.post(picApi, params, function(res){
                    //图片
                    var pics = res[picRes];

                    if(pics.length){
                        $.each(pics, function(i, v){

                            var path = {};
                            var _type = v.type;
                            var _url = _url2 = v.drawingUrl;

                            if(_type == 0){
                                path = {
                                    url1 : config.media + '/showImg.do' + '?imgBasePath='+ _url +'&divFlag=1&width=50&height=50&timestamp='+ new Date().getTime(),
                                    url2 : config.media + '/showImg.do' + '?imgBasePath='+ _url2 +'&divFlag=1&width=600&height=600&timestamp='+ new Date().getTime()
                                };
                            }
                            if(_type == 1){
                                path = {
                                    url1 : config.dmedia + _url + '_50x50.jpg',
                                    url2 : config.dmedia + _url2 + '_600x600.jpg'
                                };
                            }

                            var $pic = createPic(path, null,'700x700');

                            $('[name="project"]','#'+domid).append($pic);
                        });

                        initPhotoSwipeFromDOM('#'+domid +' [name="project"]');

                    }else{
                        $('[name="project"]','#'+domid).append('<div class="alert alert-info">当前进度没有施工进度图片!</div>');
                    }
                }, null, false);
            }

            if(!info[workerParamValueName] && !info[picParamValueName]){
                $('.widget-main', '#'+domid).empty().append('<div class="alert alert-info">当前没有施工信息!</div>');
            }

            $('.widget-box', '#'+domid ).removeClass('flloading');
        }, null, false);
    }

    function createPic(path, des, size){

        var $pic = $('<figure></figure>').attr({'itemprop':'associatedMedia','itemscope': ''});
        var $wrap = $('<div></div>').addClass('wrap').attr({'itemprop': 'contentUrl', 'data-size': size});
        var $img = $('<img>').attr({'itemprop' : "thumbnail"});
        var $figcaption = $('<figcaption></figcaption>').attr({'itemprop': 'caption description'});

        var _url, _url2;

        _url = path.url1;
        _url2 = path.url2;

        $wrap.attr('imgpath', _url2);
        $img.attr('src', _url);
        $figcaption.text(des || ' ');

        $wrap.append($img);
        $pic.append($wrap).append($figcaption);

        return $pic;
    }

    function createPayment(v, i){

        var colorArr = ['orange','green', 'blue', 'pink', 'purple','red','brown','default','blue3'];
        var $liLine = $('<li>').addClass('item-orange').addClass('clearfix item-'+ colorArr[i%colorArr.length]);

        var $h5 = $('<h5></h5>').addClass('oid').text(v.paymentType);

        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

        var propertyArr = [
            ["金额:", v.realMoney, "grey"],
            ["状态:", v.paymentStatus, "grey"],
        ];

        $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        $liLine.append($h5).append($ulProperty);

        return $liLine;
    }

    function createWoker(v){

        var $worker = $('<div></div>').addClass('itemdiv dialogdiv'),
            $user = $('<div></div>').addClass('user'),
            url = config.media + api.common.showImg.url + '?imgBasePath=' + v.workerPhoto + '&divFlag=1&width=48&height=48',
            $userImg  = $('<img onerror="javascript:this.src=\'./assets/images/avatar2.png\';">').attr('src', url),

            $body = $('<div></div>').addClass('body').css('background', '#fff'),
            $name = $('<div class="name"><span class="blue">' + v.workerName + '</span></span></div>'),
            $text = $('<div>'+ v.workerDuty+',<a href="tel:'+ v.workerPhone +'">'+ v.workerPhone +'</a></div>');

        $user.append($userImg);
        $body.append($name).append($text);

        $worker.append($user).append($body);

        return $worker;
    }

});