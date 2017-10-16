jQuery(function ($) {

    var $popup = $('#addPopUp');

    $popup.css({'margin': '0 auto', 'margin-top': '2%', 'width': '98%'});

    addline(1).addClass('current').appendTo('#List');

    $('#addoutsourceItem').click(function(){
        var num = $('.line', '#List').length;
        var returnFlag = false;
        var $lines = $('.line', '#List');
        $lines.each(function(){
            var $this = $(this);
            if(!checkRowValue($this)){
                returnFlag = true;
                return false;
            }
        });

        if(returnFlag) return;

        var $line = addline(num + 1);
        $line.appendTo('#List');
    });

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col9');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass: "name",  hasInput: !0},//名称
            {cellClass: "height",  hasInput: !0},//高
            {cellClass: "width",  hasInput: !0},//宽
            {cellClass: "thick",  hasInput: !0},//厚
            {cellClass: "modelling",  hasInput: !0},//造型
			{cellClass: "unitprice"},//单价
            {cellClass: "outNum",  hasInput: !0},//数量
            {cellClass: "total"},//总价
            {cellClass: "comment",hasInput: !0},//说明

        ];

        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {

            var $input;
            var $cell = $('<div></div>').addClass('cell '+v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                $cell.append($input);
            }
            $cell.appendTo($lineInfoWrap);

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            e.stopPropagation();
            if(!checkRowValue($line)){
                return;
            }

            var _num = $lineInfoWrap.find('.outNum input').val();
            var _unitPrice = $lineInfoWrap.find('.unitprice').text();
            var _total = utils.accMul(parseFloat(_num+''),parseFloat(_unitPrice+''));

            $lineInfoWrap.find('.total').text(_total);
        });

        $btndel.click(function (e) {
            e.stopPropagation();
            $line.remove();
            return;
        });
		
		$lineInfoWrap.find(".name input").typeahead({

            url: api.production.queryQuoteItemByPinyin,
            list: [],
            postData: {},
            source: function (query, process) {

                var params = $.extend({"quoteItem.name": query, "quoteItem.pinyin": query}, this.options.postData);
                com.post(this.options.url, params, $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function (data) {
                this.options.list = data['quoteItems'];
                this.flprocess(this.options.list, 'qiid', 'name');
            },
            isResultTypeMap: true
            , flupdater: function (k, v) {
                //k: key, v:value
                var list = this.options.list;

                $.each(list, function (index, val) {

                    if (val.qiid == k) {
                        $lineInfoWrap.find('.unitprice').text(val.unitprice);
                        $lineInfoWrap.find('.unitprice').attr('data-unitprice', val.unitprice);
                        //$lineInfoWrap.find('.measurementUnit').text(val.measurementunit);
                        $line.attr('data-qiid', val.qiid);
                    }

                });
                return v;
            }
        });

        $lineInfoWrap.find(".outNum").on("change",function(){

            var _num =  $lineInfoWrap.find('.outNum input').val();
            var _unitPrice = $lineInfoWrap.find('.unitprice').text();
            var _total = utils.accMul(parseFloat(_num+''),parseFloat(_unitPrice+''));
            $lineInfoWrap.find('.total').text(_total);

        });
        return $line;
    }


    $("#submitoutsourceItem").click(function () {

        var options = {};
        var $lines = $('.line', '#List');
        var returnFlag = false;

        $lines.each(function(i){
            var $this = $(this);
            if(!checkRowValue($this)){
                returnFlag = true;
            };

            options["outsourceItems["+i+"].name"] = $this.find('.name input').val();
            options["outsourceItems["+i+"].height"] = $this.find('.height input').val();
            options["outsourceItems["+i+"].width"] = $this.find('.width input').val();
            options["outsourceItems["+i+"].thick"] = $this.find('.thick input').val();
            options["outsourceItems["+i+"].modelling"] = $this.find('.modelling input').val();
            options["outsourceItems["+i+"].num"] = $this.find('.outNum input').val();
            options["outsourceItems["+i+"].unitprice"] = $this.find('.unitprice').text();
            options["outsourceItems["+i+"].total"] = $this.find('.total').text();
            options["outsourceItems["+i+"].comment"] = $this.find('.comment input').val();
        });

        if(returnFlag) return;

        options["outsource.oid"] = $popup.attr('data-oid');
        com.post(api.production.addOutsourceItem,options,function(res){
            $('#List').empty();
            addline(1).addClass('current').appendTo('#List');
            com.showAlert(com.info,"添加成功");
            layer.closeAll();
        },function(e){
            com.showAlert(com.info, e.exception.errorMessage);
        })

    });

    function checkRowValue($line) {

        var flag = true;
        var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

        var name = $line.find('.name input');
        if (!name.val()) {
            name.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "bottom",
                "data-original-title": "",
                "title": "",
                "data-content": "名称不能为空!"
            }).popover('show');
            flag = false;
        } else {
            name.popover('destroy');
        }

        var height = $line.find('.height input');
        if (!(numRex.test(height.val()) || parseFloat(height.val()) < 0)) {
            height.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "bottom",
                "data-original-title": "",
                "title": "",
                "data-content": "输入内容格式错误!"
            }).popover('show');
            flag = false;
        } else {
            height.popover('destroy');
        }

        var width = $line.find('.width input');
        if (!(numRex.test(width.val()) || parseFloat(width.val()) < 0)) {
            width.focus().select();
            width.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "bottom",
                "data-original-title": "",
                "title": "",
                "data-content": "输入内容格式错误!"
            }).popover('show');
            flag = false;
        } else {
            width.popover('destroy');
        }

        var thick = $line.find('.thick input');
        if (!(numRex.test(thick.val()) || parseFloat(thick.val()) < 0)) {
            thick.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "bottom",
                "data-original-title": "",
                "title": "",
                "data-content": "输入内容格式错误!"
            }).popover('show');
            flag = false;
        } else {
            thick.popover('destroy');
        }

        var num = $line.find('.outNum input');
        if (!(numRex.test(num.val()) || parseFloat(num.val()) <= 0)) {
            num.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "bottom",
                "data-original-title": "",
                "title": "",
                "data-content": "输入内容格式错误!"
            }).popover('show');
            flag = false;
        } else {
            num.popover('destroy');
        }

        //var unitprice = $line.find('.unitprice input');
        //if (!(numRex.test(unitprice.val()) || parseFloat(unitprice.val()) < 0)) {
        //    unitprice.addClass('tooltip-info').attr({
        //        "data-rel": "popover",
        //        "data-placement": "bottom",
        //        "data-original-title": "",
        //        "title": "",
        //        "data-content": "输入内容格式错误!"
        //    }).popover('show');
        //    flag = false;
        //} else {
        //    unitprice.popover('destroy');
        //}
        return flag;
    }


});

