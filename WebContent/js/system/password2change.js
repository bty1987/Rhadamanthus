jQuery(function($) {

    var password = {
        password: "",
        rePassword: "",
        sameFalg: true,
    };

    $("#rePassword").on("blur", function() {

        $this = $(this);
        if ($("#password").val() == $this.val()) {
            com.clearValidator("#rePassword", true);
            password.sameFalg = true;
        } else {
            com.showTips($this, "两次密码不匹配", true);
            password.sameFalg = false;
        }
    });

    $("#saveBtn").on("click", function(e) {
        
        console.log(111)

        if (com.validate("changePasswordContent") || !password.sameFalg) {
            return false;
        }
        
        var param = {
            "password": flcry($("#oldPassword").val()),
            "rePassword": flcry($("#password").val())
        };
        
        if(!validatePassword($("#password").val())){
            com.showAlert(com.error, "新密码强度不足");
            return false;
        }

        com.post(api.personel.changePassword, param, function(res) {

            if (parent.window.isPC) {
                nwRestart();
            } else {
                window.location.href = '/';
            }
        });
    });

    $("#reset").on("click", function(e) {

        $("#password").val("");
        $("#rePassword").val("");
    });

    function validatePassword(password) {

        // 检查各项要求
        var hasMinLength = password.length >= 8;
        var hasLowercase = /[a-z]/.test(password);
        var hasUppercase = /[A-Z]/.test(password);
        var hasNumber = /\d/.test(password);
        var hasSpecial = /[!@#$%^&*]/.test(password);

        // 计算密码强度
        var strength = 0;
        if (hasMinLength)
            strength++;
        if (hasLowercase)
            strength++;
        if (hasUppercase)
            strength++;
        if (hasNumber)
            strength++;
        if (hasSpecial)
            strength++;
        
        console.log(strength)
        console.log(!strength)

        return strength == 5;
    }

});