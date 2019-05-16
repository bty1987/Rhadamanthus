
$(function(){
    var mbrand = {
        mbrandItems:{},
        editFlg: false,
        repeatFlg: false
    };

    mbrand.mbrandItems.name = com.focusPage("#name");
    mbrand.mbrandItems.cid = com.focusPage("#categoryId");
    mbrand.mbrandItems.path = com.focusPage("#path");

    var colorboxArgs = {
        reposition:true,
        scalePhotos:true,
        scrolling:false,
        previous:'<i class="icon-arrow-left"></i>',
        next:'<i class="icon-arrow-right"></i>',
        close:'&times;',
        current:'{current} of {total}',
        maxWidth:'100%',
        maxHeight:'100%'
    };

    com.post(api.store.queryMcategory, {}, function(res){
        com.focusPage("#categoryId").bindData(res.mcategorys, "cid", "name");
    });

    var displayFunc  = (function(){
        /*表格样式*/
        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);

            if(listData && listData.length){
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData,function(i, v){
                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });
            }
        };

        /*表格头*/
        var createTableTitle = function(){
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var titleName ='图片,品类,品牌,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };
        /*表格体*/
        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var id = i + 1;
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(id));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col4');
            var  propertyArrimg = [
                [v.icon,'null']
            ];
            $.each(propertyArrimg, function (i, v) {
                var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
                var img = $('<img/>').appendTo($imgDiv);
                com.showImg(img, v[0], 50, 50, '50x50', null, 0);
            });

            var propertyArr = [
                [v.mcategory.name,'grey'],
                [v.name,'grey'],
                [v.status =="0" ? "启用" : "禁用",'red']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnBan = $('<li></li>').append($('<a></a>').html('禁用'));
            var $update = $('<li></li>').append($('<a></a>').html('编辑'));

            $btnUl.append($update).append($btnStart).append($btnBan);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            //编辑
            $update.click(function(){
                editBrand(v);
                openlayer(function(index, layero){
                    if(com.validate('form1'))
                        return;
                    updateData(v, function(){
                        layer.closeAll();
                    });
                });
            });

            /*状态启用*/
            $btnStart.click(function(){
                startStatus(v.bid, v.status, function(){
                    layer.closeAll();
                    layer.msg('启用成功',{icon:1});
                });
            });

            /*状态禁用*/
            $btnBan.click(function(){
                stopStatus(v.bid, v.status, function(){
                    layer.closeAll();
                    layer.msg('禁用成功',{icon:1});
                });
            });
            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    /*分页*/
    var _condArr = ['mbrandName'];
    var mbrandSeacher = new Searcher();

    mbrandSeacher.init( _condArr, "condList", api.store.pageMbrand, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "mbrandPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            com.focusPage("#brandImg").html("");
            com.cleanItems(mbrand.mbrandItems);

            openlayer(function(index, layero){
                if(com.focusPage("#path").val() == null || com.focusPage("#path").val() == ""){
                    com.focusPage("#brandImg").html("");
                    var $text = $('<span></span>').html('请上传图片').css("color", "red").appendTo(com.focusPage("#brandImg"));
                    return;
                }

                if(com.validate('form1')){
                    return;
                }

                saveData(function(){
                    layer.closeAll();
                });
            });
        });
        return [$adda];
    },'resultList');

    function openlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            title:" ",
            content: com.focusPage('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9000,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                var img =com.focusPage('#showImg').attr('src');
                if(img == "#"){
                    layer.msg("请上传图片");
                }else{
                    callback(index,layero);
                }
            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
                com.clearValidator();
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }

    /*状态信息验证*/
    function startStatus(id, status, callback){
        if(status == "1"){
            com.post(api.store.updateMbrandForStatus,{
                "mbrand.bid" : id,
                "mbrand.status" : "0"
            },function(res){
                callback();
                mbrandSeacher.doSearch();
            });
        }else{
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }

    function stopStatus(id, status, callback){
        if(status == "0"){
            com.post(api.store.updateMbrandForStatus,{
                "mbrand.bid" : id,
                "mbrand.status" : "1"
            },function(res){
                callback();
                mbrandSeacher.doSearch();
            });
        }else{
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

    /*添加信息*/
    function saveData(callback){
        var cid = mbrand.mbrandItems.cid.val();
        var name = mbrand.mbrandItems.name.val();
        var path = com.focusPage("#path").val();

        com.post(api.store.addMbrand, {
            "mbrand.mcategory.cid": cid,
            "mbrand.name":name,
            "mbrand.icon":path
        }, function(res){
            callback();
            mbrandSeacher.doSearch();
        });
    }

    function updateData(v, callback){
        var cid = mbrand.mbrandItems.cid.val();
        var name = mbrand.mbrandItems.name.val();
        var path = com.focusPage("#path").val();

        if(name == v.name){
            layer.msg("你未修改品牌");
        }

        com.post(api.store.updateMbrand, {
            'mbrand.bid' : v.bid,
            "mbrand.mcategory.cid" : cid,
            "mbrand.name" : name,
            "mbrand.icon" : path
        }, function(res){
            callback();
            mbrandSeacher.doSearch();
        });
    }

    function editBrand(v){
        com.focusPage("#brandImg").html("");
        mbrand.mbrandItems.cid.val(v.mcategory.cid);
        mbrand.mbrandItems.name.val(v.name);
        mbrand.mbrandItems.path.val(v.icon);
        var img = $('<img />');
        var imgA = $("<a></a>").attr("href", com.showImg(img, v.icon, 150, 150, '150x150', null, 0)).attr("data-rel", "colorbox").css("height", "150px").append(img).appendTo(com.focusPage("#brandImg"));
        imgA.colorbox(colorboxArgs);
    }

    com.focusPage("#pictureUpload").Huploadify({
        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout': 99999, //超时时间
        'multi': false, // 批量上传
        'buttonClass': 'btn btn-success',
        'formData': { //附带值
            'uploadType':0,
            'strutsUploadsFileName': '',
            'username':'用户名',
            'rnd':'加密密文'
        },
        'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
        'width': '100', // 浏览按钮的宽度
        'height': '32', // 浏览按钮的高度
        'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts': '*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
        'fileSizeLimit': 3072, // 上传文件的大小限制
        'queueSizeLimit': 25, // 上传数量
        'onUploadSuccess':function(file, data, response){
            var dateObj=eval("("+data+")");
            if(dateObj.errorCode == 0){
                com.focusPage("#brandImg").html("");
                mbrand.mbrandItems.path.val(dateObj.resUrl);
                var img = $('<img />');
                var imgA = $("<a></a>").attr("href", com.showImg(img, dateObj.resUrl, 150, 150, '150x150', null, 0)).attr("data-rel", "colorbox").css("height", "150px").append(img).appendTo(com.focusPage("#brandImg"));
                imgA.colorbox(colorboxArgs);
            }else{
                alert(data);
            }
        }
    });
});
