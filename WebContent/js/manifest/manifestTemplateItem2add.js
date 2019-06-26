
$(function(){
	
    var displayFunc  = (function(){
    	
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
        
        var createTableTitle = function(){
        	
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');
            
            var titleName = '编号,商品名,条形码,品类,品牌,单位,类型,件数,状态';
            
            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });
            
            $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);
            
            return $ulTitle;
        };
        
        var creatLine = function(i, v, lastFlag){
        	
            var $liLine = $('<li></li>').addClass('line');

            var $divChecker = $('<label></label>').addClass('checker');
            var $spanChecked = $('<span></span>').addClass('lbl blue bigger-150');
            var $inputCheckbox = $('<input type="checkbox" class="ace ace-checkbox-2">').attr({"value" : v.gid});
            
            $divChecker.append($inputCheckbox).append($spanChecked);

            $inputCheckbox.click(function () {
                $(this).toggleClass('checked')
            });

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html($divChecker).attr({"value" : v.gid}));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');
            
            var propertyArr = [
                [v.no, 'blue'],
                [v.name, 'grey'],
                [v.barcode, 'blue'],
                [v.category, 'grey'],
                [v.brand, 'grey'],
                [v.measurementUnit, 'grey'],
                [v.type==0 ? "商品" : "套餐", 'red'],
                [v.pieceNum, 'blue'],
                [v.status=="0" ? "启用" : "禁用" , 'red']
            ];
            
            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });
            
            var $cellOption = $('<div></div>').addClass('cell option');
            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            
            $btnGroup.append($btnUl).appendTo($cellOption);
            $liLine.append($indexWrap).append($contentWrap);
            
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
        }
    })();
    
    var searcher = new Searcher();
    searcher.init( ['goodsNo','goodsName','goodsBarcode'], "condList1", api.inventory.pageGoodsForAdvance, function(data){
        displayFunc.init('resultList1', data);
    }, "pagenation1", "manifestTemplateItemGoodsPostData", null, false, null, null,'resultList1');
    
    var $btnConfirm = $('<a></a>').addClass('btn btn-xs btn-success mgr-10').attr({'name':'subbtn','href':'javascript:void(0);'}).text('确定');
    var $btnCancel = $('<a></a>').addClass('btn btn-xs').attr({'name':'cancelbtn','href':'javascript:void(0);'}).text('取消');
    
    var $condList1 = com.focusPage('#condList1');
    
    $condList1.append($btnConfirm).append($btnCancel);
    
    //确定按钮事件
    $btnConfirm.bindClick(function(){
        saveOptionChange();
    });
    $btnCancel.bindClick(function(){
        com.closePopup();
    });
    
    function saveOptionChange(){
    	
        var _params = {
            "manifestTemplate.mtid" : params["manifestTemplate.mtid"]
        };
        
        var $menus = com.focusPage('input[type="checkbox"]:checked', '.line');
        if(!$menus.length){
            com.showAlert(com.warning, "请选择商品");
            return false;
        }
        var $gid = [];
        
        $.each($menus,function(i,v){
            var $v = $(v);
            $gid.push($v.val());
        });
        
        $menus.length && $menus.each(function(i){
            _params["miids[" + i + "]"] = $gid[i];
        });
        
        com.post(api.inventory.addManifestTemplateItem, _params, function(data){
            com.showAlert(com.info, "操作成功");
            com.switchPage('views/manifest/manifestTemplateItem.html');
            com.closePopup();
        });
    }
    
});
