$(function () {

    var goodsSuitPopUp = $('#goodsSuitPopUp');

    var goodsSuit = {
        'flag':true
    };

    var _goodsPackage = params['goods'];

    var $btnConfirm = $('<a></a>').addClass('btn btn-info').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css('margin-left','85%').text('添加');

    var $btnCancel = $('<a></a>').addClass('btn').attr({'name': 'cancelbtn', 'href': 'javascript:void(0);'}).css('margin-left','10px').text('取消');
    var $condList1 = $('#fl-container .layui-layer.layui-anim.layui-layer-page.layui-layer-lan');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-7%;"></div>');
    $div.append($btnConfirm).append($btnCancel).appendTo($condList1);

    function addlinePackge(data,cid,colorName,fid,formatInfo,num) {

        var $line = $('<li></li>').addClass('line').attr({'data-gid':data.gid,'data-cid':cid,'data-fid':fid,'data-num':num});
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index'));//.text('')
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass: "no",value:data.no},//编号
            {cellClass: "name",value:data.name},//名称
            {cellClass: "barcode",value:data.barcode},//条形码
            {cellClass: "category",value:data.category},//品类
            {cellClass: "brand",value:data.brand},//品牌
            {cellClass: "color", value:colorName},//颜色
            {cellClass: "format",value:formatInfo},//规格
            {cellClass: "measurementUnit", value:data.measurementUnit},//单位
            {cellClass: "number" , value:num},//数量
            {cellClass: "status",value:data.status==0?'启用':'禁用'},//状态
        ];
        var $btndel = $('<a class="color-red red" style="font-size: 18px"><i class=" icon-remove"></i></a>');
        $.each(_lineInfoSet, function (i, v) {

            var $cell = $('<div></div>').addClass('cell ' + v.cellClass).text(v.value);

            $cell.appendTo($lineInfoWrap);

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btndel.click(function (e) {
            $(this).parents('.line.current').remove();
        })

        return $line;

    }

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col11');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass: "no"},//编号
            {cellClass: "name", hasInput: !0},//名称
            {cellClass: "barcode"},//条形码
            {cellClass: "category"},//品类
            {cellClass: "brand"},//品牌
            {cellClass: "color", hasSelectColor: !0},//颜色
            {cellClass: "format",hasSelectFormat: !0},//规格
            {cellClass: "measurementUnit", },//单位
            {cellClass: "assisTypeName"},//辅类
            {cellClass: "number" , hasInput :!0},//数量
            {cellClass: "status"},//状态
        ];
        var $btncheck = $('<a class="color-green green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="color-red red" style="font-size: 18px"><i class=" icon-remove"></i></a>');
        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $select;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                $cell.append($input);
            }
            if (v.hasSelectColor) {
                $select = $('<select></select>');
                $cell.append($select);
            }
            if (v.hasSelectFormat) {
                $select = $('<select></select>');
                $cell.append($select);
            }

            $cell.appendTo($lineInfoWrap);

        });

        $lineInfoWrap.find('.name input').typeahead({
            url: api.inventory.queryGoodsByName,
            list: [],
            postData: {},
            source: function (query, process) {
                var params = $.extend({
                    "goods.name": query,
                    "goods.pinyin": query,
                    "goods.no": query
                }, this.options.postData);
                com.post(this.options.url, params, $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function (data) {
                this.options.list = data['goodes'];
                this.flprocess(this.options.list, 'gid', 'name');
            },
            isResultTypeMap: true
            , flupdater: function (k, v) {
                //k: key, v:value
                var list = this.options.list;
                $.each(list, function (index, val) {
                    if (val.gid == k) {
                        $lineInfoWrap.find('.no').text(val.no);
                        $lineInfoWrap.find('.barcode').text(val.barcode);
                        $lineInfoWrap.find('.category').text(val.category);
                        $lineInfoWrap.find('.brand').text(val.brand);
                        $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                        $lineInfoWrap.find('.assisTypeName').text(val.assisType.name == null ? "" : val.assisType.name);
                        $lineInfoWrap.find('.status').text(val.status == "0" ? "启用" : "禁用");
                        $line.attr({'data-gid' : val.gid, 'data-type' : val.type});
                        com.post(api.inventory.queryColorForEnableByGid,{
                            "color.gid": val.gid
                        },function(res){
                            if(res.colors.length!=0){
                                goodsSuit.flag = true;
                                $('li[data-gid="'+val.gid+'"] .color select').bindData(res.colors,"cid","name");
                            }else{
                                goodsSuit.flag = false;
                                com.showAlert(com.warning,'该商品暂无颜色信息,请录入')
                            }

                        },function(e){
                            com.showAlert(com.error, e.errorMsg);
                        })

                        com.post(api.inventory.queryFormatForEnableByGid,{
                            "format.gid": val.gid
                        },function(res){
                            if(res.formats.length!=0){
                                goodsSuit.flag=true;
                                $('li[data-gid="'+val.gid+'"] .format select').bindData(res.formats,"fid","info");
                            }else{
                                goodsSuit.flag = false;
                                com.showAlert(com.warning,'该商品暂无规格信息,请录入')
                            }

                        },function(e){
                            com.showAlert(com.error, e.errorMsg);
                        })
                    }
                });

                return v;
            }

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            e.stopPropagation();
            var gid = $(this).parents('li.line.current').attr('data-gid');
            var cid = $(this).parents('li.line.current').find('.color select').val();
            var colorName = $(this).parents('li.line.current').find('.color select option:selected').text();
            var fid = $(this).parents('li.line.current').find('.format select').val();
            var formatInfo = $(this).parents('li.line.current').find('.format select option:selected').text();
            var num = $(this).parents('li.line.current').find('.number input').val();

            if (checkRowValue($line) && goodsSuit.flag) {
                com.post(api.inventory.queryGoodsByGId, {
                    'goods.gid':gid
                }, function (data) {
                    $('#list').empty();
                    addline(1).addClass('current').appendTo('#list');
                    addlinePackge(data.goods,cid,colorName,fid,formatInfo,num).addClass('current').appendTo('#showList');
                }, function (e) {
                    com.showAlert(com.info, e.errorMsg);
                })

            }
        })

        $btndel.click(function (e) {

            $('#list').empty();

            addline(1).addClass('current').appendTo('#list');

        })

        return $line;

    }

    addline(1).addClass('current').appendTo('#list');

    function checkRowValue($line) {

        var flag = true;

        var color = $line.find('.color select');

        if(!color.val()){
            color.focus().select();

            color.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请选择颜色信息"

            }).popover('show');

            flag =  false;
        }else{
            color.popover('destroy');
        }

        //对规格判断
        var format = $line.find('.format select');
        if(!format.val()){
            format.focus().select();

            format.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请选择规格信息"

            }).popover('show');

            flag =  false;
        }else{
            format.popover('destroy');
        }

        var name = $line.find('.name input');
        if (!name.val()) {
            name.focus().select();

            name.addClass('popover-notitle').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "请填写主材名称"

            }).popover('show');

            flag = false;
        } else {
            name.popover('destroy');
        }

        var num = $line.find('.number input');
        var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
        if(!(numRex.test(num.val()) && parseFloat(num.val()) > 0)){
            num.focus().select();
            num.addClass('tooltip-info').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "数量输入内容格式错误!"
            }).popover('show');
            flag =  false;
        }else{
            num.popover('destroy');
        }

        var brand = $line.find('.brand');
        if(brand.text()!=_goodsPackage['goods.brand']){
            layer.msg('品牌不一致');
            flag =  false;
        }

        var type = $line.attr('data-type');

        if(type!=0){
            layer.msg('不可添加套餐商品.');
            flag =  false;
        }

        return flag;
    }

    $('.layui-layer-content').css('overflow', 'hidden');
    $('#showGoods').css({'height': '560px','margin-top':'3%'});
    $('#resultListGoodsPackage').css({
        'width': '96%',
        'margin': '0 auto',
        'height': '560px',
        'overflow-y': 'scroll',
        'marigin-top': '20px'
    })
    $('#addGoodsPackage').css({'width': '96%', 'margin': '0 auto', 'margin-top': '15px'})

    $btnConfirm.click(function(e){
        e.stopPropagation()
        var _option = {}

        $.extend(_option,params.goods);

        var packageList = $('#showList','#goodsSuitPopUp').find('li');
        $.each(packageList,function(i,v){
            var _this = $(v);
            _option["goodsPackages["+i+"].goods.gid"] = _this.attr('data-gid');
            _option["goodsPackages["+i+"].color.cid"] =_this.attr('data-cid')
            _option["goodsPackages["+i+"].format.fid"] = _this.attr('data-fid')
            _option["goodsPackages["+i+"].num"] = _this.attr('data-num')
        })

        if(packageList.length==0){

            layer.msg('请添加套餐商品.')

            return
        }

        com.post(api.inventory.addPackage,_option,function(){
            layer.closeAll();
            layer.msg('添加成功');
            $('#showList').empty();
            $('#list').empty();
        })

    })

    $btnCancel.click(function(){
        layer.closeAll()
        $('#showList').empty();
        $('#list').empty();
    })

})