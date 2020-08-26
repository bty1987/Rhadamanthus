$(function(){
    com.focusPage("#showGoodsDetail").on('hide.bs.modal', function () {
        com.focusPage("#goodsDetailMap").html("");
        com.focusPage("#goodsDetailTitleSpan").html("");
        com.focusPage("#goodsDetailPriceSpan").html("");
        com.focusPage("#allPic").html("");
    });

    //获取品类
    var categoryOption = {
        "paging.noPage": 1
    };
    com.post(api.store.pageMcategory, categoryOption, function(data){
        drawCategory(data.paging.data, com.focusPage("#showLeft"));
    });

    //获取热点商品
    var mpriceOptions = {
        "mprice.status": 2
    };
    com.post(api.store.queryMpriceForShow, mpriceOptions, function(data){
        var mprices = data.mprices;
        drawGoods(mprices, com.focusPage("#goodsTopList"), true);
    });

    //获取推荐商品
    var mpriceOptions = {
        "mprice.status": 3
    };
    com.post(api.store.queryMpriceForShow, mpriceOptions, function(data){
        var mprices = data.mprices;
        drawGoods(mprices, com.focusPage("#goodsDownList"), true);
    });

    //画品类
    function drawCategory(category, goodsPlace){
        $.each(category, function(i, v){
            var $categoryDiv = $('<div></div>').appendTo(goodsPlace);
            var $categoryI = $('<i></i>').addClass('icon-circle-blank').css("margin-right", "5px").appendTo($categoryDiv);
            var $categoryName = $('<span></span>').addClass("icon-plus-square").appendTo($categoryDiv).html(v.name);
            var $goodBrandUl = $('<ul></ul>').prop("id", "category"+v.cid).appendTo($categoryDiv);
            var $goodBrandDiv = $('<div></div>').prop("id", "brand"+v.cid).appendTo($goodBrandUl);

            $categoryName.click(function(){
                if($goodBrandDiv.html()){
                    if($goodBrandDiv.attr("style")){
                        $categoryI.removeClass("icon-circle-blank").addClass("icon-circle");
                        $goodBrandDiv.removeAttr("style");
                        return;
                    }else{
                        $categoryI.removeClass("icon-circle").addClass("icon-circle-blank");
                        $goodBrandDiv.attr("style", "display:none");
                        return;
                    }
                }

                $categoryI.removeClass("icon-circle-blank").addClass("icon-circle");

                //获取品牌
                var brandOption = {
                    "mbrand.mcategory.cid": v.cid
                };
                com.post(api.store.queryMbrand, brandOption, function(data){
                    drawBrand(data.mbrands, $goodBrandDiv);
                });
            });

            //样式
            $categoryName.css({
                'font-size': '14px',
                'font-weight': 'bold'
            })
        });
    }

    //画品牌
    function drawBrand(brand, $goodBrandDiv){
        $.each(brand, function(i, j){
            var $goodBrandLi = $('<li></li>').addClass("col-xs-12").html(j.name).appendTo($goodBrandDiv);
            $goodBrandLi.css({
                "list-style": "none",
                "margin-bottom": "5px"
            });

            $goodBrandLi.click(function(){
                com.focusPage("#goodsTopList").html("");
                com.focusPage("#goodsDownList").html("");
                com.focusPage("#goodsDown").attr("style", "display:none");
                com.focusPage("#goodsTopName").html($goodBrandLi.html()+"品牌");

                //根据品牌查询商品
                var goodsOption = {
                    'filters[0].field': "mbrand.bid",
                    'filters[0].data': j.bid,
                    'filters[0].op': "eq",
                    "paging.noPage": 1
                };
                com.post(api.store.pageMgoods, goodsOption, function(data){
                    drawGoods(data.paging.data, com.focusPage("#goodsTopList"), false);
                })
            });
        });
    }

    //画商品列表
    function drawGoods(goods, goodsPlace, index){
        $.each(goods, function(i, v){
            var imgUrl = index ? v.mgoods.defaultImg : v.defaultImg;

            var $goodDiv = $('<div></div>').addClass("goodDiv col-xs-2").attr("display", "inline").appendTo(goodsPlace);
            var $picDiv = $('<div></div>').attr("style", "text-align:center").appendTo($goodDiv);

            drawImg(imgUrl, 150, 150, $picDiv, function(){
                drawImg(imgUrl, 500, 500, com.focusPage("#goodsDetailMap"));
                com.focusPage("#goodsDetailTitleSpan").html(index ? v.mgoods.title : v.title);
                com.focusPage("#goodsDetailPriceSpan").html("￥" + v.price);

                getDetailPic(index ? v.mgoods.gid : v.gid);
                com.focusPage("#showGoodsDetail").modal("show");
            });
            var $goodTitle = $('<span></span>').appendTo($goodDiv).html(index ? v.mgoods.title : v.title);
            var $goodPrice = $('<span></span>').appendTo($goodDiv).html("￥" + v.price);

            //样式
            $goodDiv.css({
                'margin': '10px 0 10px 0'
            });

            $goodTitle.css({
                'display': 'block',
                'table-layout': 'fixed',
                'overflow': 'hidden',
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis'
            });
        });
    }

    //获取商品的详情图片
    function getDetailPic(gid){
        var pictureOptions = {
            "picture.gid": gid,
            "picture.type": 1
        };

        com.post(api.store.queryPicture, pictureOptions, function(res){
            var pictures = res.pictures;
            $.each(pictures, function(i, v){
                drawImg(v.img, 450, 450, com.focusPage("#allPic"));
            })
        })
    }

    //画图片
    function drawImg(imgUrl, weight, height, appendAdd, callback){
        var $detailImg = $("<img />").appendTo(appendAdd);
        com.showImg($detailImg, imgUrl, weight, height, '', null, 0);
        if (callback){
            $detailImg.click(function(){
                callback();
            });
        }
    }
});
