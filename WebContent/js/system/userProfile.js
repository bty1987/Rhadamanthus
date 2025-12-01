jQuery(function($) {

    var userProfile = {
        userPhoto: "",
        age: null,
        phone: "",
        qq: "",
        wechat: "",
        email: "",
        emergencyMan: "",
        emergencyPhone: "",
        ossConfig: null
    };

    com.focusPage("#removePicture").on("click", removePicture);
    var userid = -null;
    com.post(api.personel.queryUserForSelfByUserId, {}, function(res) {

        userProfile.userPhoto = res.userInfo.user.userPhoto;
        userProfile.age = res.userInfo.age;
        userProfile.phone = res.userInfo.user.phone;
        userProfile.emergencyMan = res.userInfo.emergencyMan;
        userProfile.emergencyPhone = res.userInfo.emergencyPhone;
        userProfile.qq = res.userInfo.qq;
        userProfile.wechat = res.userInfo.wechat;
        userProfile.email = res.userInfo.email;

        userid = res.userInfo.user.userId;
        initUser();

    }, null, false);

    function initUser() {

        com.focusPage("#age").val(userProfile.age);
        com.focusPage("#telephone").val(userProfile.phone);
        com.focusPage("#qq").val(userProfile.qq);
        com.focusPage("#wechat").val(userProfile.wechat);
        com.focusPage("#email").val(userProfile.email);
        com.focusPage("#emergencyMan").val(userProfile.emergencyMan);
        com.focusPage("#emergencyPhone").val(userProfile.emergencyPhone);
        com.focusPage("#picture").val(userProfile.userPhoto);
        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), userProfile.userPhoto, 150, 150, ''));
    }

    com.post(api.upgrade.generatePostSignature, {}, function(data) {

        userProfile.ossConfig = data.ossConfig;
        imageUrl();
    }, null, false);

    com.focusPage("#reset").on("click", function() {

        initUser();
    });

    com.focusPage("#saveBtn").on("click", function() {

        if (com.validate("edit-basic")) {
            return false;
        }

        parm = {
            "userInfo.user.userPhoto": com.focusPage("#picture").val(),
            "userInfo.user.userId": userid,
            "userInfo.user.phone": com.focusPage("#telephone").val(),
            "userInfo.age": com.focusPage("#age").val(),
            "userInfo.emergencyMan": com.focusPage("#emergencyMan").val(),
            "userInfo.emergencyPhone": com.focusPage("#emergencyPhone").val(),
            "userInfo.qq": com.focusPage("#qq").val(),
            "userInfo.wechat": com.focusPage("#wechat").val(),
            "userInfo.email": com.focusPage("#email").val()
        };

        com.post(api.personel.updateUserForBaseInfo, parm, function(res) {

            userProfile.userPhoto = com.focusPage("#picture").val();
            userProfile.age = com.focusPage("#age").val();
            userProfile.phone = com.focusPage("#telephone").val();
            userProfile.emergencyMan = com.focusPage("#emergencyMan").val();
            userProfile.emergencyPhone = com.focusPage("#emergencyPhone").val();
            userProfile.qq = com.focusPage("#qq").val();
            userProfile.wechat = com.focusPage("#wechat").val();
            userProfile.email = com.focusPage("#email").val();
            com.showAlert(com.info, "操作成功");
        });

    });

    function removePicture() {

        com.focusPage("#showImg").attr("src", "#");
        com.focusPage("#picture").val("");
        com.focusPage("#infoPicture").attr("href", "javascript:void(0)");

    }

    com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success blue col-md-12', '*.jpg;*.jpge;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        com.focusPage("#picture").val(data.resUrl);
        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));
    });

    // 获取aliyun-oss保存图片地址Url
    function imageUrl() {

        com.post(api.upgrade.getProgressiveImage, {
            "ossConfig.key": userid
        }, function(data) {

            if (data.ossConfig.url) {
                com.focusPage("#showImg").attr("src", data.ossConfig.url).show();
            }
        });
    }

    com.focusPage('#pictureUpload').find('input[type="file"]').on("change", function() {

        var file = this.files[0];

        var fileType = file.type;
        var allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!fileType.startsWith('image/') || !allowedTypes.includes(fileType)) {
            this.value = '';
            return false;
        }

        var ossConfig = userProfile.ossConfig;

        var formData = new FormData();
        formData.append('name', file.name);
        formData.append('policy', ossConfig.policy);
        formData.append('OSSAccessKeyId', ossConfig.accessKeyId);
        formData.append('success_action_status', '200');
        formData.append('signature', ossConfig.signature);
        formData.append('key', ossConfig.dir + userid);
        formData.append('file', file);

        fetch(ossConfig.host, {
            method: 'POST',
            body: formData
        }).then(function(res) {

            imageUrl();
        });

    });

});
