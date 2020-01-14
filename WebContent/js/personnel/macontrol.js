$(function () {

    var macontrol = {
        
        uid: params["user.uid"],

        items: {
            mcname: com.focusPage("#mcname", "#layerAdd"),
            mcip: com.focusPage("#mcip", "#layerAdd"),
            mcmac : com.focusPage('#mcmac', "#layerAdd"),
        },
        btns:{
            addMacontrolBtn : com.focusPage('#addMacontrolBtn'),
            saveMacontrolBtn: com.focusPage('#saveMacontrolBtn'),
        },
        
        options: {},
    };

    com.focusPage('#fl-statement').statement("人员", "权限");

    var initList = function (listData) {
        var $tableWrap = com.focusPage('#list').html("");
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {
                var $num = v.num;//数量
                var $price = v.price;//折让价
                var $total = v.total;

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(v.name);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

                var propertyArr = [
                    ["IP: ", v.ip, "grey"],
                    ["MAC: ", v.mac, "grey"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                $btnDiv.append($btnDelete);

                $small.appendTo($h3);
                $btnDiv.appendTo($h3);

                $btnDelete.click(function (e) {
                    deleteMacontrol(v.mid);
                });

            });

            $ul.appendTo($tableWrap);
        }
    };
    
    macontrol.btns.addMacontrolBtn.click(function(){
        com.popup4mini("#miniPopUp", "#layerAdd", "创建","", null, function () {
            com.clearValidator();
        });
    });
    
    macontrol.btns.saveMacontrolBtn.click(function(){
        
        if (com.validate('miniPopUp', 'right')){
            return false;
        }
        
        var options = {
            "macontrol.name": com.focusPage("#mcname", "#layerAdd").val(),
            "macontrol.ip": com.focusPage("#mcip", "#layerAdd").val(),
            "macontrol.mac": com.focusPage("#mcmac", "#layerAdd").val(),
            "macontrol.buid": macontrol.uid
        }
        
        com.post(api.personel.addMacontrol, options, function(){
            queryMacontrol();
            com.closePopup(com.focusPage("#saveMacontrolBtn"));
        });
    });
    
    queryMacontrol();
    
    function queryMacontrol() {
        com.post(api.personel.queryMacontrol, {"macontrol.buid": macontrol.uid}, function (data) {
            if(data.macontrols.length == 0){
                emptyData("list");
            }else{
                initList(data.macontrols);
            }
        }, null, false);
    }

    function emptyData(id) {
        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }
    
    function deleteMacontrol(mid){
        var options = {
            "macontrol.mid": mid,
        }
        
        com.post(api.personel.deleteMacontrol, options, function(){
            queryMacontrol();
        });
    }

});