$(function() {

    var label = {};

    var displayFunc = (function() {
        var renderList = function(tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.userName));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
                    var $label = $('<a></a>').addClass('btn btn-minier btn-success').html('标签');

                    var propertyArr = [["员工编号:", v.userId, "grey"], ["用户名:", v.loginId, "grey"], ["部门:", v.dept.deptName, "grey"], ["职位:", v.duty.name, "grey"], ["角色:", v.role.name, "grey"], ["联系方式:", v.phone, "grey"]];

                    $.each(propertyArr, function(index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $divBtnWrap.append($btnEdit).append($label).appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);

                    $btnEdit.click(function() {

                        label.userId = v.userId;
                        label.uid = v.uid;

                        com.switchPage(api.index.checkUser.url);
                    });

                    $label.click(function() {
                        labelling(v);
                    })

                });
                $ul.appendTo($tableWrap);
            }
        };
        return {
            init: function(tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        }
    })();

    var _condArr = ['personel-userId', 'personel-userName', 'personel-deptType'];

    var searcher = new Searcher();

    searcher.init(_condArr, "condList", api.personel.pageUser, function(data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "selectUser", null, false, null, null);

    function labelling(v) {

        var $label = com.focusPage('#label');
        $label.attr({
            'data-uid': v.uiduid
        });

        params.data.label = v;

        com.popup4page($label, "/views/data/checkLabel.html", "标签管理")
    }

});