jQuery(function ($) {

    var measurementUnit = {

        addmodal : null,
        Unit : {},
        cancelBtn : null,
        savebtn : null,
        editFlg : false,
    };

    measurementUnit.addmodal = com.focusPage("#addModal");
    measurementUnit.cancelBtn = com.focusPage("#cancelBtn");
    measurementUnit.Unit.id = com.focusPage("#id");
    measurementUnit.Unit.name = com.focusPage("#measurement");
    measurementUnit.Unit.unitDes = com.focusPage("#unitDes");
    measurementUnit.savebtn = com.focusPage("#measurementadd").on("click", saveData);

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList", api.data.pageMeasurementUnit);

    seacher.condition(["data-unit-name"]);

    seacher.button([{ id: "addMeasurementUnit", name: "添加", clazz: "btn-yellow", icon: "icon-plus" }]);

    seacher.history("measurementUnitPostData");

    var lineprops = [
        { fieId: "unitDes", name: "说明", prop: "unitDes", clazz: "grey" },
    ];

    var linebtns = [
        {name: "编辑", clazz: "btn-yellow", handle: function(v){

            measurementUnit.editFlg = false ;
            com.cleanItems(measurementUnit.Unit);
            measurementUnit.Unit.id.val(v.id);
            measurementUnit.Unit.name.val(v.name);
            measurementUnit.Unit.unitDes.val(v.unitDes);
            measurementUnit.addmodal.modal("show");
            return false;
        }}
    ];

    seacher.line("name", lineprops, linebtns).render();

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


    function saveData() {

        if (com.validate('addModal'))
            return false;

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


        com.post(url, options, function(res){
            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        measurementUnit.addmodal.modal("hide");
    }
});
