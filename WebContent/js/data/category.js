jQuery(function($) {

    var category = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        categoryItems: {},
        type: {},
        isCoupon: {},
        isCount: {},
        editFlg: false,
        repeatFlg: false,

        validator: {
            categoryId: {
                type: "v_categoryId",
                regex: /^C_\d{3}$/g,
                errorMsg: "请以C_作为前缀 , 之后以三位数字组成(如C_001)."
            }
        }
    };

    category.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    category.cancelBtn = com.focusPage("#cancelBtn");

    category.modal = com.focusPage("#categoryModal").on('show.bs.modal', function(e) {

        com.clearValidator();
        com.clearValidator("#no", true);
    });

    category.categoryItems.cId = com.focusPage("#cId");
    category.categoryItems.no = com.focusPage("#no");
    category.categoryItems.categoryName = com.focusPage("#categoryName");
    category.categoryItems.kino = com.focusPage("#kino");
    category.categoryItems.kiname = com.focusPage("#kiname");
    category.categoryItems.type = com.focusPage("#type");
    category.categoryItems.isCoupon = com.focusPage("#isCoupon");
    category.categoryItems.isCount = com.focusPage("#isCount");

    // com.post(api.ds.data, {}, function(res) {
    //
    //     category.categoryItems.type.bindData(res.categoryType, "key", "value");
    // });
    category.categoryItems.type.bindData(constant.data.category.type.datas, 'key', 'value');
    category.categoryItems.isCoupon.bindData(constant.data.category.isCoupon.datas, 'key', 'value');
    category.categoryItems.isCount.bindData(constant.data.category.isCount.datas, 'key', 'value');

    $.extend(com.validator, category.validator);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no + " " + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

            var propertyArr = [["金蝶编号: ", com.checkNull(v.kino, "无"), "grey"], ["金蝶名称: ", com.checkNull(v.kiname, "无"), "grey"], ["类型: ", constant.data().category.type.keys[v.type], "red"], ["券标识: ", constant.data().category.isCoupon.keys[v.isCoupon], "red"], ["统计标识: ", constant.data().category.isCount.keys[v.isCount], "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function() {

                editCategory(v);
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init(["data-category-name", "data-category-isCoupon", "data-category-isCount"], "condList", api.data.pageCategory, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "categoryPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('a[name="add"]', '#pagenation').click(function() {

        editFlg = false;

        com.cleanItems(category.categoryItems);

        category.categoryItems.no.css("display", "none");

        category.modal.modal("show");
    });

    function editCategory(v) {

        editFlg = true;

        category.categoryItems.cId.val(v.cid);
        category.categoryItems.no.val(v.no).attr("disabled", "true").css("display", "block");
        category.categoryItems.categoryName.val(v.name);
        category.categoryItems.kino.val(v.kino);
        category.categoryItems.kiname.val(v.kiname);
        category.categoryItems.type.val(v.type);
        category.categoryItems.isCoupon.val(v.isCoupon);
        category.categoryItems.isCount.val(v.isCount);

        category.modal.modal("show");
    }

    function saveData() {

        if (com.validate("categoryModal") || category.repeatFlg) {
            return false;
        }

        var url;
        var options = {
            'category.no': category.categoryItems.no.val(),
            'category.name': category.categoryItems.categoryName.val(),
            'category.kino': category.categoryItems.kino.val(),
            'category.kiname': category.categoryItems.kiname.val(),
            'category.type': category.categoryItems.type.val(),
            'category.isCoupon': category.categoryItems.isCoupon.val(),
            'category.isCount': category.categoryItems.isCount.val()
        };

        if (editFlg) {
            url = api.data.updateCategory;
            options['category.cid'] = category.categoryItems.cId.val();
        } else {
            url = api.data.addCategory;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();

            var no = res.category.no;

            if(editFlg) no = category.categoryItems.no.val();

            var categoryData = {
                "no": no,
                "name": category.categoryItems.categoryName.val(),
                "companyName": "方林集团"
            };

            kingdeeUtils.categoryToKingdee(categoryData);
        });

        category.modal.modal("hide");
    }

});
