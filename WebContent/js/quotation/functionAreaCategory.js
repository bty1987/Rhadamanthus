$(function() {

    com.focusPage('#fl-statement').statement("功能区", "品类规格");

    var functionAreaCategory = {

        postParam: {
            faid: params.data.functionArea.faid
        }
    };

    var categoryIds = com.focusPage("#categoryId");
    var $categoryList = com.focusPage("#categoryList", "#functionAreaCategoryList");

    com.post(api.data.queryCategory, {}, function(res) {

        categoryIds.bindData(res.categorys, "cid", "name");
    });

    com.focusPage("#addCategoryBtn").on("click", function() {

        var cid = categoryIds.val();

        if (!cid) return false;

        com.post(api.quotation.addFunctionAreaCategory, {
            "functionAreaCategory.faid": functionAreaCategory.postParam.faid,
            "functionAreaCategory.cid": cid
        }, function() {

            com.showAlert(com.info, "操作成功");
            initFunctionAreaCategoryList();
        });
    });

    initFunctionAreaCategoryList();

    function initFunctionAreaCategoryList() {

        com.post(api.quotation.queryFunctionAreaCategoryByFaid, {
            "functionAreaCategory.faid": functionAreaCategory.postParam.faid
        }, function(data) {

            $categoryList.empty();

            $.each(data.functionAreaCategorys, function(i, c) {

                var $wrap = $('<div></div>').addClass('well well-sm').css({ "margin-bottom": "10px" }).appendTo($categoryList);

                var $head = $('<h5></h5>').css({ "margin": "0 0 8px 0" }).appendTo($wrap);
                $head.append($('<strong></strong>').text(c.categoryName));
                $head.append(' ');
                $head.append($('<a></a>').addClass('btn btn-minier btn-danger').text('移除').on("click", function() {

                    com.showConfirm("移除品类将同时删除其下规格,是否确认?", function() {

                        com.post(api.quotation.deleteFunctionAreaCategory, {
                            "functionAreaCategory.fcid": c.fcid
                        }, function() {

                            com.showAlert(com.info, "操作成功");
                            initFunctionAreaCategoryList();
                        });
                    });
                }));

                var $table = $('<table></table>').addClass('table table-striped table-bordered table-hover').css({ "margin-bottom": "8px" }).appendTo($wrap);
                var $thead = $('<thead></thead>').appendTo($table);
                var $thr = $('<tr></tr>').appendTo($thead);
                $('<th></th>').text('规格').appendTo($thr);
                $('<th></th>').text('公司').appendTo($thr);
                $('<th></th>').text('备注').appendTo($thr);
                $('<th></th>').text('操作').css("width", "120px").appendTo($thr);

                var $tbody = $('<tbody></tbody>').appendTo($table);

                $.each(c.formats, function(j, f) {

                    var $tr = $('<tr></tr>').attr("ffid", f.ffid).appendTo($tbody);

                    var $formatInput = $('<input type="text" class="col-xs-12">').val(f.format).css("width", "100%");
                    var $companyInput = $('<input type="text" class="col-xs-12">').val(f.company == null ? '' : f.company).css("width", "100%");
                    var $commentInput = $('<input type="text" class="col-xs-12">').val(f.comment == null ? '' : f.comment).css("width", "100%");

                    $('<td></td>').append($formatInput).appendTo($tr);
                    $('<td></td>').append($companyInput).appendTo($tr);
                    $('<td></td>').append($commentInput).appendTo($tr);

                    var $btnTd = $('<td></td>').appendTo($tr);
                    $('<a></a>').addClass('btn btn-minier btn-yellow').text('保存').css("margin-right", "4px").appendTo($btnTd).on("click", function() {

                        if (!$.trim($formatInput.val())) {
                            com.showAlert(com.warning, "规格不能为空");
                            return false;
                        }

                        com.post(api.quotation.updateFunctionAreaFormat, {
                            "functionAreaFormat.ffid": f.ffid,
                            "functionAreaFormat.format": $.trim($formatInput.val()),
                            "functionAreaFormat.company": $.trim($companyInput.val()),
                            "functionAreaFormat.comment": $.trim($commentInput.val())
                        }, function() {

                            com.showAlert(com.info, "操作成功");
                        });
                    });

                    $('<a></a>').addClass('btn btn-minier btn-danger').text('删除').appendTo($btnTd).on("click", function() {

                        com.post(api.quotation.deleteFunctionAreaFormat, {
                            "functionAreaFormat.ffid": f.ffid
                        }, function() {

                            com.showAlert(com.info, "操作成功");
                            initFunctionAreaCategoryList();
                        });
                    });
                });

                var $addTr = $('<tr></tr>').appendTo($tbody);

                var $newFormat = $('<input type="text" class="col-xs-12" placeholder="规格">').css("width", "100%");
                var $newCompany = $('<input type="text" class="col-xs-12" placeholder="公司">').css("width", "100%");
                var $newComment = $('<input type="text" class="col-xs-12" placeholder="备注">').css("width", "100%");

                $('<td></td>').append($newFormat).appendTo($addTr);
                $('<td></td>').append($newCompany).appendTo($addTr);
                $('<td></td>').append($newComment).appendTo($addTr);

                var $addBtnTd = $('<td></td>').appendTo($addTr);
                $('<a></a>').addClass('btn btn-minier btn-success').text('添加').appendTo($addBtnTd).on("click", function() {

                    if (!$.trim($newFormat.val())) {
                        com.showAlert(com.warning, "规格不能为空");
                        return false;
                    }

                    com.post(api.quotation.addFunctionAreaFormat, {
                        "functionAreaFormat.fcid": c.fcid,
                        "functionAreaFormat.format": $.trim($newFormat.val()),
                        "functionAreaFormat.company": $.trim($newCompany.val()),
                        "functionAreaFormat.comment": $.trim($newComment.val())
                    }, function() {

                        com.showAlert(com.info, "操作成功");
                        initFunctionAreaCategoryList();
                    });
                });
            });
        });
    }

});
