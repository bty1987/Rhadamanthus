jQuery(function($) {

    var signature = {

        sid: params.data.signature.sid,
        signid: params.data.signature.signid,
        signno: params.data.signature.signno,

        btns: {
            createSignature: com.focusPage("#createSignature"),
        },

        items: {
            images: com.focusPage("#images"),
        },

        modals: {},

    }

    function showSignature() {

        signature.items.images.empty();

        com.post(api.data.pollingSignature, {
            "signature.customerId": signature.signno
        }, function(res) {

            $.each(res.signatures, function(i, v) {
                addSignature(v);
            });

            com.popup4photos("#images");
        });
    }

    function addSignature(v) {
        var $li = $('<li></li>').attr("id", "imgLi_" + v.signatureId).appendTo(signature.items.images);
        var $img = $('<img></img>').attr('width', 200).attr('height', 200).attr("src", "data:image/jpg;base64," + v.image);
        var $imgA = $('<a></a>').addClass('cboxElement').attr('target', '_blank').append($img).appendTo($li);

        var $tags = $('<div></div>').addClass('tags').attr("id", "imgtag_" + v.signatureId).appendTo($li);

        var $tools = $('<div></div>').addClass('tools tools-top').appendTo($li);
        var $toolLabel = $('<label></label>').appendTo($tools);

        var $defaultA = $('<a></a>').addClass("icon-bookmark");
        var $selectA = $('<a></a>').addClass("icon-check-sign");
        var $delA = $('<a></a>').addClass("icon-remove-sign");

        $defaultA.click(function() {
            com.post(api.data.defaultSignature, {
                "signature.customerId": signature.signno,
                "signature.signatureId": v.signatureId
            }, function(res) {
                showSignature();
                signature.signid = res.signet.signid;
            });
        });

        $selectA.click(function() {
            com.post(api.data.selectSignet, {
                "signet.sid": signature.sid,
                "signet.signid": v.signatureId
            }, function(res) {
                showSignature();
                signature.signid = res.signet.signid;
            });
        });

        $delA.click(function() {
            com.post(api.data.deleteSignature, {
                "signature.customerId": signature.signno,
                "signature.signatureId": v.signatureId
            }, function(res) {
                com.focusPage("#imgLi_" + res.signature.signatureId).remove();
            });
        });

        if (v.defaults == 1) {
            var $nameHolder = $('<span class="signitrue-default"></span>').addClass('label-holder').appendTo($tags);
            var $nameInfo = $('<span></span>').addClass('label label-danger arrowed').text("默认").appendTo($nameHolder);

            $delA = null, $defaultA = null;
        }

        if (signature.signid == v.signatureId) {
            var $nameHolder = $('<span class="signitrue-select"></span>').addClass('label-holder').appendTo($tags);
            var $nameInfo = $('<span></span>').addClass('label label-success arrowed').text("已选").appendTo($nameHolder);

            $delA = null, $selectA = null;
        }

        $tools.append($defaultA).append($selectA).append($delA);

    }

    showSignature();

    com.uploadify("#createSignature", "创建印章", api.common.uploadImg, ('btn ' + "btn-success"), "*.png", {
        'uploadType': 2
    }, 5, function(data) {
        com.post(api.data.addSignature, {
            "signature.customerId": signature.signno,
            "signature.path": "http://service-erp.fanglin.vip/" + data.resUrl,
            "signature.filesize": data.filesize
        }, function(res) {
            showSignature();
        });
    });

});