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

    var constructionParams = {};
    var constructerParams = {};
    var construcionScheName = {};

    $('#oid').text(order.oid);

    $('.widget-box').addClass('flloading');
    $('.widget-box', '#orderId').removeClass('flloading');

    com.post(api.ds.construction,{},function (res) {
        $.each(res.constructionSchedule,function (i,v) {
            construcionScheName[v.key] = v.value;
        })
    },null,false);

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

//    获取订单基本信息
    com.post(api.decoration.queryDecorationOrderForDesignerByOrderId, {"decorationOrder.orderId": order.oid}, function(req){
        var $info = $('#baseinfo');

        var decorationOrder = req.decorationOrder;

        $('[name="uname"]',$info).text(decorationOrder.customer.customerName);
        $('[name="addr"]',$info).text(decorationOrder.village.villageName+' '+decorationOrder.houseNumber);
        $('[name="dname"]',$info).text(decorationOrder.designer);
        $('[name="dphone"]',$info).text(decorationOrder.designerPhone|| '');
        $('[name="sname"]',$info).text(decorationOrder.salesman);
        $('[name="sphone"]',$info).text(decorationOrder.salesmanPhone|| '');
        $('[name="vname"]',$info).text(decorationOrder.supervisor|| '');
        $('[name="vphone"]',$info).text(decorationOrder.supervisorPhone|| '');
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
    


    initProject();

    function initProject() {

        var constructionScheduleParams = {};
        var constructionData = {};
        var constructionDataBySche = {};


        constructionScheduleParams["constructionSchedule.orderId"] = order.oid;
        constructionParams["construction.orderId"] = order.oid;
        constructerParams["constructer.orderId"] = order.oid;

        com.post(api.construction.queryConstructionScheduleByOrderId,constructionScheduleParams,function (res) {
            $.each(res.constructionSchedules,function (i,v) {
                constructionDataBySche[v.schedule] = new Array();
                createProjectSchedule(v.schedule);
            })
        },null,false);

        com.post(api.construction.queryConstructionDrawingByOrderId,constructionParams,function (res) {
            constructionData = res.constructionDrawings;
        },function () {
            return false;
        },false);

        com.post(api.construction.queryConstructerByOrderId, constructerParams, function(res){

            var constructers = res.constructers;
            var length = constructers.length;

            if(length != 0){
                $.merge(constructionData,res.constructers);
            }

            for(var i=0;i<length;i++){
                var constructer = constructers[i];
                $('.alert-info', '#cs' + constructer.schedule).addClass("hide");
                $('[name="workers"]', '#cs' + constructer.schedule).append(createWoker(constructer));
            }

        }, null, false);

        if(!$.isEmptyObject(constructionData)){
            $.each(constructionData,function (i,v) {
                constructionDataBySche[v.schedule].push(v);
            });
        }

        if(!$.isEmptyObject(constructionDataBySche)) {
            $.each(constructionDataBySche, function (i, v) {
                var domid = "cs" + i;
                if (v.length) {
                    $.each(v, function (ind, poc) {
                        if (poc.drawingUrl) {
                            var path = {};
                            var _type = poc.type;
                            var _url = _url2 = poc.drawingUrl;
                            if (_type == 0) {
                                path = {
                                    url1: config.media + '/showImg.do' + '?imgBasePath=' + _url + '&divFlag=1&width=50&height=50&timestamp=' + new Date().getTime(),
                                    url2: config.media + '/showImg.do' + '?imgBasePath=' + _url2 + '&divFlag=1&width=600&height=600&timestamp=' + new Date().getTime()
                                };
                            }
                            if (_type == 1) {
                                path = {
                                    url1: config.dmedia + _url + '_50x50.jpg',
                                    url2: config.dmedia + _url2 + '_600x600.jpg'
                                };
                            }

                            var $pic = createPic(path, null, '700x700');

                            $('[name="project"]', '#' + domid).append($pic);
                        }

                    });

                    initPhotoSwipeFromDOM('#' + domid + ' [name="project"]');

                } else {
                    $('.widget-main', '#' + domid).empty().append('<div class="alert alert-info">当前没有施工信息!</div>');
                }

                $('.widget-box', '#' + domid).removeClass('flloading');
            })

        }
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
            url = config.media + api.common.showImg.url + '?imgBasePath=' + v.user.userPhoto + '&divFlag=1&width=48&height=48',
            $userImg  = $('<img onerror="javascript:this.src=\'./assets/ace/images/avatar2.png\';">').attr('src', url),

            $body = $('<div></div>').addClass('body').css('background', '#fff'),
            $name = $('<div class="name"><span class="blue">' + v.user.userName + '</span></span></div>'),
            $text = $('<div>'+ v.user.duty.name+',<a href="tel:'+ v.user.phone +'">'+ v.user.phone +'</a></div>');

        $user.append($userImg);
        $body.append($name).append($text);

        $worker.append($user).append($body);

        return $worker;
    }

    function createProjectSchedule(i) {
        var root = $('.timeline-items');

        var mainDiv = $('<div></div>').addClass('timeline-item clearfix').attr('id',"cs"+i);

        var infoDiv = $('<div></div>').addClass('timeline-info');
        var infoDivI = i % 2 == 0 ? $('<i></i>').addClass('timeline-indicator icon-trophy btn btn-info no-hover green') : $('<i></i>').addClass('timeline-indicator icon-trophy btn btn-success no-hover green') ;

        var widgetDiv = $('<div></div>').addClass('widget-box');
        var headerDiv = i % 2 == 0 ? $('<div></div>').addClass('widget-header header-color-blue widget-header-small') : $('<div></div>').addClass('widget-header header-color-green widget-header-small') ;
        var title = $('<h5></h5>').addClass('smaller').html(construcionScheName[i]);

        var widgetBody = $('<div></div>').addClass('widget-body');
        var widgetMain = $('<div></div>').addClass('widget-main');
        var pName = $('<p></p>').addClass('orange').html('工人信息');
        var workerDiv = $('<div></div>').addClass('dialogs').attr('name','workers');
        var workerDdtailDiv = $('<div></div>').addClass('alert alert-info').html('当前进度没有分配工人!');
        var pPic = $('<p></p>').addClass('orange').html('施工图片');
        var projectDiv = $('<div></div>').addClass('timeline-gallery').attr('name','project');

        infoDiv.append(infoDivI).appendTo(mainDiv);
        headerDiv.append(title).appendTo(widgetDiv);
        widgetBody.append(widgetMain.append(pName,workerDiv.append(workerDdtailDiv),pPic,projectDiv)).appendTo(widgetDiv);
        widgetDiv.appendTo(mainDiv);
        mainDiv.appendTo(root);

    }
});