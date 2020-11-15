$(function () {

    var chainPage = {
        saveBtn: null,
        cancelBtn: null,
        items: {},
    };

    chainPage.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    chainPage.items.names = com.focusPage("#names");
    chainPage.items.url = com.focusPage("#url");
    chainPage.items.comment = com.focusPage("#comment");
    chainPage.items.companymark = com.focusPage("#companymark");

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(tableId,v);
                });
            }
        };

        var  creatLine = function (tableId,v) {

                    var $div = $('<div></div>').appendTo(com.focusPage('#' + tableId));
                    var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($div);
                    var $liLine = $('<li></li>').addClass('item-blue clearfix').appendTo($ul);
                    var $h3 = $('<h3 ></h3>').addClass('oid').append($('<small style="font-size:22px;"></small>').addClass('blue')).appendTo($liLine);var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').css({'margin-top': '10px'}).appendTo($h3);
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').appendTo($ulProperty);
                    var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger ').html('删除').appendTo($divBtnWrap);

                var propertyArr = [
                    ["名称:", v.name, "grey"],
                    ["地址:", v.url, "grey"],
                    ["说明:", v.comment, "grey"],
                ];

                $.each(propertyArr, function (index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong style="font-size:15px ; padding-bottom: 50px;"  ></strong>').html(value[0]).appendTo($liProperty);
                    $('<b style="font-size:15px;word-break: break-all;"></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);

                });

            $btnDel.click(function () {
                DeleChainPage(v.cpid);
            });

        };

        return {
            init: function (tableId, listData) {
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    search();
    function search(){
        com.post(api.data.queryChainPage, {}, function(v){
            var $div = $('<div></div>').appendTo(com.focusPage('#resultList'));
            var $h3 = $('<h3 style="font-size:22px;"></h3>').addClass('blue').html("外链").appendTo($div);
            displayFunc.init('resultList', v.chainPages);
        }, null, false);
    }

     function DeleChainPage(cpid) {
        com.post(api.data.deleteChainPage, {"chainPage.cpid": cpid}, function () {
            com.focusPage("#resultList").empty();
            search();
        });
    }

    com.focusPage("#addBtn").click(function () {
         com.cleanItems(chainPage.items);
        com.focusPage("#chainPageModal").modal("show");

    });

    function saveData() {
        
    	if(com.validate("chainPageModal")){
			return false;
		}

        com.post(api.data.addChainPage, {
            "chainPage.name": chainPage.items.names.val(),
            "chainPage.url": chainPage.items.url.val(),
            "chainPage.comment": chainPage.items.comment.val(),
            "chainPage.companymark": chainPage.items.companymark.prop("checked") ? 0 : 1

        }, function () {
            com.focusPage("#resultList").empty();
            search();
            });
        com.focusPage("#chainPageModal").modal("hide");
     }

});
