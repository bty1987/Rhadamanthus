jQuery(function($) {

    var category = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        type: {},
        isCoupon: {},
        isCount: {},
        repeatFlg: false,

        validator: {
            categoryId: {
                type: "v_categoryId",
                regex: /^C_\d{3}$/g,
                errorMsg: "请以C_作为前缀 , 之后以三位数字组成(如C_001)."
            }
        },
        
        cid: null,
    };

    category.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    category.cancelBtn = com.focusPage("#cancelBtn");

    category.modal = com.focusPage("#categoryModal").on('show.bs.modal', function(e) {

        com.clearValidator();
        com.clearValidator("#no", true);
    });

    category.items.cId = com.focusPage("#cId");
    category.items.no = com.focusPage("#no");
    category.items.categoryName = com.focusPage("#categoryName");
    category.items.kino = com.focusPage("#kino");
    category.items.kiname = com.focusPage("#kiname");
    category.items.type = com.focusPage("#type");
    category.items.isCoupon = com.focusPage("#isCoupon");
    category.items.isCount = com.focusPage("#isCount");
    category.items.isLimit = com.focusPage("#isLimit");

    // com.post(api.ds.data, {}, function(res) {
    //
    // category.items.type.bindData(res.categoryType, "key", "value");
    // });

    category.items.type.bindData(constant.data.category.type.datas, 'key', 'value');
    category.items.isCoupon.bindData(constant.data.category.isCoupon.datas, 'key', 'value');
    category.items.isCount.bindData(constant.data.category.isCount.datas, 'key', 'value');
    category.items.isLimit.bindData(constant.data.category.isLimit.datas, 'key', 'value');

    $.extend(com.validator, category.validator);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (!listData || listData.length == 0)
                return false;
            
            $.each(listData, function(i, v) {

                creatLine(v).appendTo($ul);
            });

            $ul.appendTo($tableWrap);
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no + " " + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

            var propertyArr = [["类型: ", constant.data().category.type.keys[v.type], "red"], ["券标识: ", constant.data().category.isCoupon.keys[v.isCoupon], "red"], ["统计标识: ", constant.data().category.isCount.keys[v.isCount], "red"], ["选材控制: ", constant.data().category.isLimit.keys[v.isLimit], "red"], ["金蝶编号: ", com.checkNull(v.kino, "无"), "grey"], ["金蝶名称: ", com.checkNull(v.kiname, "无"), "grey"], ];

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

        category.cid = null;

        com.cleanItems(category.items);

        category.items.no.css("display", "none");

        category.modal.modal("show");
    });

    function editCategory(v) {

        category.cid = v.cid;

        category.items.cId.val(v.cid);
        category.items.no.val(v.no).attr("disabled", "true").css("display", "block");
        category.items.categoryName.val(v.name);
        category.items.kino.val(v.kino);
        category.items.kiname.val(v.kiname);
        category.items.type.val(v.type);
        category.items.isCoupon.val(v.isCoupon);
        category.items.isCount.val(v.isCount);
        category.items.isLimit.val(v.isLimit);

        category.modal.modal("show");
    }

    function saveData() {

        if (com.validate("categoryModal") || category.repeatFlg) {
            return false;
        }

        var url = api.data.addCategory;
        var options = {
            'category.no': category.items.no.val(),
            'category.name': category.items.categoryName.val(),
            'category.kino': category.items.kino.val(),
            'category.kiname': category.items.kiname.val(),
            'category.type': category.items.type.val(),
            'category.isCoupon': category.items.isCoupon.val(),
            'category.isCount': category.items.isCount.val(),
            'category.isLimit': category.items.isLimit.val(),
        };

        if (category.cid) {
            url = api.data.updateCategory;
            options['category.cid'] = category.items.cId.val();
        }

        com.post(url, options, function(res) {

            searcher.doSearch();

            var no = res.category.no;

            if (category.cid)
                no = category.items.no.val();

            var categoryData = {
                "no": no,
                "name": category.items.categoryName.val(),
                "companyName": "方林集团"
            };

            kingdeeUtils.category(categoryData);
        });

        category.modal.modal("hide");
    }

});
