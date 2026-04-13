var customerAccount = {

    cid: null,

    items: {
        caid: null,
        type: null,
        no: null,
        name: null,
        phone: null,
        address: null,
        bank: null,
        bankno: null
    },

    editMode: false
};

jQuery(document).ready(function() {

    customerAccount.cid = params.customer.cid;

    // 绑定 DOM 元素
    customerAccount.items.caid = $('#accountCaid');
    customerAccount.items.type = $('#accountType');
    customerAccount.items.no = $('#accountNo');
    customerAccount.items.name = $('#accountName');
    customerAccount.items.phone = $('#accountPhone');
    customerAccount.items.address = $('#accountAddress');
    customerAccount.items.bank = $('#accountBank');
    customerAccount.items.bankno = $('#accountBankno');

    // 加载账户列表
    queryAccounts();

    // 添加按钮
    $('#accountAddBtn').on('click', function() {
        customerAccount.editMode = false;
        clearForm();
        $('#accountForm').show();
        $('#accountAddBtnWrap').hide();
    });

    // 取消按钮
    $('#accountCancelBtn').on('click', function() {
        $('#accountForm').hide();
        $('#accountAddBtnWrap').show();
        clearForm();
    });

    // 保存按钮
    $('#accountSaveBtn').on('click', function() {
        saveAccount();
    });
});

function queryAccounts() {

    $('#accountList').empty();

    com.post(api.communion.queryCustomerAccount, {
        "customerAccount.cid": customerAccount.cid
    }, function(res) {

        var accounts = res.customerAccounts || [];

        if (accounts.length == 0) {
            $('#accountList').append('<div class="alert alert-info" style="margin:0">暂无银行账户</div>');
            return;
        }

        $.each(accounts, function(i, v) {

            var $panel = $('<div></div>').addClass('panel panel-default').css({'margin-bottom': '10px'});

            // 标题栏
            var $heading = $('<div></div>').addClass('panel-heading').css({
                'padding': '8px 15px',
                'display': 'flex',
                'justify-content': 'space-between',
                'align-items': 'center'
            });

            var typeLabel = v.type == 1 ? '对公' : '对私';
            var defaultBadge = v.defaults == 1 ? ' <span class="label label-success">默认</span>' : '';
            var statusBadge = v.status == 1 ? ' <span class="label label-danger">已停用</span>' : '';

            $heading.append($('<strong></strong>').html(typeLabel + ' - ' + (v.name || '') + defaultBadge + statusBadge));

            var $btnGroup = $('<div></div>');

            if (v.defaults != 1) {
                var $btnDefault = $('<a></a>').addClass('btn btn-minier btn-success').text('设为默认').css('margin-right', '5px');
                $btnDefault.on('click', function() {
                    setDefault(v.caid);
                });
                $btnGroup.append($btnDefault);
            }

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').text('编辑').css('margin-right', '5px');
            $btnEdit.on('click', function() {
                editAccount(v);
            });
            $btnGroup.append($btnEdit);

            if (v.defaults != 1) {
                var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').text('删除');
                $btnDel.on('click', function() {
                    com.showConfirm('确认删除该账户?', function() {
                        deleteAccount(v.caid);
                    });
                });
                $btnGroup.append($btnDel);
            }

            $heading.append($btnGroup);
            $panel.append($heading);

            // 内容区
            var $body = $('<div></div>').addClass('panel-body').css({'padding': '8px 15px'});

            var infoHtml = '<div class="row">';
            infoHtml += '<div class="col-sm-6"><strong>开户银行:</strong> <span class="grey">' + (v.bank || '') + '</span></div>';
            infoHtml += '<div class="col-sm-6"><strong>银行账号:</strong> <span class="grey">' + (v.bankno || '') + '</span></div>';
            infoHtml += '</div>';

            if (v.no) {
                infoHtml += '<div class="row" style="margin-top:4px"><div class="col-sm-6"><strong>证件号:</strong> <span class="grey">' + v.no + '</span></div>';
            } else {
                infoHtml += '<div class="row" style="margin-top:4px"><div class="col-sm-6">';
            }
            if (v.phone) {
                infoHtml += '<div class="col-sm-6"><strong>电话:</strong> <span class="grey">' + v.phone + '</span></div>';
            }
            infoHtml += '</div>';

            if (v.address) {
                infoHtml += '<div class="row" style="margin-top:4px"><div class="col-sm-12"><strong>地址:</strong> <span class="grey">' + v.address + '</span></div></div>';
            }

            $body.html(infoHtml);
            $panel.append($body);
            $('#accountList').append($panel);
        });
    });
}

function editAccount(v) {

    customerAccount.editMode = true;
    clearForm();

    customerAccount.items.caid.val(v.caid);
    customerAccount.items.type.val(v.type);
    customerAccount.items.no.val(v.no);
    customerAccount.items.name.val(v.name);
    customerAccount.items.phone.val(v.phone);
    customerAccount.items.address.val(v.address);
    customerAccount.items.bank.val(v.bank);
    customerAccount.items.bankno.val(v.bankno);

    $('#accountForm').show();
    $('#accountAddBtnWrap').hide();
}

function saveAccount() {

    var name = customerAccount.items.name.val();
    var bank = customerAccount.items.bank.val();
    var bankno = customerAccount.items.bankno.val();

    if (!name) {
        com.showAlert(com.warning, '请填写户名');
        return;
    }
    if (!bank) {
        com.showAlert(com.warning, '请填写开户银行');
        return;
    }
    if (!bankno) {
        com.showAlert(com.warning, '请填写银行账号');
        return;
    }

    var data = {
        "customerAccount.cid": customerAccount.cid,
        "customerAccount.type": customerAccount.items.type.val(),
        "customerAccount.no": customerAccount.items.no.val(),
        "customerAccount.name": name,
        "customerAccount.phone": customerAccount.items.phone.val(),
        "customerAccount.address": customerAccount.items.address.val(),
        "customerAccount.bank": bank,
        "customerAccount.bankno": bankno
    };

    var apiUrl;
    if (customerAccount.editMode) {
        data["customerAccount.caid"] = customerAccount.items.caid.val();
        apiUrl = api.communion.updateCustomerAccount;
    } else {
        apiUrl = api.communion.addCustomerAccount;
    }

    com.post(apiUrl, data, function() {
        $('#accountForm').hide();
        $('#accountAddBtnWrap').show();
        clearForm();
        queryAccounts();
    });
}

function deleteAccount(caid) {

    com.post(api.communion.deleteCustomerAccount, {
        "customerAccount.caid": caid
    }, function() {
        queryAccounts();
    });
}

function setDefault(caid) {

    com.post(api.communion.setDefaultCustomerAccount, {
        "customerAccount.caid": caid,
        "customerAccount.cid": customerAccount.cid
    }, function() {
        queryAccounts();
    });
}

function clearForm() {
    $('#accountCaid').val('');
    $('#accountType').val('1');
    $('#accountNo').val('');
    $('#accountName').val('');
    $('#accountPhone').val('');
    $('#accountAddress').val('');
    $('#accountBank').val('');
    $('#accountBankno').val('');
}
