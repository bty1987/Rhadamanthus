/**
 * Created by Administrator on 2016/9/23 0023.
 */


jQuery(function ($) {

    var manifest = {
        mid: $('#editPopUp').attr('data-mid'),
        mtype: parseInt($('#editPopUp').attr('data-type')),
        status: parseInt($('#editPopUp').attr('data-status')),
        saveBtn: $("#saveBtn"),
        cancellBtn: $("#cancelBtn"),
        manifestItems: {
            orderId: $("#orderId"),
            customerName: $("#customer"),
            des: $("#comment"),
        },
        record: {},

    };

    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        var storehousesStatus = [];

        $.each(res.storehouses,function(i,v){
            if(v.status==0){
                storehousesStatus.push(v);
            }
        })

        manifest.storehouses = storehousesStatus;
    }, null, false);

    var addSaleOrder = $('#addSaleOrder');

    addSaleOrder.click(function () {
        var num = $('.line', '#list').length;

        var $line = addline(num + 1);
        $line.appendTo('#list');
    })

    //添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet;

        _lineInfoSet = [
            {cellClass: "no"},//编号
            {cellClass: "name", hasInput: !0},//名称
            {cellClass: "color", hasSelectColor: !0},//颜色
            {cellClass: "format", hasSelectFormat: !0},//规格
            {cellClass: "measurementUnit"},//单位
            {cellClass: "storehouse", hasSelect: !0},//仓库
            {cellClass: "num", hasInput: !0},//数量
            {cellClass: "pieceNum"},//件数
            {cellClass: "price", hasInput: !0}, //价格
            {cellClass: "des", hasInput: !0},//备注
        ];

        var $btncheck = $('<a class="color-green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="color-red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                $cell.append($input);
            }

            if (v.hasSelect) {
                $select = $('<select></select>');
                $select.bindData(manifest.storehouses, "shId", "name");
                $cell.append($select);
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
                        $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                        $line.attr('data-pgid', val.gid);
                        $line.attr('data-gid', val.gid+'_'+lineindex);
                        com.post(api.inventory.queryColorForEnableByGid, {
                            "color.gid": val.gid
                        }, function (res) {
                            $('li[data-gid="' + val.gid + '_'+lineindex+'"] .color select').bindData(res.colors, "cid", "name");
                        })
                        com.post(api.inventory.queryFormatForEnableByGid, {
                            "format.gid": val.gid
                        }, function (res) {
                            $('li[data-gid="' + val.gid + '_'+lineindex+'"] .format select').bindData(res.formats, "fid", "info");
                        })
                    }
                });

                return v;
            }

        });


        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            cyclTotal();
            e.stopPropagation();
            var btn = $(this);
            btn.button('loading');
            var miid = $line.attr('data-miid');
            if ($line.attr('data-miid') == null) {
                var _params = {};
                if (manifest.mtype == 1) {
                    _params = {
                        "manifest.mid": manifest.mid,
                        "manifest.status": manifest.status,
                        "manifest.total": manifest.totalSum,
                        "manifest.type" : manifest.mtype,
                        "manifestItem.goods.gid": $line.attr('data-pgid'),
                        "manifestItem.color.cid": $line.find('.color select').val(),
                        "manifestItem.format.fid": $line.find('.format select').val(),
                        "manifestItem.instorehouse.shId": $line.find('.storehouse select').val(),
                        "manifestItem.num": $line.find('.num input').val(),
                        "manifestItem.unitPrice": $line.find('.price input').val(),
                        "manifestItem.comment": $line.find('.comment input').val()
                    }

                } else if (manifest.mtype == 3) {
                    _params = {
                        "manifest.mid": manifest.mid,
                        "manifest.status": manifest.status,
                        "manifest.total": manifest.totalSum,
                        "manifest.type" : manifest.mtype,
                        "manifestItem.goods.gid": $line.attr('data-pgid'),
                        "manifestItem.color.cid": $line.find('.color select').val(),
                        "manifestItem.format.fid": $line.find('.format select').val(),
                        "manifestItem.outstorehouse.shId": $line.find('.storehouse select').val(),
                        "manifestItem.num": $line.find('.num input').val(),
                        "manifestItem.unitPrice": $line.find('.price input').val(),
                        "manifestItem.comment": $line.find('.comment input').val()
                    }
                }
                if (checkRowValueByNew($line)) {
                    com.post(api.inventory.addManifestItem, _params, function (data) {
                        btn.button('reset');
                        $line.attr('data-miid', data.manifestItem.miId)
                        layer.msg('添加成功!', {icon: 1},function(){});
                        $line.find('.name').html($line.find('.name input').val());
                        $line.find('.color').html($line.find('.color select option:selected').text())
                        $line.find('.format').html($line.find('.format select option:selected').text())
                        $line.find('.storehouse').html($line.find('.storehouse select option:selected').text())
                        $line.find('.name input').remove();
                        $line.find('.color select').remove();
                        $line.find('.format select').remove();
                        $line.find('.storehouse select').remove();
                    }, function (e) {
                        btn.button('reset');
                        com.showAlert(com.info, e.errorMsg);
                    })
                }

            } else {
                var params = {};

                if (manifest.mtype == 1) {
                    params = {
                        "manifest.mid": manifest.mid,
                        "manifest.total": manifest.totalSum,
                        "manifestItem.miId": miid,
                        "manifestItem.instorehouse.shId": $line.find('.storehouse').attr('data-storehouse'),
                        "manifestItem.num": $line.find('.num input').val(),
                        "manifestItem.unitPrice": $line.find('.price input').val(),
                        "manifestItem.comment": $line.find('.comment input').val()
                    };
                } else if (manifest.mtype == 3) {
                    params = {
                        "manifest.mid": manifest.mid,
                        "manifest.total": manifest.totalSum,
                        "manifestItem.miId": miid,
                        "manifestItem.outstorehouse.shId": $line.find('.storehouse').attr('data-storehouse'),
                        "manifestItem.num": $line.find('.num input').val(),
                        "manifestItem.unitPrice": $line.find('.price input').val(),
                        "manifestItem.comment": $line.find('.comment input').val()
                    };
                }
                if (checkRowValue($line)) {
                    com.post(api.inventory.updateManifestItem, params, function (res) {
                        btn.button('reset');
                        layer.msg('更新成功', {icon: 1, time: 800});
                    }, function (e) {
                        btn.button('reset');
                        com.showAlert(com.info, e.errorMsg)
                    })
                }
            }

        });

        $btndel.click(function (e) {
            e.stopPropagation();
            var btn = $(this);
            btn.button('loading');
            layer.confirm('确定要删除吗？', {
                btn: ['确定', '取消'] //按钮
            }, function (indexo, layero) {
                $line.remove();
                reorder();
                if ([1, 2, 3, 4].indexOf(manifest.mid)) {
                    cyclTotal();
                }
                if ($line.attr('data-miid')) {
                    com.post(api.inventory.deleteManifestItem, {
                        "manifest.mid": manifest.mid,
                        "manifest.total":manifest.totalSum,
                        "manifestItem.miId": $line.attr('data-miid'),
                    }, function () {
                        btn.button('reset');
                        layer.msg('删除成功', {icon: 1});
                    }, function (e) {
                        btn.button('reset');
                        com.showAlert(com.info, e.errorMsg);
                    });
                }

                layer.close(indexo);
            }, function () {

            });

        });

        return $line;

    }

    function accessoriesAdd() {
        var index = $('.line', '#list').length;
        com.post(api.inventory.queryManifestItemByMId, {
            "manifest.mid": manifest.mid
        }, function (res) {
            for (var i = 0; i < res.manifestItems.length; i++) {
                index = $('.line', '#list').length;
                autoAddline(index);
            }
            function autoAddline(index) {
                index = $('.line', '#list').length;
                addline(1 + index).appendTo('#list');
                var $lineInfoWrap1 = $('#list li:nth-of-type(' + (index + 1) + ') div.content');
                $('#list li:nth-of-type(' + (index + 1) + ')').attr({
                    'data-gid': res.manifestItems[i].goods.gid,
                    'data-miid': res.manifestItems[i].miId
                });
                $lineInfoWrap1.find('div.no').text(res.manifestItems[i].goods.no);
                $lineInfoWrap1.find('div.name').text(res.manifestItems[i].goods.name);
                $lineInfoWrap1.find('div.measurementUnit').text(res.manifestItems[i].goods.measurementUnit);
                $lineInfoWrap1.find('div.color').text(res.manifestItems[i].color.name);
                $lineInfoWrap1.find('div.format').text(res.manifestItems[i].format.info);
                $lineInfoWrap1.find('div.pieceNum').text(res.manifestItems[i].goods.pieceNum);
                if (manifest.mtype == 1) {
                    $lineInfoWrap1.find('div.storehouse').attr('data-storehouse', res.manifestItems[i].instorehouse.shId).text(res.manifestItems[i].instorehouse.name);
                } else if (manifest.mtype == 3) {
                    $lineInfoWrap1.find('div.storehouse').attr('data-storehouse', res.manifestItems[i].outstorehouse.shId).text(res.manifestItems[i].outstorehouse.name);
                }
                $lineInfoWrap1.find('div.num input').val(res.manifestItems[i].num);
                $lineInfoWrap1.find('div.price input').val(res.manifestItems[i].purchasePrice);
            }

        })

    }

    accessoriesAdd();

    function checkRowValue($line) {

        var flag = true;

        var num = $line.find('.num input');
        var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
        if (!(numRex.test(num.val()) && parseFloat(num.val()) > 0)) {
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

        var price = $line.find('.price input');
        var priceRex = /^([0-9]+|[0-9]+\.[0-9]{1,2})$/;
        if (!(priceRex.test(price.val()) && parseFloat(price.val()) > 0)) {
            price.focus().select();
            price.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "售价输入内容格式错误!"

            }).popover('show');
            flag = false;
        } else {
            price.popover('destroy');
        }

        var des = $line.find('.des input');
        if (des.val() && des.val().length > 128) {
            des.focus().select();
            des.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "备注信息长度需要小于128!"
            }).popover('show');
            flag = false;
        } else {
            des.popover('destroy');
        }

        return flag;
    }

    function checkRowValueByNew($line) {

        var flag = true;

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


        var storehouse = $line.find('.storehouse select');
        if (!storehouse.val()) {
            storehouse.focus().select();

            storehouse.addClass('popover-notitle').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "请填写仓库名称"

            }).popover('show');

            flag = false;
        } else {
            storehouse.popover('destroy');
        }


        var num = $line.find('.num input');
        var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
        if (!(numRex.test(num.val()) && parseFloat(num.val()) > 0)) {
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


        var price = $line.find('.price input');
        var priceRex = /^([0-9]+|[0-9]+\.[0-9]{1,2})$/;
        if (!(priceRex.test(price.val()) && parseFloat(price.val()) > 0)) {
            price.focus().select();
            price.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "售价输入内容格式错误!"

            }).popover('show');
            flag = false;
        } else {
            price.popover('destroy');
        }


        var des = $line.find('.des input');
        if (des.val() && des.val().length > 128) {
            des.focus().select();
            des.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "备注信息长度需要小于128!"
            }).popover('show');
            flag = false;
        } else {
            des.popover('destroy');
        }

        return flag;
    }

    function cyclTotal() {

        var _total = 0;

        var $list = $('.line', '#list');
        $list.length && $list.each(function () {
            var $this = $(this);
            if ($this.find('.price input').val()) {
                _total = utils.accAdd(utils.accMul(parseFloat($this.find('.price input').val() + ''),$this.find('.num input').val()), _total);
            }
        });

        manifest.totalSum = _total;

        $("#totalSpan").text(_total);
    }

    function reorder() {
        var $list = $('.line', '#list');
        $list.length && $list.each(function (i) {
            var $this = $(this);
            $this.find('.index').text(i + 1)
        });
    }
});
