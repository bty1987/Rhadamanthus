
$(function(){
    
    var mbrand = {
            
        bid: null,
            
        items:{
            name: com.focusPage("#name"),
            cid: com.focusPage("#categoryId"),
            path: com.focusPage("#path"),
            
            brandImg: com.focusPage("#brandImg")
        },
        
        btns: {
            saveBtn: com.focusPage("#saveBtn")
        },
        
        editFlg: false,
        repeatFlg: false
    };

    com.post(api.store.queryMcategory, {}, function(res){
        com.focusPage("#categoryId").bindData(res.mcategorys, "cid", "name");
    });
    
    com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpge;*.gif;*.png', {'uploadType': 2}, 1, function(data){
        
        mbrand.items.path.val(data.resUrl);
        
        com.showImg(mbrand.items.brandImg, data.resUrl, 150, 150, '', null, 0);
    });
    
    mbrand.btns.saveBtn.click(saveData);

    var displayFunc  = (function(){
        /*表格样式*/
        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);

            if(listData && listData.length){
                
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData,function(i, v){
                    creatLine(i, v, i == listData.length - 1).appendTo($ulTitle);
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
                $('<div></div>').addClass('cell').html(v).appendTo($contentWrap);
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
            
            var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
            var img = $('<img/>').appendTo($imgDiv);
            com.showImg(img, v.icon, 50, 50, '50x50', null, 0);

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
                
                mbrand.bid = v.bid;
                
                com.popup4model('#layerAdd', '编辑', null, function () {
                    com.clearValidator();
                }, function(){
                    initUpdate(v);
                });
            });

            /*状态启用*/
            $btnStart.click(function(){
                updateStatus(v.bid, 0);
            });

            /*状态禁用*/
            $btnBan.click(function(){
                updateStatus(v.bid, 1);
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

    var searcher = new Searcher();

    searcher.init( ["store-mbrand"], "condList", api.store.pageMbrand, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "mbrandPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            
            mbrand.bid = null;
            
            com.clearImg(mbrand.items.brandImg);
            com.cleanItems(mbrand.items);
            
            com.popup4model('#layerAdd', '添加', null, function () {
                com.clearValidator();
            });
        });
        
        return [$adda];
    }, 'resultList');
    
    function updateStatus(bid, status){
        
        var options = {
            "mbrand.bid": bid,
            "mbrand.status": status
        }
        
        com.post(api.store.updateMbrandForStatus, options, function(res){
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    }

    /*添加信息*/
    function saveData(){
        
        if(com.validate('form1')) return false;
        
        var url = api.store.addMbrand;
        var options = {
            "mbrand.mcategory.cid": mbrand.items.cid.val(),
            "mbrand.name": mbrand.items.name.val(),
            "mbrand.icon": mbrand.items.path.val()
        }
        
        if(mbrand.bid){
            options["mbrand.bid"] = mbrand.bid;
            
            url = api.store.updateMbrand;
        }

        com.post(url, options, function(res){
            com.closePopup();
            searcher.doSearch();
        });
    }

    function initUpdate(v){
        
        mbrand.items.cid.val(v.mcategory.cid);
        mbrand.items.name.val(v.name);
        mbrand.items.path.val(v.icon);
        
        com.showImg(mbrand.items.brandImg, v.icon, 150, 150, '', null, 0);
    }
    
});
