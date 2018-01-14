/**
 * Created by 袁帅 on 2016/10/5.
 */

$(function(){
    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){
        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
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
            var titleName = '编号,商品名,条形码,品类,品牌,单位,套餐,件数,状态';
            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });
            $liTitle.append($indexWrap)
                .append($contentWrap)
                .appendTo($ulTitle);
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
            })

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html($divChecker).attr({"value" : v.gid}));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');
            var propertyArr = [
                v.no,
                v.name,
                v.barcode,
                v.category,
                v.brand,
                v.measurementUnit,
                v.type==0?"商品":"套餐",
                v.pieceNum,
                v.status=="0"?"启用":"禁用"
            ];
            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            $btnGroup
                .append($btnUl)
                .appendTo($cellOption);
            $liLine.append($indexWrap)
                .append($contentWrap);
            return $liLine;
        };
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
    var goodsSeacher = new Searcher();
    goodsSeacher.init( ['goodsNo','goodsName','goodsBarcode'], "condList1", api.inventory.pageGoods, function(data){
        displayFunc.init('resultList1', data);
    }, "pagenation1", "manifestTemplateItemGoodsPostData", null, false, null, null,'resultList1');
    //添加按钮
    var $btnConfirm = $('<a></a>').addClass('btn btn-success mgr-10').attr({'name':'subbtn','href':'javascript:void(0);'}).text('确定');
    var $btnCancel = $('<a></a>').addClass('btn').attr({'name':'cancelbtn','href':'javascript:void(0);'}).text('取消');
    var $condList1 = $('#condList1');
    $condList1.append($btnConfirm).append($btnCancel);
    //添加按钮事件
    $btnConfirm.bindClick(function(){
        saveOptionChange();
    });
    $btnCancel.bindClick(function(){
        layer.closeAll();
    });
    var $page = $('span[name="totalPage"]').val();
    var $nowpage = $('span[name="nowPage"]').val();
    //选择框操作
    function saveOptionChange(){
        var _params = {
            "manifestTemplate.mtId" : params.mtid
        };
        var $menus = $('input[type="checkbox"]:checked', '.line');
        //var $menus = $('input[type="checkbox"]:checked');
        //var gidObj = $('input[type="checkbox"]');
        var $gid = [];
        $.each($menus,function(i,v){
            var $v = $(v);
            $gid.push($v.val());
        })
        $menus.length && $menus.each(function(i){
            _params["miIds[" + i + "]"] = $gid[i];
        });
        com.post(api.inventory.addManifestTemplateItem, _params, function(data){
            layer.closeAll();
            layer.msg("设置成功", {icon : 1});
            com.switchPage('views/manifest/manifestTemplateItem.html');
        });
    }
//弹出内容许些样式
    $('#condList1').css('margin-bottom','12px');
    $('#condList1 .inline').css('margin-top','15px');
    $('#condList1 .inline:nth-of-type(1)').css('margin-left','25px')
    $('#condList1 .small').css('margin-top','15px');
    $('#condList1 a[name="subbtn"]').css({'margin-left':'160px'});
    $('#condList1 a[name="cancelbtn"]').css({'margin-left':'3px'});
    $('#resultList1').css({'width':'96%','margin':'0 auto'})
});
