$(function(){



    var measurementUnit = {
        addmodal : null,
        Unit : {},
        cancelBtn : null,
        savebtn : null,
        editFlg : false,
    }

    measurementUnit.addmodal = com.focusPage("#addModal");
    measurementUnit.cancelBtn = com.focusPage("#cancelBtn");
    measurementUnit.Unit.id = com.focusPage("#id");
    measurementUnit.Unit.name = com.focusPage("#measurement");
    measurementUnit.Unit.unitDes = com.focusPage("#unitDes");
    measurementUnit.savebtn = com.focusPage("#measurementadd").on("click", saveData);

    var displayFunc  = (function(){


        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPosition = $('<a></a>').addClass('btn btn-minier btn-warning').html('编辑');

            if(v.unitDes) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html('说明 ').appendTo($liProperty);
                $('<b></b>').html(v.unitDes).addClass("grey").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            }


            $divBtnWrap.append($btnPosition).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnPosition.click(function(){
                update(v);
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    searcher.init(['data-unit-name'], "condList", api.data.pageMeasurementUnit, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "measurementData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addMeasurementUnit').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    function update(v){
        measurementUnit.editFlg = false ;
        com.cleanItems(measurementUnit.Unit);
        measurementUnit.Unit.id.val(v.id);
        measurementUnit.Unit.name.val(v.name);
        measurementUnit.Unit.unitDes.val(v.unitDes);
        measurementUnit.addmodal.modal("show");
    }

    com.focusPage('a[name="addMeasurementUnit"]','#pagenation').click(function(){
        measurementUnit.editFlg = true;
        com.cleanItems(measurementUnit.Unit);
        measurementUnit.addmodal.modal("show");
    });

    function saveData(){
        
        if(com.validate("addModal")){
            return false;
        }

        var measurement = measurementUnit.Unit.name.val();

        var url = api.data.addMeasurementUnit;
        var options = {
            "measurementUnit.id" : measurementUnit.Unit.id.val(),
            "measurementUnit.name": measurementUnit.Unit.name.val(),
            "measurementUnit.unitDes": measurementUnit.Unit.unitDes.val(),
        };

        if(measurementUnit.editFlg){
            url = api.data.addMeasurementUnit;
        }else{
            url = api.data.updateMeasurementUnit;
        }

        com.post(url, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        measurementUnit.addmodal.modal("hide");
    }

})