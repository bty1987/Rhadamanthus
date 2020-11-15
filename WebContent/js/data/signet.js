jQuery(function ($) {
    
    var signet = {
            
        sid: null,
        
        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        },
        
        items: {
            no: com.focusPage("#no", "#signetModal"),
            name: com.focusPage("#name", "#signetModal"),
            keyword: com.focusPage("#keyword", "#signetModal"),
            path: com.focusPage("#path", "#signetModal"),
            
            signetImg: com.focusPage("#signetImg"),
            
            qrcode: null,
        },
        
        modals: {
            qrcodeModal: null,
        },
        
        status: {
            "0": "初始",
            "1": "注册",
            "2": "认证",
            "3": "确认",
            "4": "签章",
        }
    }
    
    signet.modals.qrcodeModal = com.initForm("qrcodeModal", "二维码", [{"id": "qrcode", "type": "div", "clazz": "qrcode"}], []);
    signet.items.qrcode = com.focusPage("#qrcode");
    
    com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.png', {'uploadType': 2}, 1, function(data){
        
        signet.items.path.val(data.resUrl);
        
        com.showImg(signet.items.signetImg, data.resUrl, 150, 150, '', null, 0);
    });
    
    signet.btns.saveBtn.click(saveData);
    
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            
            var $btnUpdate = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('更新');
            var $btnRegist = $('<a></a>').addClass(' btn btn-minier btn-success').html('注册');
            var $btnAuth = $('<a></a>').addClass(' btn btn-minier btn-warning').html('认证');
            var $btnConfirm = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('确认');
            var $btnSign = $('<a></a>').addClass(' btn btn-minier btn-danger').html('签章');

            $divBtnWrap.append($btnUpdate).append($btnRegist).append($btnAuth).append($btnConfirm).append($btnSign).appendTo($h3);
            
            var $urldiv = $('<div style="border: 1px solid #ccc ;float :left;"></div>').css("width", "75px").css("height", "75px").css("margin-right", "10px");
            var img = $('<img />').css("margin-right", "20px").appendTo($urldiv);
            var url = com.showImg(img, v.path, 75, 75, '', null, 0);

            var propertyArr = [
                ["编号: ", v.no, "grey"],
                ["名称: ", v.name, "grey"],
                ["关键字: ", v.keyword  , "grey"],
                ["标识: ", v.signno  , "grey"],
                ["状态: ", signet.status[v.status], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b style="float: right"></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($urldiv).append($h3).append($ulProperty);
            
            $btnUpdate.click(function(){
                
                signet.sid = v.sid;
                
                com.popup4model('#layerAdd', '编辑', null, function () {
                    com.clearValidator();
                }, function(){
                    initUpdate(v);
                });
            });
            
            $btnRegist.click(function(){
                
                com.post(api.data.registSignet, {"signet.sid": v.sid}, function(res){
                    searcher.doSearch();
                });
            });
            
            $btnAuth.click(function(){
                
                com.post(api.data.authSignet, {"signet.sid": v.sid}, function(res){
                    showQRCode(res.signet.path);
                });
            });
            
            $btnConfirm.click(function(){
                
                com.post(api.data.confirmSignet, {"signet.sid": v.sid}, function(res){
                    searcher.doSearch();
                });
            });
            
            $btnSign.click(function(){
                
                com.post(api.data.signateSignet, {"signet.sid": v.sid, "signet.data": config.server + v.path}, function(res){
                    searcher.doSearch();
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

    searcher.init(["data-signet-name"], "condList", api.data.pageSignet, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "signetPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addContract').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            
            signet.sid = null;
            
            com.clearImg(signet.items.signetImg);
            com.cleanItems(signet.items);
            
            com.popup4model('#layerAdd', '添加', null, function () {
                com.clearValidator();
            });
        });
        
        return [$adda];
    }, 'resultList');
    
    function saveData(){
        
        if(com.validate('signetModal')) return false;
        
        var url = api.data.addSignet;
        var options = {
            "signet.no": signet.items.no.val(),
            "signet.name": signet.items.name.val(),
            "signet.keyword": signet.items.keyword.val(),
            "signet.path": signet.items.path.val(),
            "signet.data": config.server + signet.items.path.val(),
        }
        
        if(signet.sid){
            options["signet.sid"] = signet.sid;
            
            url = api.data.updateSignet;
        }
        
        com.post(url, options, function(res){
            com.closePopup();
            searcher.doSearch();
        });
    }

    function initUpdate(v){
        
        signet.items.no.val(v.no);
        signet.items.name.val(v.name);
        signet.items.keyword.val(v.keyword);
        signet.items.path.val(v.path);
        
        signet.imgsrc = com.showImg(signet.items.signetImg, v.path, 150, 150, '', null, 0);
    }
    
    function showQRCode(url){
        
        console.log(url);
        signet.items.qrcode.html("").qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: url
        });
        
        signet.modals.qrcodeModal.modal('show');
    }
    
    function base64(img) {
        
        img.setAttribute("crossOrigin", 'Anonymous');
        
        var canvas = document.createElement("canvas");
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        var ctx = canvas.getContext("2d");
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        return canvas.toDataURL("image/png", 1);
    }
    
});