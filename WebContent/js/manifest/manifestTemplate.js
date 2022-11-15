$(function() {

    var manifestTemplate = {
        items: {
            mtid: com.focusPage("#mtid"),
            name: com.focusPage("#name"),
            comment: com.focusPage("#comment"),
            submitBtn: com.focusPage("#submitBtn"),
        }
    };

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);

            if (listData && listData.length) {

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function(i, v) {

                    var $liLine = creatLine(i, v);

                    $liLine.appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function() {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');

            var titleName = '名称,说明,状态';

            $.each(titleName.split(','), function(i, v) {

                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function(i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');

            var propertyArr = [[v.name, 'grey'], [v.comment, 'grey'], [v.status == "0" ? "启用" : "禁用", 'red']];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));
            var $btnDel = $('<li></li>').append($('<a></a>').html('删除'));
            var $btnBinbing = $('<li></li>').append($('<a></a>').html('绑定'));

            $btnUl.append($btnEdit).append($btnStart).append($btnStop).append($btnBinbing);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnEdit.click(function() {

                manifestTemplate.items.mtid.val(v.mtid);
                manifestTemplate.items.name.val(v.name);
                manifestTemplate.items.comment.val(v.comment);
                com.popup4model("#layerAdd", "编辑");
            });

            $btnStart.click(function() {

                if (v.status == 0) {
                    com.showAlert(com.warning, "已启用");
                    return false;
                }

                com.post(api.inventory.updateManifestTemplateForStatus, {
                    "manifestTemplate.mtid": v.mtid,
                    "manifestTemplate.status": 0
                }, function(res) {

                    searcher.doSearch();
                });
            });

            $btnStop.click(function() {

                if (v.status == 1) {
                    com.showAlert(com.warning, "已禁用");
                    return false;
                }

                com.post(api.inventory.updateManifestTemplateForStatus, {
                    "manifestTemplate.mtid": v.mtid,
                    "manifestTemplate.status": 1
                }, function(res) {

                    searcher.doSearch();
                });
            });

            $btnDel.click(function() {

                com.showConfirm('是否确定删除', function() {

                    com.post(api.inventory.deleteManifestTemplate, {
                        "manifestTemplate.mtid": v.mtid
                    }, function(res) {

                        searcher.doSearch();
                    });
                })
            });

            /* 绑定 */
            $btnBinbing.click(function() {

                params.manifest.manifestTemplate.mtid = v.mtid;
                com.switchPage('views/manifest/manifestTemplateItem.html');
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
        };
    })();

    var searcher = new Searcher();

    searcher.init(['data-manifest-template-name'], "condList", api.inventory.pageManifestTemplate, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "manifestTemplatePostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function() {

            clearForm('form1');
            com.popup4model('#layerAdd', "添加");
        });

        return [$adda];
    }, 'resultList');

    manifestTemplate.items.submitBtn.click(function() {

        saveData(manifestTemplate.items.mtid.val())
    });

    function clearForm(formId) {

        com.clearValidator();

        manifestTemplate.items.name.val("");
        manifestTemplate.items.comment.val("");
    }

    function saveData(mtid) {

        if (com.validate('layerAdd', 'right')) {
            return false;
        }

        var url = api.inventory.addManifestTemplate;
        var options = {
            "manifestTemplate.name": manifestTemplate.items.name.val(),
            "manifestTemplate.comment": manifestTemplate.items.comment.val()
        };

        if (mtid) {
            url = api.inventory.updateManifestTemplate;
            options["manifestTemplate.mtid"] = mtid;
        }

        com.post(url, options, function(res) {

            com.clearValidator();
            manifestTemplate.items.mtid.val("");
            com.closePopup();
            searcher.doSearch();
        });
    }

});
