/**
 * 定额拆单视图: 按功能区分组展示定额明细(工费/材料/工时), 支持行内修改数量.
 * 数据链: queryQuotationFunctionAreaForCommonByQuotationId(区骨架) + queryNormxxxItem(明细, 已滤禁用行)
 * 写链: updateNormriceItemForNum / updateNormoodItemForNum / updateNormtimeItemForNum (数量千倍换算走 tranargs)
 * 说明: makeNormtion 全量重算会把 type=0/1/2 行数量重置回报价口径, 手工调整属临时修正(方案A);
 *       工费项(type=3)已确认行改数量后端自动回退待确认重走确认流.
 */
var NormtionSplit = (function () {

    var split = {
        quotationId: null,
        orderid: null,
        historyPage: null,

        areas: [],          // 功能区骨架
        riceItems: [],      // 工费明细(INIT全型 + type=3已确认)
        oodItems: [],       // 材料明细(INIT全型)
        timeItems: [],      // 工时明细(INIT全型)
    };

    // 来源类型文案: normoodItem/normriceItem 走后端常量字典, normtimeItem 字典无此clazz用裸映射
    function riceTypeNames() {
        var c = constant.quotation().normriceItem;
        return { normtype: { 1: "附加" }, type: c.type.keys };
    }

    function oodTypeNames() {
        var c = constant.quotation().normoodItem;
        return { normtype: c.normtype.keys, type: c.type.keys };
    }

    function timeTypeNames() {
        return { normtype: { 1: "附加" }, type: { 0: "报价", 1: "拓展", 2: "增减", 3: "定额" } };
    }

    var painter = {

        // 区容器: 一区一widget-box, 区内工费/材料/工时三段
        createAreaDomain: function (area, sections) {

            var $domain = $('<div></div>').addClass('widget-box transparent').css({ "margin-bottom": "20px" });

            var $dhead = $('<div></div>').addClass('widget-header');
            var $dname = $('<h5></h5>').append($('<em></em>').text(area.em || '')).append('  ').append($('<strong></strong>').html(area.title));
            var $dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');
            var $btnFold = $('<a></a>').attr({ "href": "javascript:void(0)", "data-action": "collapse" }).css({ "padding-left": "5px" }).append('<i class="bigger-125 icon-chevron-up"></i>');
            $dtoolbar.append($btnFold);
            $dhead.append($dname).append($dtoolbar);

            var $dbody = $('<div></div>').addClass('widget-body');
            var $dbodyInner = $('<div></div>').addClass('widget-body-inner');

            $.each(sections, function (i, section) {
                $dbodyInner.append(painter.createSection(section));
            });

            $dbody.append($dbodyInner);
            $domain.append($dhead).append($dbody);

            return $domain;
        },

        // 一段列表: cols=[字段:宽度%], titles={字段:表头}
        createSection: function (section) {

            var $wrap = $('<div></div>');

            var $headUl = $('<ul></ul>').addClass('fl-quo-list');
            var $headLi = $('<li></li>').addClass('fl-quo-item');

            $.each(section.cols, function (i, v) {
                var pair = v.split(":");
                $headLi.append(painter.cellOf(pair[1] + "%", section.titles[pair[0]] || "", true));
            });

            $headUl.append($headLi);
            $wrap.append($headUl);

            var $ul = $('<ul></ul>').addClass('fl-quo-list items');

            if (!section.rows.length) {
                var $empty = $('<li></li>').addClass('fl-quo-item item');
                $empty.append(painter.cellOf("100%", "无项目"));
                $ul.append($empty);
            } else {
                $.each(section.rows, function (i, v) {
                    $ul.append(section.rowPainter($ul, i + 1, v));
                });
            }

            $wrap.append($ul);

            return $wrap;
        },

        cellOf: function (width, content, isHead) {
            var $cell = $('<div></div>').addClass('cell').css({ "flex": "0 0 auto", "width": width });
            if (isHead) $cell.css({ "font-weight": "bold" });
            $('<span></span>').addClass('cell-wrap').html(content).appendTo($cell);
            return $cell;
        },

        // 工费行: 节点/单位/单价/数量(可改)/金额/来源/状态
        riceRow: function ($ul, linenum, v) {

            var num = parseFloat(v.trannum == '0' ? 1 : v.num);
            var trannum = parseFloat(v.trannum == '0' ? 1 : v.trannum);
            var salary = parseFloat(v.salary);

            var names = riceTypeNames();
            var _typeName = v.normtype == 1 ? names.normtype[1] : (names.type[v.type] || "-");
            var _status = v.status == 2 ? '<span class="label label-success">已确认</span>' : '<span class="label label-warning">待确认</span>';

            var _title = v.constructionNode ? v.constructionNode.name : "";
            if (v.name && v.name != _title) _title = _title + " (" + v.name + ")";

            var $item = $('<li></li>').addClass('fl-quo-item item').attr({ "data-npiid": v.npiid });

            $item.append(painter.cellOf("5%", linenum));
            $item.append(painter.cellOf("20%", _title));
            $item.append(painter.cellOf("8%", v.unit));
            $item.append(painter.cellOf("10%", salary));
            $item.append(painter.numInputCell("12%", v.num, { api: api.quotation.updateNormriceItemForNum, idKey: "npiid", id: v.npiid, paramKey: "normriceItem", oldValue: v.num, quota: v.type == 3 && v.status == 2 }));
            $item.append(painter.cellOf("12%", utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, num), salary))));
            $item.append(painter.cellOf("10%", _typeName));
            $item.append(painter.cellOf("13%", _status));
            $item.append(painter.cellOf("10%", ""));

            return $item;
        },

        // 材料行: 定材/定额单位/定额数量(可改)/库房单位/库房数量(可改)/来源
        oodRow: function ($ul, linenum, v) {

            var names = oodTypeNames();
            var _typeName = v.normtype == 1 ? names.normtype[1] : (names.type[v.type] || "-");

            var $item = $('<li></li>').addClass('fl-quo-item item').attr({ "data-ngiid": v.ngiid });

            $item.append(painter.cellOf("5%", linenum));
            $item.append(painter.cellOf("24%", v.noods.name));
            $item.append(painter.cellOf("9%", v.normunit));
            $item.append(painter.oodNumCell("12%", v.normnum, v, "normnum"));
            $item.append(painter.cellOf("9%", v.storeunit));
            $item.append(painter.oodNumCell("12%", v.storenum, v, "storenum"));
            $item.append(painter.cellOf("10%", _typeName));
            $item.append(painter.cellOf("9%", ""));
            $item.append(painter.cellOf("10%", ""));

            return $item;
        },

        // 材料数量输入: normnum/storenum 双输入成对提交(各自独立修改, 提交携带另一格当前值)
        oodNumCell: function (width, value, v, field) {

            var $cell = $('<div></div>').addClass('cell').css({ "flex": "0 0 auto", "width": width });
            var $input = $('<input type="text">').addClass('v_float').attr("data-field", field).css({ "width": "90px", "height": "24px" }).val(value);
            $cell.append($input);

            $input.on('blur', function () {
                commit();
            }).on('keydown', function (e) {
                if (e.keyCode == 13) { $input.blur(); }
            });

            function commit() {

                var val = $input.val();

                if (val === "" || isNaN(val)) {
                    $input.val(value);
                    return;
                }

                if (parseFloat(val) == parseFloat(value)) {
                    return;
                }

                var otherField = field == "normnum" ? "storenum" : "normnum";
                var $other = $input.parents('li').find('input[data-field="' + otherField + '"]');

                com.post(api.quotation.updateNormoodItemForNum, {
                    "normoodItem.ngiid": v.ngiid,
                    "normoodItem.normnum": field == "normnum" ? val : $other.val(),
                    "normoodItem.storenum": field == "storenum" ? val : $other.val()
                }, function (res) {
                    com.showAlert(com.info, "数量已更新");
                    reload();
                });
            }

            return $cell;
        },

        // 数量输入格: 失焦/回车提交(工费/工时行通用)
        numInputCell: function (width, value, opt) {

            var $cell = $('<div></div>').addClass('cell').css({ "flex": "0 0 auto", "width": width });
            var $input = $('<input type="text">').addClass('v_float').css({ "width": "90px", "height": "24px" }).val(value);
            $cell.append($input);

            $input.on('blur', function () {
                commit();
            }).on('keydown', function (e) {
                if (e.keyCode == 13) { $input.blur(); }
            });

            function commit() {

                var val = $input.val();

                if (val === "" || isNaN(val)) {
                    $input.val(value);
                    return;
                }

                if (parseFloat(val) == parseFloat(opt.oldValue)) {
                    return;
                }

                var _param = {};
                _param[opt.paramKey + "." + opt.idKey] = opt.id;
                _param[opt.paramKey + ".num"] = val;

                com.post(opt.api, _param, function (res) {

                    com.showAlert(com.info, "数量已更新");

                    if (opt.quota) {
                        com.showAlert(com.warning, "已确认附加项数量变更, 状态已回退待确认");
                    }

                    reload();
                });
            }

            return $cell;
        },

        // 工时行: 节点/单位/工时天数/数量(可改)/总额/来源
        timeRow: function ($ul, linenum, v) {

            var num = parseFloat(v.trannum == '0' ? 1 : v.num);
            var trannum = parseFloat(v.trannum == '0' ? 1 : v.trannum);
            var workdays = parseFloat(v.workdays);

            var names = timeTypeNames();
            var _typeName = v.normtype == 1 ? names.normtype[1] : (names.type[v.type] || "-");

            var $item = $('<li></li>').addClass('fl-quo-item item').attr({ "data-ntiid": v.ntiid });

            $item.append(painter.cellOf("5%", linenum));
            $item.append(painter.cellOf("24%", v.constructionNode ? v.constructionNode.name : ""));
            $item.append(painter.cellOf("10%", v.unit));
            $item.append(painter.cellOf("12%", workdays + " 天"));
            $item.append(painter.numInputCell("12%", v.num, { api: api.quotation.updateNormtimeItemForNum, idKey: "ntiid", id: v.ntiid, paramKey: "normtimeItem", oldValue: v.num }));
            $item.append(painter.cellOf("12%", utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, num), workdays))));
            $item.append(painter.cellOf("12%", _typeName));
            $item.append(painter.cellOf("13%", ""));

            return $item;
        }
    };

    // 工费项全集 = INIT全型 + type=3的INIT/CONFIRMED(queryNormriceItemByType), 按npiid去重
    function mergeRiceItems(initItems, quotaItems) {

        var merged = [];
        var exists = {};

        $.each(initItems, function (i, v) {
            if (!exists[v.npiid]) { exists[v.npiid] = true; merged.push(v); }
        });

        $.each(quotaItems, function (i, v) {
            if (!exists[v.npiid]) { exists[v.npiid] = true; merged.push(v); }
        });

        return merged;
    }

    // 按areald归区, 未匹配(含0)归extra
    function groupByArea(items) {

        var grouped = {};
        var extra = [];

        $.each(items, function (i, v) {

            var hit = null;

            $.each(split.areas, function (j, a) {
                if (a.qfaId == v.areald) { hit = a; return false; }
            });

            if (hit) {
                (grouped[hit.qfaId] = grouped[hit.qfaId] || []).push(v);
            } else {
                extra.push(v);
            }
        });

        return { grouped: grouped, extra: extra };
    }

    function render() {

        var riceGroup = groupByArea(split.riceItems);
        var oodGroup = groupByArea(split.oodItems);
        var timeGroup = groupByArea(split.timeItems);

        var $list = com.focusPage('#functionAreaSplitList').html('');

        $.each(split.areas, function (i, area) {

            var qfaId = area.qfaId;

            $list.append(painter.createAreaDomain({
                title: area.functionAreaName,
                em: area.functionAreaOrder
            }, [
                {
                    cols: ["line:5", "name:20", "unit:8", "num:10", "formula:12", "totalPrice:12", "type:10", "status:13", "head:10"],
                    titles: { line: "#", name: "名称", unit: "单位", num: "单价", formula: "数量", totalPrice: "金额", type: "来源", status: "状态", head: "" },
                    rows: riceGroup.grouped[qfaId] || [],
                    rowPainter: painter.riceRow
                },
                {
                    cols: ["line:5", "name:24", "unit:9", "formula:12", "unit2:9", "num:12", "type:10", "status:9", "head:10"],
                    titles: { line: "#", name: "定材", unit: "定额单位", formula: "定额数量", unit2: "库房单位", num: "库房数量", type: "来源", status: "", head: "" },
                    rows: oodGroup.grouped[qfaId] || [],
                    rowPainter: painter.oodRow
                },
                {
                    cols: ["line:5", "name:24", "unit:10", "num:12", "formula:12", "totalPrice:12", "type:12", "status:13"],
                    titles: { line: "#", name: "节点", unit: "单位", num: "工时", formula: "数量", totalPrice: "总额", type: "来源", status: "" },
                    rows: timeGroup.grouped[qfaId] || [],
                    rowPainter: painter.timeRow
                }
            ]));
        });

        // 附加/未分区块 (areald=0或区外: 页面新增的自定义/字典行)
        if (riceGroup.extra.length || oodGroup.extra.length || timeGroup.extra.length) {
            $list.append(painter.createAreaDomain({
                title: "附加项",
                em: ""
            }, [
                {
                    cols: ["line:5", "name:20", "unit:8", "num:10", "formula:12", "totalPrice:12", "type:10", "status:13", "head:10"],
                    titles: { line: "#", name: "名称", unit: "单位", num: "单价", formula: "数量", totalPrice: "金额", type: "来源", status: "状态", head: "" },
                    rows: riceGroup.extra,
                    rowPainter: painter.riceRow
                },
                {
                    cols: ["line:5", "name:24", "unit:9", "formula:12", "unit2:9", "num:12", "type:10", "status:9", "head:10"],
                    titles: { line: "#", name: "定材", unit: "定额单位", formula: "定额数量", unit2: "库房单位", num: "库房数量", type: "来源", status: "", head: "" },
                    rows: oodGroup.extra,
                    rowPainter: painter.oodRow
                },
                {
                    cols: ["line:5", "name:24", "unit:10", "num:12", "formula:12", "totalPrice:12", "type:12", "status:13"],
                    titles: { line: "#", name: "节点", unit: "单位", num: "工时", formula: "数量", totalPrice: "总额", type: "来源", status: "" },
                    rows: timeGroup.extra,
                    rowPainter: painter.timeRow
                }
            ]));
        }

        refreshSummary();
    }

    function refreshSummary() {

        var normnumtotal = 0, storenumtotal = 0, ricetotal = 0, timetotal = 0;
        var rulenodes = {};

        $.each(split.oodItems, function (i, v) {
            normnumtotal = utils.changeThrDecimal(utils.accAdd(normnumtotal, utils.accMul(v.normnum, v.atttype == "0" ? 1 : -1)));
            storenumtotal = utils.changeThrDecimal(utils.accAdd(storenumtotal, utils.accMul(v.storenum, v.atttype == "0" ? 1 : -1)));
        });

        $.each(split.riceItems, function (i, v) {

            var num = parseFloat(v.trannum == '0' ? 1 : v.num);
            var trannum = parseFloat(v.trannum == '0' ? 1 : v.trannum);
            var salary = parseFloat(v.salary);

            var _total = utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, num), salary));

            ricetotal = utils.changeThrDecimal(utils.accAdd(ricetotal, utils.accMul(_total, v.atttype == "0" ? 1 : -1)));

            if (v.constructionNode) {
                var _sort = v.constructionNode.sort;
                rulenodes["#rsn_" + _sort] = utils.changeThrDecimal(utils.accAdd(rulenodes["#rsn_" + _sort] || 0, utils.accMul(_total, v.atttype == "0" ? 1 : -1)));
            }
        });

        $.each(split.timeItems, function (i, v) {

            var num = parseFloat(v.trannum == '0' ? 1 : v.num);
            var trannum = parseFloat(v.trannum == '0' ? 1 : v.trannum);
            var workdays = parseFloat(v.workdays);

            var _total = utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, num), workdays));

            timetotal = utils.changeThrDecimal(utils.accAdd(timetotal, utils.accMul(_total, v.atttype == "0" ? 1 : -1)));
        });

        com.focusPage('#splitNormnumTotal').text(normnumtotal);
        com.focusPage('#splitStorenumTotal').text(storenumtotal);
        com.focusPage('#splitRiceTotal').text(ricetotal);
        com.focusPage('#splitTimeTotal').text(timetotal);

        com.focusPage("#splitRiceNodeList").find(".rsn").each(function (i, e) {
            $(e).text(0);
        });

        $.each(rulenodes, function (k, v) {
            var $node = com.focusPage(k);
            if ($node) $node.text(v);
        });
    }

    function reload() {

        com.post(api.quotation.queryNormriceItem, { "normriceItem.qid": split.quotationId }, function (res) {

            var initItems = res.normriceItems || [];

            com.post(api.quotation.queryNormriceItemByType, { "normriceItem.qid": split.quotationId, "normriceItem.type": 3 }, function (res2) {

                split.riceItems = mergeRiceItems(initItems, res2.normriceItems || []);

                com.post(api.quotation.queryNormoodItem, { "normoodItem.qid": split.quotationId }, function (res3) {

                    split.oodItems = res3.normoodItems || [];

                    com.post(api.quotation.queryNormtimeItem, { "normtimeItem.qid": split.quotationId }, function (res4) {

                        split.timeItems = res4.normtimeItems || [];
                        render();

                    }, null, false);
                }, null, false);
            }, null, false);
        }, null, false);
    }

    return {
        init: function () {

            split.historyPage = params.historyPage;
            split.orderid = params.quotation.orderId;

            split.quotationId = params.quotation.quotation ? params.quotation.quotation.qid : null;

            if (!params.quotation.editFlg || !split.quotationId) {
                com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                    'quotation.orderId': split.orderid
                }, function (res) {
                    split.quotationId = res.quotation.qid;
                }, null, false);
            }

            if (!split.quotationId) {
                com.showAlert(com.warning, "默认报价不存在");
                com.switchPage(split.historyPage);
                return false;
            }

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": split.orderid
            }, function (res) {
                com.focusPage('#splitOrderId').text(res.decoration.orderId);
                com.focusPage('#splitAddress').text(res.decoration.house.village.name + " " + res.decoration.house.houseNumber);
                com.focusPage('#splitVersion').text(res.decoration.version.name);
            }, null, false);

            // 工费节点汇总行
            com.post(api.data.queryConstructionNode, {}, function (res) {

                var $nodeList = com.focusPage("#splitRiceNodeList");

                $.each(res.constructionNodes || [], function (i, v) {
                    var $group = $('<div class="form-group"></div>').appendTo($nodeList);
                    $('<label class=" col-md-6 no-padding-right"></label>').text(v.name + "总额").appendTo($group);
                    $('<label class=" col-md-6 no-padding-left rsn"></label>').attr("id", "rsn_" + v.sort).text(0).appendTo($group);
                });

            }, null, false);

            // 区骨架
            com.post(api.quotation.queryQuotationFunctionAreaForCommonByQuotationId, {
                "quotation.qid": split.quotationId
            }, function (res) {

                split.areas = (res.quotationFunctionAreas || []).sort(function (a, b) {
                    return (a.functionAreaOrder || 0) - (b.functionAreaOrder || 0);
                });

                reload();

            }, null, false);

            com.focusPage('#splitBackBtn').on('click', function () {
                com.showConfirm("当前页面存在重要数据,是否进行当前操作", function () {
                    com.switchPage(split.historyPage);
                    com.closePopover();
                });
            });

            com.focusPage('#splitOpenAreasBtn').on('click', function () {
                com.focusPage('.icon-chevron-down').parent().trigger('click');
            });

            com.focusPage('#splitCloseAreasBtn').on('click', function () {
                com.focusPage('.icon-chevron-up').parents('[data-action="collapse"]').trigger('click');
            });
        }
    };

})();

$(function () {
    NormtionSplit.init();
});
