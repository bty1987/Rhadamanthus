$(function () {

    var saveFlag = true;

    var version = {
        saveBtn: $("#saveBtn").on("click", function () {
            if (saveFlag) {
                saveData();
            } else {
                updateData();
            }
        }),
        cancelBtn: $("#cancelBtn").on("click", function () {
            $('#myModalLabel').removeAttr('data-vid');
            clearModel()
        }),
        modal: $("#versionModal").on("show.bs.modal", function (a) {
            com.clearValidator()
        }),
        items: {
            no: $("#versionNo"),
            createTime: $("#createTime"),
            comment: $("#contents"),
        },
    };

//Datepicker是绑在一个标准的形式输入字段
    if (jQuery().datepicker) {
        $('.date-picker').datepicker({
            format: 'yyyy-mm-dd',// yyyy-mm-dd hh:ii,
            autoclose: true,
        });

    }

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId).empty();
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

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnEnabled = $('<a></a>').addClass('btn btn-minier btn-success').html('已启用');
            var $btnDisabled = $('<a></a>').addClass('btn btn-minier btn-success').html('已禁用');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-warning').html('删除');

            var propertyArr = [
                ["创建时间:", v.createTime, "grey"],
                ["更新内容:", v.comment, "grey"]
            ];

            //循环出li中的属性
            $.each(propertyArr, function (index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                $liProperty.appendTo($ulProperty);

            });

            $divBtnWrap.append($btnEdit);
            if (v.status == 0) {
                $divBtnWrap.append($btnEnabled);
            } else {
                $divBtnWrap.append($btnDisabled);
            }
            $divBtnWrap.append($btnDel).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {

                saveFlag = false;
                $('#myModalLabel').attr('data-vid', v.vid);
                $('#versionNo').val(v.no),
                $('#createTime').val(v.createTime),
                $('#contents').html(v.comment)

                version.modal.modal("show");

            });

            $btnEnabled.click(function () {
                com.post(api.upgrade.updateVersionForStatus, {
                    "version.vid": v.vid,
                    "version.status": 1
                }, function (res) {
                    $btnDisabled.removeClass('hide');
                    $btnEnabled.addClass('hide');
                    versionSeacher.doSearch();
                })
            })
            $btnDisabled.click(function () {
                com.post(api.upgrade.updateVersionForStatus, {
                    "version.vid": v.vid,
                    "version.status": 0
                }, function (res) {
                    $btnEnabled.removeClass('hide');
                    $btnDisabled.addClass('hide');
                    versionSeacher.doSearch();
                })
            })

            $btnDel.click(function () {
                bootbox.confirm("确定删除吗?", function (result) {
                    if (result) {
                        com.post(api.upgrade.deleteVersion, {
                            "version.vid": v.vid
                        }, function (res) {
                            com.showAlert(com.info, "操作成功");
                            versionSeacher.doSearch();
                        })
                    }
                });
            });

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
        }
    })();

    var versionSeacher = new Searcher();
    versionSeacher.init([], "condList", api.upgrade.pageVersion, function (list) {
        displayFunc.init('resultList', list);
    }, "pagenation", "versionSeacherPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVillage').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function () {

            clearModel();
            saveFlag = true;
            version.modal.modal("show");

        });

        return [$adda];
    });

    function saveData() {

        var no = $('#versionNo').val();
        var createTime = $('#createTime').val();
        var comment = $('#contents').html();
        var commentText = $('#contents').text();

        if (checkInfo()) {
            com.post(api.upgrade.addVersion, {
                "version.no": no,
                "version.createTime": createTime,
                "version.comment": comment,
            }, function (res) {
                com.showAlert(com.info, "操作成功");
                versionSeacher.doSearch();
                version.modal.modal('hide');
            })
        }
    }

    function updateData() {

        var no = $('#versionNo').val();
        var createTime = $('#createTime').val();
        var comment = $('#contents').html();

        if (checkInfo()) {
            com.post(api.upgrade.updateVersion, {
                "version.vid": $('#myModalLabel').attr('data-vid'),
                "version.no": no,
                "version.createTime": createTime,
                "version.comment": comment,
            }, function (res) {
                com.showAlert(com.info, "操作成功");
                versionSeacher.doSearch();
                version.modal.modal('hide');
            })
        }
    }

    initializeContent();

    function initializeContent() {

        $("#contents").ace_wysiwyg({
            toolbar: ["font", null, "fontSize", null,
                {
                    name: "bold",
                    className: "btn-info"
                }, {
                    name: "italic",
                    className: "btn-info"
                }, {
                    name: "strikethrough",
                    className: "btn-info"
                }, {
                    name: "underline",
                    className: "btn-info"
                },
                null,
                {
                    name: "insertunorderedlist",
                    className: "btn-success"
                }, {
                    name: "insertorderedlist",
                    className: "btn-success"
                }, {
                    name: "outdent",
                    className: "btn-purple"
                }, {
                    name: "indent",
                    className: "btn-purple"
                },
                null,
                {
                    name: "justifyleft",
                    className: "btn-primary"
                }, {
                    name: "justifycenter",
                    className: "btn-primary"
                }, {
                    name: "justifyright",
                    className: "btn-primary"
                }, {
                    name: "justifyfull",
                    className: "btn-inverse"
                },
                null, null, null, null, null, null, "foreColor", null,
                {
                    name: "undo",
                    className: "btn-grey"
                }, {
                    name: "redo",
                    className: "btn-grey"
                }],
            wysiwyg: {
                fileUploadError: showErrorAlert
            }
        }).prev().addClass("wysiwyg-style2");
        if ("undefined" !== typeof jQuery.ui && /applewebkit/.test(navigator.userAgent.toLowerCase())) {
            var a = function () {
                    null != b && (b.resizable("destroy"), b.removeData("resizable"), b = null);
                },
                b = null;
            (function () {
                $(".wysiwyg-editor").on("mousedown", function (a) {
                    var d = $(a.target);
                    a.target instanceof HTMLImageElement && !d.data("resizable") && (d.resizable({
                        aspectRatio: a.target.width / a.target.height
                    }), d.data("resizable", !0), null != b && (b.resizable("destroy"), b.removeData("resizable")), b = d);
                }).on("click", function (c) {
                    null == b || c.target instanceof HTMLImageElement || a()
                }).on("keydown", function () {
                    a();
                });
            })();
        }
    }

    function showErrorAlert(a, b) {
        var c = "";
        "unsupported-file-type" === a ? c = "Unsupported format " + b : console.log("error uploading file", a, b);
        $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button><strong>File upload error</strong> ' + c + " </div>").prependTo("#alerts")
    }

    function checkInfo() {

        var flag = true;

        var createTime = $('#createTime');
        var createTimeRex = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;

        if (createTime.val() == null || createTime.val() == "") {
            createTime.focus().select();
            createTime.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "right",
                "data-original-title": "",
                "title": "",
                "data-content": "请输入时间!"
            }).popover('show');
            flag = false;
        } else {
            createTime.popover('destroy');
        }

        var comment = $('#contents');

        if (comment.html() == null || comment == "") {
            comment.focus().select();
            comment.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "right",
                "data-original-title": "",
                "title": "",
                "data-content": "内容不能为空!"
            }).popover('show');
            flag = false;
        } else {
            comment.popover('destroy');
        }

        return flag;

    }

    function clearModel(){
        $('#versionNo').val("");
        $('#createTime').val("");
        $('#contents').html("");
    }
});
