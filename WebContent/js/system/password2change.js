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

        if (com.validate("changePasswordContent") || !password.sameFalg) {
            return false;
        }

        var param = {
            "password": $("#oldPassword").val(),
            "rePassword": $("#password").val()
        };

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
});