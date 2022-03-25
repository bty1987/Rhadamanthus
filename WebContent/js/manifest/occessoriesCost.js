jQuery(function($) {

    var occessories = {

        oid: params["occessoriesItem.oid"],
        ocid: null,

        items: {
            type: com.focusPage('#type', "#addOccessoriesCost"),
            price: com.focusPage('#price', "#addOccessoriesCost"),
            cost: com.focusPage('#cost', "#addOccessoriesCost"),
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn", "#addOccessoriesCost").on("click", saveData),

            addCostBtn: com.focusPage("#addCostBtn")
        },

        modals: {

        },

        types: [],

    };

    occessories.btns.addCostBtn.click(function() {

        com.cleanItems(occessories.items);

        occessories.ocid = null;

        com.popup4mini("#miniPopUp", "#addOccessoriesCost", "添加");
    });

    com.post(api.ds.manifest, {}, function(res) {
        occessories.items.type.bindData(res.occessoriesisCostType, "key", "value", false);
        occessories.types = res.occessoriesisCostType.split("key", "value");
    }, null, false);

    showlist();

    function showlist() {

        com.focusPage("#costList").html("");

        com.post(api.inventory.queryOccessoriesCost, {
            "occessoriesCost.oid": occessories.oid
        }, function(res) {
            renderList('costList', res.occessoriesCosts);
        }, null, false);
    }

    function renderList(tableId, listData) {

        var $tableWrap = com.focusPage('#' + tableId);

        if (listData && listData.length) {

            var $ulTitle = createTableTitle();
            var $ulData = $('<ul></ul>').addClass('flex-table');

            $tableWrap.append($ulTitle).append($ulData);

            $.each(listData, function(i, v) {
                creatLine(i, v, i == listData.length - 1).appendTo($ulTitle);
            });
        }
    }

    function createTableTitle() {

        var $ulTitle = $('<ul></ul>').addClass('flex-table');
        var $liTitle = $('<li></li>').addClass('line table-title');

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
        var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');

        var titleName = '原费用,费用,成本,类型';

        $.each(titleName.split(','), function(i, v) {
            $('<div></div>').addClass('cell').html(v).appendTo($contentWrap);
        });

        var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

        $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

        return $ulTitle;
    }

    function creatLine(i, v, lastFlag) {

        var $liLine = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
        var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
        var $endWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text("aaaaa"));

        var propertyArr = [[v.initPrice, 'blue'], [v.price, 'blue'], [v.cost, 'blue'], [occessories.types[v.type], 'red'], ];

        $.each(propertyArr, function(i, v) {
            var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
            $cell.appendTo($contentWrap);
        });

        var $optionWrap = $('<div></div>').addClass('line-wrap action');
        var $cellOption = $('<div></div>').addClass('cell option').appendTo($optionWrap);

        var $btnGroup = $('<div></div>').addClass('btn-group');
        var $btn = $('<button></button>').addClass('btn btn-info dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
        var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

        var $btndelete = $('<li></li>').append($('<a></a>').html('删除'));
        var $btnupdate = $('<li></li>').append($('<a></a>').html('编辑'));

        $btnUl.append($btnupdate).append($btndelete);

        $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

        $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

        $btndelete.click(function() {
            com.post(api.inventory.deleteOccessoriesCost, {
                "occessoriesCost.ocid": v.ocid
            }, function(res) {
                com.showAlert(com.info, "操作成功");
                $liLine.remove();
            });
        });

        $btnupdate.click(function() {

            com.cleanItems(occessories.items);

            occessories.items.price.val(v.price);
            occessories.items.cost.val(v.cost);
            occessories.items.type.val(v.type);

            occessories.ocid = v.ocid;

            com.popup4mini("#miniPopUp", "#addOccessoriesCost", "添加");
        })

        return $liLine;
    }

    function saveData() {

        if (com.validate('miniPopUp', 'right'))
            return false;

        var url = api.inventory.addOccessoriesCost;
        var options = {
            "occessoriesCost.oid": occessories.oid,
            "occessoriesCost.price": com.focusPage('#price', "#addOccessoriesCost").val(),
            "occessoriesCost.cost": com.focusPage('#cost', "#addOccessoriesCost").val(),
            "occessoriesCost.type": com.focusPage('#type', "#addOccessoriesCost").val(),
        };

        if (occessories.ocid) {
            url = api.inventory.updateOccessoriesCost;
            options["occessoriesCost.ocid"] = occessories.ocid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            com.closePopup(com.focusPage("#saveBtn", "#addOccessoriesCost"));

            showlist();
        });
    }

});
