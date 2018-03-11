/**
 * Created by Administrator on 2017/4/17.
 */
jQuery(function ($) {

    $('#editPopUp').css({'margin': '0 auto', 'margin-top': '2%', 'width': '98%'});

    var accessoriesItem = {
        aid: $('#editPopUp').attr('data-aid'),
        saveBtn: $("#saveBtn"),
        cancellBtn: $("#cancelBtn"),
        manifestItems: {
            customerName: $("#customer"),
            des: $("#comment"),
        },
        record: {},
        validator: {
            num: {
                type: "v_num",
                regex: /^[0-9]*[1-9][0-9]*$/,
                errorMsg: "数量输入内容格式错误"
            }
        }

    };

    $.extend(com.validator, accessoriesItem.validator);

    $('#addSaleOrder').click(function () {
        var num = $('.line', '#list').length;

        var $line = addline(num + 1);
        $line.appendTo('#list');
    });


    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col7');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass: "no blue"},//编号
            {cellClass: "name grey", hasInput: !0},//名称
            {cellClass: "category grey"},//品类
            {cellClass: "brand grey"},//品牌
            {cellClass: "measurementUnit grey"},//单位
            {cellClass: "number", hasInput: !0},//数量
            {cellClass: "pieceNum blue"},//件数
        ];
        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');
        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable v_required');
                if(v.cellClass == "number"){
                    $input.addClass('v_num');
                }
                $cell.append($input);
            }
            $cell.appendTo($lineInfoWrap);

        });

        $lineInfoWrap.find('.name input').typeahead({
            url: api.inventory.queryGoodsByName,
            list: [],
            postData: {},
            source: function (query, process) {
                var params = $.extend({"goods.name": query,"goods.pinyin":query,"goods.no":query}, this.options.postData);
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
                        $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                        $lineInfoWrap.find('.category').text(val.category);
                        $lineInfoWrap.find('.brand').text(val.brand);
                        $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                        $line.attr({'data-gid': val.gid,'data-name':val.name});
                    }
                });

                return v;
            }

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            e.stopPropagation();

            if(com.validate('list','bottom')){
                return;
            }

            var options = {};
            var aiid = $line.attr('data-aiid');
            var flag = true;

            if (aiid == null) {
                options = {
                    "accessories.aid": accessoriesItem.aid,
                    "accessoriesItem.goods.gid": $line.attr('data-gid'),
                    //"accessoriesItem.color.cid": $line.find('.color select option:selected').val(),
                    //"accessoriesItem.format.fid": $line.find('.format select option:selected').val(),
                    "accessoriesItem.num": $line.find('.number input').val()
                };
                if (checkRowValue($line)) {
                    com.post(api.inventory.addAccessoriesItem, options, function (data) {
                        $line.attr('data-aiid', data.accessoriesItem.aiid);
                        layer.msg('添加成功!', {icon: 1});
                        $line.find('.name').html($line.attr('data-name'));
                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    });
                }

            } else {
                if (checkRowValueNum($line)) {
                    com.post(api.inventory.updateAccessoriesItem, {
                        "accessoriesItem.aiid": aiid,
                        "accessoriesItem.num": $line.find('.number input').val()
                    }, function (data) {
                        layer.msg('更新成功!', {icon: 1});
                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    });
                }
            }

        });





        $btndel.click(function (e) {
            e.stopPropagation();
           // --补充判断 空行删除
            if(!$(this).parents('li.line').attr('data-aiid')){
                $line.remove();
                return;
            }
            com.post(api.inventory.deleteAccessoriesItem, {
                "accessoriesItem.aiid": $line.attr('data-aiid')
            }, function (data) {
                layer.msg('删除成功!', {icon: 1});
                $line.remove();
            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            });


        });

        return $line;

    }


    function checkRowValue($line) {

        var flag = true;

        var num = $line.find('.number input');
        var numRex = /^\d+$/;
        if (!(numRex.test(num.val()) && parseFloat(num.val()) >= 1)) {
            num.focus().select();
            num.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "数量输入内容格式错误!"
            }).popover('show');
            flag = false;
        } else {
            num.popover('destroy');
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

        if (!$line.attr('data-name')) {
            name.focus().select();

            name.addClass('popover-notitle').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "主材填写不正确"

            }).popover('show');

            flag = false;
        } else {
            name.popover('destroy');
        }

        return flag;
    }

    function checkRowValueNum($line) {

        var flag = true;

        var num = $line.find('.number input');
        var numRex = /^\d+$/;
        if (!(numRex.test(num.val()) && parseFloat(num.val()) >= 1)) {
            num.focus().select();
            num.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "数量输入内容格式错误!"
            }).popover('show');
            flag = false;
        } else {
            num.popover('destroy');
        }

        return flag;
    }


    function accessoriesAdd() {
        var aid = accessoriesItem.aid;
        var index = $('.line', '#list').length;
        com.post(api.inventory.queryAccessoriesItemByAid, {
            "accessoriesItem.aid": aid
        }, function (res) {
            for (var i = 0; i < res.accessoriesItems.length; i++) {
                index = $('.line', '#list').length;
                autoAddline(index);
            }
            function autoAddline(index) {
                index = $('.line', '#list').length;
                addline(1 + index).appendTo('#list');
                var $lineInfoWrap1 = $('#list li:nth-of-type(' + (index + 1) + ') div.content');
                $('#list li:nth-of-type(' + (index + 1) + ')').attr({
                    'data-gid': res.accessoriesItems[i].goods.gid,
                    'data-aiid': res.accessoriesItems[i].aiid
                });

                $lineInfoWrap1.find('div.no').text(res.accessoriesItems[i].goods.no);
                $lineInfoWrap1.find('div.name').text(res.accessoriesItems[i].goods.name);
                $lineInfoWrap1.find('div.category').text(res.accessoriesItems[i].goods.category);
                $lineInfoWrap1.find('div.brand').text(res.accessoriesItems[i].goods.brand);
                $lineInfoWrap1.find('div.measurementUnit').text(res.accessoriesItems[i].goods.measurementUnit);
                $lineInfoWrap1.find('div.number input').val(res.accessoriesItems[i].num);
                $lineInfoWrap1.find('div.pieceNum').text(res.accessoriesItems[i].goods.pieceNum);
            }
        });
    }

    accessoriesAdd();


});
