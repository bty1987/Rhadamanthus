jQuery(function($) {

    var updateRecruitment = {

        items: {},
        modals: {
            updateRecruitment: com.focusPage("#updateRecruitment")
        },
        getProp: {
            "0": true,
            "1": false,
            "true": 0,
            "false": 1
        },
        updataBtn: null,
        cancelBtn: null,
    };

    updateRecruitment.updataBtn = com.focusPage("#updataBtn", "#recruitment").bindClick(saveData);
    updateRecruitment.cancelBtn = com.focusPage("#cancelBtn", "#recruitment").on("click", function() {

        com.closePopup();
    });

    updateRecruitment.items.name = com.focusPage("#name", "#updateRecruitment");
    updateRecruitment.items.identity = com.focusPage("#identity", "#updateRecruitment");
    updateRecruitment.items.nation = com.focusPage("#nation", "#updateRecruitment");
    updateRecruitment.items.place = com.focusPage("#place", "#updateRecruitment");
    updateRecruitment.items.weight = com.focusPage("#weight", "#updateRecruitment");
    updateRecruitment.items.height = com.focusPage("#height", "#updateRecruitment");
    updateRecruitment.items.employWay = com.focusPage("#employWay", "#updateRecruitment");
    updateRecruitment.items.householdType = com.focusPage("#householdType", "#updateRecruitment");
    updateRecruitment.items.political = com.focusPage("#political", "#updateRecruitment");
    updateRecruitment.items.education = com.focusPage("#education", "#updateRecruitment");
    updateRecruitment.items.phone = com.focusPage("#phone", "#updateRecruitment");
    updateRecruitment.items.wechat = com.focusPage("#wechat", "#updateRecruitment");
    updateRecruitment.items.qq = com.focusPage("#qq", "#updateRecruitment");
    updateRecruitment.items.address = com.focusPage("#address", "#updateRecruitment");
    updateRecruitment.items.nativePlace = com.focusPage("#nativePlace", "#updateRecruitment");
    updateRecruitment.items.hometownPlace = com.focusPage("#hometownPlace", "#updateRecruitment");
    updateRecruitment.items.specialty = com.focusPage("#specialty", "#updateRecruitment");
    updateRecruitment.items.emergencyMan = com.focusPage("#emergencyMan", "#updateRecruitment");
    updateRecruitment.items.emergencyPhone = com.focusPage("#emergencyPhone", "#updateRecruitment");
    updateRecruitment.items.employWay.bindData(constant.personel().recruitment.employWay.datas, "key", "value");
    updateRecruitment.items.householdType.bindData(constant.personel().userInfo.householdType.datas, "key", "value");
    updateRecruitment.items.political.bindData(constant.personel().recruitment.political.datas, "key", "value");
    updateRecruitment.items.education.bindData(constant.personel().recruitment.education.datas, "key", "value");

    updateRecruitment.items.isMarried = com.focusPage("#isMarried", "#updateRecruitment");
    updateRecruitment.items.nation = com.focusPage("#nation", "#updateRecruitment");
    updateRecruitment.items.isBirth = com.focusPage("#isBirth", "#updateRecruitment");
    updateRecruitment.items.isHouse = com.focusPage("#isHouse", "#updateRecruitment");
    updateRecruitment.items.isCar = com.focusPage("#isCar", "#updateRecruitment");
    updateRecruitment.items.isHouseLoan = com.focusPage("#isHouseLoan", "#updateRecruitment");
    updateRecruitment.items.isCarLoan = com.focusPage("#isCarLoan", "#updateRecruitment");
    updateRecruitment.items.isCarID = com.focusPage("#isCarID", "#updateRecruitment");
    updateRecruitment.items.isPassID = com.focusPage("#isPassID", "#updateRecruitment");
    updateRecruitment.items.isHMID = com.focusPage("#isHMID", "#updateRecruitment");
    updateRecruitment.items.isTWID = com.focusPage("#isTWID", "#updateRecruitment");
    updateRecruitment.items.isContract = com.focusPage("#isContract", "#updateRecruitment");
    updateRecruitment.items.isSnsurance = com.focusPage("#isSnsurance", "#updateRecruitment");
    updateRecruitment.items.isFire = com.focusPage("#isFire", "#updateRecruitment");
    updateRecruitment.items.isCnsurance = com.focusPage("#isCnsurance", "#updateRecruitment");
    updateRecruitment.items.isCompete = com.focusPage("#isCompete", "#updateRecruitment");
    updateRecruitment.items.isTrain = com.focusPage("#isTrain", "#updateRecruitment");
    updateRecruitment.items.isCriminal = com.focusPage("#isCriminal", "#updateRecruitment");
    updateRecruitment.items.isDisease = com.focusPage("#isDisease", "#updateRecruitment");

    // 编辑用户, 获取用户信息
    com.post(api.personel.queryRecruitmentByRid, {
        "recruitment.rid": params.rid
    }, function(res) {

        var $recruitment = res.recruitment;

        updateRecruitment.items.name.val($recruitment.name), updateRecruitment.items.identity.val($recruitment.identity), updateRecruitment.items.nation.val($recruitment.nation), updateRecruitment.items.place.val($recruitment.place), updateRecruitment.items.weight.val($recruitment.weight), updateRecruitment.items.height.val($recruitment.height), updateRecruitment.items.nation.val($recruitment.nation), updateRecruitment.items.employWay.val($recruitment.employWay), updateRecruitment.items.householdType.val($recruitment.householdType), updateRecruitment.items.political.val($recruitment.political), updateRecruitment.items.education.val($recruitment.education), updateRecruitment.items.phone.val($recruitment.phone), updateRecruitment.items.wechat.val($recruitment.wechat), updateRecruitment.items.qq.val($recruitment.qq), updateRecruitment.items.address.val($recruitment.address), updateRecruitment.items.nativePlace.val($recruitment.nativePlace), updateRecruitment.items.hometownPlace.val($recruitment.hometownPlace),
            updateRecruitment.items.specialty.val($recruitment.specialty), updateRecruitment.items.emergencyMan.val($recruitment.emergencyMan), updateRecruitment.items.emergencyPhone.val($recruitment.emergencyPhone),

            com.focusPage("#isMarried").prop("checked", updateRecruitment.getProp[$recruitment.isMarried]);
        com.focusPage("#isBirth").prop("checked", updateRecruitment.getProp[$recruitment.isBirth]);
        com.focusPage("#isHouse").prop("checked", updateRecruitment.getProp[$recruitment.isHouse]);
        com.focusPage("#isCar").prop("checked", updateRecruitment.getProp[$recruitment.isCar]);
        com.focusPage("#isHouseLoan").prop("checked", updateRecruitment.getProp[$recruitment.isHouseLoan]);
        com.focusPage("#isCarLoan").prop("checked", updateRecruitment.getProp[$recruitment.isCarLoan]);
        com.focusPage("#isCarID").prop("checked", updateRecruitment.getProp[$recruitment.isCarID]);
        com.focusPage("#isPassID").prop("checked", updateRecruitment.getProp[$recruitment.isPassID]);
        com.focusPage("#isHMID").prop("checked", updateRecruitment.getProp[$recruitment.isHMID]);
        com.focusPage("#isTWID").prop("checked", updateRecruitment.getProp[$recruitment.isTWID]);
        com.focusPage("#isContract").prop("checked", updateRecruitment.getProp[$recruitment.isContract]);
        com.focusPage("#isSnsurance").prop("checked", updateRecruitment.getProp[$recruitment.isSnsurance]);
        com.focusPage("#isFire").prop("checked", updateRecruitment.getProp[$recruitment.isFire]);
        com.focusPage("#isCnsurance").prop("checked", updateRecruitment.getProp[$recruitment.isCnsurance]);
        com.focusPage("#isCompete").prop("checked", updateRecruitment.getProp[$recruitment.isCompete]);
        com.focusPage("#isTrain").prop("checked", updateRecruitment.getProp[$recruitment.isTrain]);
        com.focusPage("#isCriminal").prop("checked", updateRecruitment.getProp[$recruitment.isCriminal]);
        com.focusPage("#isDisease").prop("checked", updateRecruitment.getProp[$recruitment.isDisease]);

    });

    function saveData() {

        var options = {

            "recruitment.rid": params.rid,
            "recruitment.name": updateRecruitment.items.name.val(),
            "recruitment.phone": updateRecruitment.items.phone.val(),
            "recruitment.identity": updateRecruitment.items.identity.val(),
            "recruitment.height": updateRecruitment.items.height.val(),
            "recruitment.weight": updateRecruitment.items.weight.val(),
            "recruitment.nation": updateRecruitment.items.nation.val(),
            "recruitment.place": updateRecruitment.items.place.val(),
            "recruitment.hometownPlace": updateRecruitment.items.hometownPlace.val(),
            "recruitment.qq": updateRecruitment.items.qq.val(),
            "recruitment.wechat": updateRecruitment.items.wechat.val(),
            "recruitment.employWay": updateRecruitment.items.employWay.val(),
            "recruitment.political": updateRecruitment.items.political.val(),
            "recruitment.householdType": updateRecruitment.items.householdType.val(),
            "recruitment.nativePlace": updateRecruitment.items.nativePlace.val(),
            "recruitment.education": updateRecruitment.items.education.val(),
            "recruitment.address": updateRecruitment.items.address.val(),
            "recruitment.specialty": updateRecruitment.items.specialty.val(),
            "recruitment.emergencyMan": updateRecruitment.items.emergencyMan.val(),
            "recruitment.emergencyPhone": updateRecruitment.items.emergencyPhone.val(),

            "recruitment.isMarried": updateRecruitment.getProp[updateRecruitment.items.isMarried.prop("checked")],
            "recruitment.isCarID": updateRecruitment.getProp[updateRecruitment.items.isCarID.prop("checked")],
            "recruitment.isBirth": updateRecruitment.getProp[updateRecruitment.items.isBirth.prop("checked")],
            "recruitment.isHouse": updateRecruitment.getProp[updateRecruitment.items.isHouse.prop("checked")],
            "recruitment.isCar": updateRecruitment.getProp[updateRecruitment.items.isCar.prop("checked")],
            "recruitment.isCarLoan": updateRecruitment.getProp[updateRecruitment.items.isCarLoan.prop("checked")],
            "recruitment.isHouseLoan": updateRecruitment.getProp[updateRecruitment.items.isHouseLoan.prop("checked")],
            "recruitment.isPassID": updateRecruitment.getProp[updateRecruitment.items.isPassID.prop("checked")],
            "recruitment.isHMID": updateRecruitment.getProp[updateRecruitment.items.isHMID.prop("checked")],
            "recruitment.isTWID": updateRecruitment.getProp[updateRecruitment.items.isTWID.prop("checked")],
            "recruitment.isContract": updateRecruitment.getProp[updateRecruitment.items.isContract.prop("checked")],
            "recruitment.isSnsurance": updateRecruitment.getProp[updateRecruitment.items.isSnsurance.prop("checked")],
            "recruitment.isFire": updateRecruitment.getProp[updateRecruitment.items.isFire.prop("checked")],
            "recruitment.isCnsurance": updateRecruitment.getProp[updateRecruitment.items.isCnsurance.prop("checked")],
            "recruitment.isTrain": updateRecruitment.getProp[updateRecruitment.items.isTrain.prop("checked")],
            "recruitment.isCompete": updateRecruitment.getProp[updateRecruitment.items.isCompete.prop("checked")],
            "recruitment.isCriminal": updateRecruitment.getProp[updateRecruitment.items.isCriminal.prop("checked")],
            "recruitment.isDisease": updateRecruitment.getProp[updateRecruitment.items.isDisease.prop("checked")],

        };

        com.post(api.personel.updateRecruitment, options, function(res) {

            com.closePopup();
            com.showAlert(com.info, "编辑成功");
        });

    }

});
