jQuery(function ($) {

    var $popup = $('#addPopUp');

    $popup.css({'margin': '0 auto', 'margin-top': '2%', 'width': '98%'});

    //添加初始空行
    addline(1).addClass('current').appendTo('#list');

    $("#addHardwareItem").click(function(){
        var returnFlag = false;
        var num = $('.line', '#list').length;
        var $lines = $('.line', '#list');
        com.clearValidator();
        $lines.each(function(){
            var $this = $(this);
            if(com.validate("addPopUp","top")){
                returnFlag = true;
                return false;
            }
        });

        if(returnFlag) return;

        var $line = addline(num + 1);
        $line.appendTo('#list');
    });

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col6');
        var $optWrap = $('<div></div>').addClass('line-wrap action');

        var _lineInfoSet = [
            {cellClass: "name", hasInput: !0, validate:"v_required"},      //名称
            {cellClass: "unitPrice"},                                          //单价
            {cellClass: "hardNum", hasInput: !0, validate:"v_required v_float"},  //数量
            {cellClass: "measurementUnit"},                                     //单位
            {cellClass: "total"},                                               //总价
            {cellClass: "comment", hasInput: !0, validate:""},  //说明
        ];

        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass +" col-xs-2");

            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable '+v.validate+'');
                $cell.append($input);
            }

            $cell.appendTo($lineInfoWrap);
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
                        $lineInfoWrap.find('.unitPrice').text(val.unitprice);
                        $lineInfoWrap.find('.unitPrice').attr('data-unitPrice', val.unitprice);
                        $lineInfoWrap.find('.measurementUnit').text(val.measurementunit);
                        $line.attr('data-qiid', val.qiid);
                    }

                });
                return v;
            }
        });


        $lineInfoWrap.find(".hardNum input").on("change",function(){
            com.clearValidator();
            if(com.validate("addPopUp","top")){
                return false;
            }
            calcTotal($lineInfoWrap);
        })

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));
        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            e.stopPropagation();
            com.clearValidator();
            if(com.validate("addPopUp","top")){
                return false;
            }

            calcTotal($lineInfoWrap);
        });

        $btndel.click(function (e) {
            e.stopPropagation();
            $line.remove();
            return;
        });

        return $line;

    }

    $("#form").find("#submitHardwareItem").click(function () {

        var options = {};
        var $lines = $('.line', '#list');
        var returnFlag = false;
        com.clearValidator();
        $lines.each(function (i) {
            var $this = $(this);

            if (com.validate("addPopUp","top")) {
                returnFlag = true;
            }

            options["hardwareItems[" + i + "].name"] = $this.find('.name input').val();                //– 名称
            options["hardwareItems[" + i + "].unitprice"] = $this.find('.unitPrice').text();               //– 单价
            options["hardwareItems[" + i + "].num"] = $this.find('.hardNum input').val();                   //– 数量
            options["hardwareItems[" + i + "].measurementunit"] = $this.find('.measurementUnit').text();  //- 单位
            options["hardwareItems[" + i + "].total"] = $this.find('.total').text();                        //- 总价
            options["hardwareItems[" + i + "].comment"] = $this.find('.comment input').val();               //- 备注

        });

        if (returnFlag) return;

        options["hardware.hid"] = $popup.attr('data-hid');

        com.post(api.production.addHardwareItem, options, function (res) {
            $('#list').empty();
            addline(1).addClass('current').appendTo('#list');
            layer.msg("添加成功", {icon: 1, time: 2e3});
        }, function (e) {
            layer.msg("添加失败", {icon: 2, time: 2e3})
        })

    })

    function calcTotal($lineInfoWrap){
        var _num = $lineInfoWrap.find('.hardNum input').val();
        var _unitPrice = $lineInfoWrap.find('.unitPrice').attr('data-unitPrice');
        var _total = utils.accMul(parseFloat(_num+''),parseFloat(_unitPrice+''));
        $lineInfoWrap.find('.total').text(_total);
    }

});

