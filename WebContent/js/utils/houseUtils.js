var houseUtils = {
    creatHouseNumber: function(arr) {

        var str = '';
        var erri;
        $.each(arr, function(i, val) {

            if (i % 2 == 1 && (val == '0' || val == '1')) {
                return; // 分隔符占位项("选择",key为0/1):不拼接,也不吞下一个数据段
            }
            if (val != 0 || val == '') {
                if (i != erri + 1) {
                    str = str + val;
                }
            } else {
                erri = i;
            }
        });
        return str;
    },
    validatehouse: function(no, houseNumber, status, errid, Whether) {

        var prehouse = {
            house: {},
            Flag: true
        };
        if (no == "" || houseNumber == "") {
            prehouse.Flag = true;
            return;
        }
        var options = {
            "house.village.no": no,
            "house.houseNumber": houseNumber,
            "house.status": status,
        };

        com.post(api.data.queryHouseByNoAHnum, options, function(res) {

            prehouse.house = res.house;
            prehouse.Flag = true;
            if (Whether) {
                com.showAlert(com.warning, "房产已存在");
            }
        }, function(res) {

            prehouse.Flag = false;
        }, false);
        
        return prehouse;
    },
    anytimevalidate: function(houseitems, status, Whether) {

        var validateresult = {};

        if (houseitems.no.val() == "") {
            com.showPopover(houseitems.no, {
                errorMsg: "请先选择楼盘!"
            }, "right");
        } else {
            houseitems.no.css("border", "1px solid #d5d5d5").popover("destroy");
        }

        validateresult.rulenum = [houseitems.built.val().trim().toUpperCase(), houseitems.builtrule.val(), houseitems.unit.val().trim().toUpperCase(), houseitems.unitrule.val(), houseitems.floor.val().trim().toUpperCase(), houseitems.floorrule.val(), houseitems.door.val().trim().toUpperCase(), houseitems.doorrule.val()];

        validateresult.houseNumber = houseUtils.creatHouseNumber(validateresult.rulenum);

        validateresult.prehouse = houseUtils.validatehouse(houseitems.no.val(), validateresult.houseNumber, status, houseitems.errMsg, Whether);

        return validateresult;
    },
    savehouse: function(house) {

    }
};
