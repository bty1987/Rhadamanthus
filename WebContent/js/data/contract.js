jQuery(function ($) {
    
    var contract = {
        
        btns: {
            saveBtn: com.focusPage("#saveBtn")
        },
        
        items: {
            no: com.focusPage("#no"),
            name: com.focusPage("#name"),
            title: com.focusPage("#title"),
            page: com.focusPage("#page"),
            path: com.focusPage("#path"),
        },
        
        cid: null,
        
    }
    
    com.uploadify("#fileUpload", "上传模版", api.common.uploadOther, 'btn btn-success', '*.pdf', {'uploadType': 2}, 1, function(data){
        contract.items.path.val(data.resUrl);
    });
    
    contract.btns.saveBtn.click(saveData);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
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
            
            var $btnUpdate = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('更新');

            $divBtnWrap.append($btnUpdate).appendTo($h3);

            var propertyArr = [
                ["名称: ", v.name, "grey"],
                ["标题: ", v.title, "grey"],
                ["页面: ", v.page, "grey"],
                ["状态: ", v.status == 0 ? "启用" : "禁用" , "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);
            
            $btnUpdate.click(function(){
                
                contract.cid = v.cid;
                
                com.popup4model('#layerAdd', '编辑', null, function () {
                    com.clearValidator();
                }, function(){
                    initUpdate(v);
                });
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init(["data-contract-name"], "condList", api.data.pageContract, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "contractPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addContract').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            
            contract.cid = null;
            
            com.cleanItems(contract.items);
            
            com.popup4model('#layerAdd', '添加', null, function () {
                com.clearValidator();
            });
        });
        
        return [$adda];
    }, 'resultList');
    
    function initUpdate(v){
        
        contract.items.no.val(v.no);
        contract.items.name.val(v.name);
        contract.items.title.val(v.title);
        contract.items.page.val(v.page);
        contract.items.path.val(v.path);
    }
    
    function saveData(){
        
        if(com.validate('addContract')) return false;
        
        var url = api.data.addContract;
        var options = {
            "contract.no": contract.items.no.val(),
            "contract.name": contract.items.name.val(),
            "contract.title": contract.items.title.val(),
            "contract.page": contract.items.page.val(),
            "contract.path": contract.items.path.val(),
            "contract.url": config.server + contract.items.path.val(),
        }
        
        if(contract.cid){
            options["contract.cid"] = contract.cid;
            
            url = api.data.updateContract;
        }

        com.post(url, options, function(res){
            com.closePopup();
            searcher.doSearch();
        });
    }
    
});