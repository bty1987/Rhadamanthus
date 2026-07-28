jQuery(function ($) {

    var manifest = {
        items: {
            manifestTime: com.focusPage("#manifestTime"),
            comment: com.focusPage("#comment"),
        },
        btns:{
            addManifestItem: com.focusPage("#addManifestItem"),
            submitManifest: com.focusPage("#submitManifest"),
            submitBtn:com.focusPage("#submitBtn"),
        },
        record: {},
        storehouses: []
    };

    com.datetime(manifest.items.manifestTime,"date",false);

    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {

        $.each(res.storehouses, function (i, v) {
            if (v.status == constant.inventory().storehouse.STATUS_ENABLE_INT) {
                manifest.storehouses.push(v);
            }
        });
    }, null, false);

    //添加一条空行
    addline(1).addClass('current');

    manifest.btns.addManifestItem.click(function () {

        if (com.validate('list', 'bottom')) {
            return;
        }

        var num = com.focusPage('.line', '#list').length;

        addline(num + 1);

    });

    manifest.btns.submitManifest.click(function () {

        var $lines = com.focusPage('li.line', '#list');

        if (!$lines.length) {
            com.showAlert(com.warnng, "请填写商品");
            return false;
        }

        if (com.validate("timelement", "top")) {
            return false;
        }

        if (com.validate('list', 'bottom')) {
            return false;
        }

        approvalUtils.initqueryApprovalUser("approver", 11);
        com.popup4model('#approvalSubmit',"调拨");
    });

    manifest.btns.submitBtn.click(function () {
        savaData();
    });

    function savaData(){
        var approverId = com.focusPage('#approver').find('input:checked').attr('userid');

        if (approverId == null || approverId == "") {
            com.showAlert(com.warning, "请选择审批人");
            return false;
        }

        var manifestTime = manifest.items.manifestTime.val();
        var comment = manifest.items.comment.val();

        var options = {
            "approval.receiver.userId": approverId,
            "approval.comment": comment,

            "approvalManifestDB.manifestTime": manifestTime,
            "approvalManifestDB.comment": comment,
            "approvalManifestDB.attachment": ""//– 附件路径
        };

        var $list = com.focusPage('li.line', '#list');

        $list.length && $list.each(function (i, e) {

            var $this = $(e);

            options["approvalManifestDBItems[" + i + "].goods.gid"] = $this.attr('data-pgid');//– 商品id
            options["approvalManifestDBItems[" + i + "].color.cid"] = $this.find('.color select').val();//– 颜色id
            options["approvalManifestDBItems[" + i + "].format.fid"] = $this.find('.format select').val();//– 规格id

            options["approvalManifestDBItems[" + i + "].instorehouse.shid"] = $this.find('.instorehouse select').val();// – 仓库ID
            options["approvalManifestDBItems[" + i + "].outstorehouse.shid"] = $this.find('.outstorehouse select').val();//– 仓库ID

            options["approvalManifestDBItems[" + i + "].num"] = $this.find('.number input').val();//– 数量
            options["approvalManifestDBItems[" + i + "].comment"] = $this.find('.des input').val();// – 说明
        });

        com.post(api.approval.submitApprovalForManifestDB, options, function (data) {

            com.closePopup();

            com.showAlert(com.info, "操作成功");

            com.focusPage('#list').empty();

            manifest.items.manifestTime.val(null);
            manifest.items.comment.val("");

            com.focusPage('#approver').empty();

            addline(1).addClass('current');
        }, null, false);
    }

    //添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line').appendTo(com.focusPage('#list'));
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap = $('<div></div>').addClass('line-wrap action');

        var _lineInfoSet = [
            {cellClass: "no"},//编号
            {cellClass: "name", hasInput: true, require: "v_required"},//名称
            {cellClass: "color", hasSelect: true},//颜色
            {cellClass: "format", hasSelect: true},//规格
            {cellClass: "measurementUnit"},//单位
            {cellClass: "instorehouse", hasSelect: true},//仓库
            {cellClass: "outstorehouse", hasSelect: true},//仓库
            {cellClass: "number", hasInput: true, require: "v_float_3"},//数量
            {cellClass: "pieceNum"},//件数
            {cellClass: "des", hasInput: true}//备注
        ];

        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');

                if (v.require) {
                    $input.addClass(v.require);
                }

                if (v.cellClass == "des") {
                    $input.attr('maxlength', '128');
                }

                $cell.append($input);
            }

            if (v.hasSelect) {
                $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }

            $cell.appendTo($lineInfoWrap);
        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        com.initTypeahead(".name input", api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function (list, k, v) {

            $.each(list, function (index, val) {
                if (val.gid == k) {

                    $lineInfoWrap.find('.no').text(val.no);
                    $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                    $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                    $line.attr('data-pgid', val.gid);
                    $line.attr('data-gid', val.gid + '_' + lineindex);

                    $lineInfoWrap.find('.instorehouse select').bindData(manifest.storehouses, "shid", "name");
                    $lineInfoWrap.find('.outstorehouse select').bindData(manifest.storehouses, "shid", "name");

                    com.post(api.data.queryColorForEnableByGid, {
                        "color.gid": val.gid
                    }, function (res) {
                        com.focusPage('li[data-gid="' + val.gid + '_' + lineindex + '"] .color select').bindData(res.colors, "cid", "name");
                    });

                    com.post(api.data.queryFormatForEnableByGid, {
                        "format.gid": val.gid
                    }, function (res) {
                        com.focusPage('li[data-gid="' + val.gid + '_' + lineindex + '"] .format select').bindData(res.formats, "fid", "info");
                    });
                }
            });

            return v;
        });

        $btncheck.click(function (e) {

            if (com.validate('list', 'bottom')) {
                return;
            }
        });

        $btndel.click(function (e) {
            $line.remove();
            reorder();
        });

        return $line;
    }

    //重排序
    function reorder() {
        com.focusPage('.line', '#list').each(function (i, e) {
            $(e).find('.index').text(i + 1);
        });
    }

});