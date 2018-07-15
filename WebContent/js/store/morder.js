var order = {};
jQuery(function ($) {

    var morder = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        editFlg: false
    };

    morder.saveBtn = $("#saveBtn").bindClick(saveData);
    morder.cancelBtn = $("#cancelBtn");
    morder.items.no = $("#no");
    morder.items.user = $("#user");
    morder.items.address = $("#address");
    morder.items.total = $("#total");
    morder.items.status = $("#status");
    morder.modal = $("#morderModal");
    morder.modal.on('show.bs.modal', function (e) {
        com.clearValidator();
        com.clearValidator("#no", true);
    });

    com.post(api.ds.store, {}, function (res) {
        $("#status").bindData(res.status, "key", "value");
        $.each(res.status, function (i, v) {
            status[v.key] = v.value;
        })
    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $deliver = $('<a></a>').addClass('btn btn-minier btn-yellow').html('发货');
            var $collect = $('<a></a>').addClass('btn btn-minier btn-yellow').html('收货');
            var $morderItem = $('<a></a>').addClass('btn btn-minier btn-success').html('订单项');

            var status = {
                "0": "待付款",
                "1": "待发货",
                "2": "已发货",
                "3": "待评价",
                "4": "退货",
                "5": "已删除",
                "6":"已完成"
            }

            var address = JSON.parse(v.address);

            var propertyArr = [
                ["用户:", address.name, "grey"],
                ["地址:", address.province + address.city + address.proper + address.address, "grey"],
                ["总价:", v.total, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["支付时间:", v.paymentTime, "green"],
                ["状态:", status[v.status], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if (v.status == "0") {
                $divBtnWrap.append($morderItem)
            }

            if (v.status == "1") {
                $divBtnWrap.append($deliver).append($morderItem)
            }

            if (v.status == "2") {
                $divBtnWrap.append($collect).append($morderItem)
            }

            if (v.status == "3" || v.status == "4" || v.status == "5" || v.status == "6") {
                $divBtnWrap.append($morderItem)
            }

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $deliver.click(function () {
                one(v.oid, status, function () {
                    layer.msg('成功', {icon: 1});
                    searcher.doSearch();
                });
            });

            $collect.click(function () {
                two(v.oid, status, function () {
                    layer.msg('成功', {icon: 1});
                    searcher.doSearch();
                });
            });

            $morderItem.click(function () {
                morderItem(v);
            });

            function one(id, status, callback) {
                bootbox.confirm("确认发货吗?", function (res) {

                    if (res) {
                        if (status != "1") {
                            com.post(api.store.updateMorderForStatus, {
                                "morder.oid": id,
                                "morder.status": "2"
                            }, function (res) {
                                callback();
                                searcher.doSearch();
                            })
                        }
                    }

                })
            }

            function two(id, status, callback) {
                bootbox.confirm("确认收货吗?", function (res) {

                    if (res) {
                        if (status != "2") {
                            com.post(api.store.updateMorderForStatus, {
                                "morder.oid": id,
                                "morder.status": "3"
                            }, function (res) {
                                callback();
                                searcher.doSearch();
                            })
                        }
                    }

                })
            }
            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();
    var _condArr = ['morderNo', "morderByStatus"];

    searcher.init(_condArr, "condList", api.store.pageMorder, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "Morder", null, false, null, function () {

    });

    function saveData() {
        var options = {
            'morder.oid': morder.items.oid,
            'morder.status': morder.items.status.val(),
        };
        com.post(api.store.updateMorderForStatus, options, function (res) {
            morder.modal.modal("hide");
            searcher.doSearch();
        });
    }

    function morderItem(v) {
        params["morder.oid"] = v.oid;
        com.switchPage(api.index.morders.url);
    }
});
