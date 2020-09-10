
var printer = null;

var Printer = function(){
    
    var name = "Fanglin-Gprinter";

    var iconv = null;
    var ffi = null;
    var lib = null;
    
    var test = function(options){
        
        /**
           打印测试方法
           打印机规格 , 佳博GP1324D蓝牙版
           纸张规格 , 热敏打印纸57x50
        */
        
        if(lib == null || iconv == null || ffi == null) return false;
        
        lib.openport(name);
        lib.clearbuffer();
        lib.setup("100", "60", "5", "8", "0", "0", "0");
        lib.printerfont("200", "0", "3", "0", "1", "1", "(JAVA) DLL Test!!");
        lib.barcode("200", "30", "128", "50", "1", "0", "2", "2", "123456789");
        lib.printerfont("200", "110", "TSS24.BF2", "0", "1", "1", iconv.encode("白添宇制作", 'gbk'));
        lib.printerfont("200", "140", "TSS24.BF2", "0", "1", "1", iconv.encode("辽宁方林装饰工程有限公司", 'gbk'));
        lib.windowsfont(200, 170, 30, 0, 0, 0, "arial", iconv.encode("白添宇制作", 'gbk'));
        lib.windowsfont(200, 200, 30, 0, 0, 0, "arial", iconv.encode("辽宁方林装饰工程有限公司", 'gbk'));
        lib.sendcommand('QRCODE 250,240,H,8,A,0,M2,S7,"fanglinserver:FL-00479"');
        lib.printlabel("1", "1");
        lib.closeport();
    }
    
    var payment = function(options){
        /**
            销售单补款
            打印机规格 , 佳博GP1324D蓝牙版
            纸张规格 , 热敏打印纸110x50
         */
        
        console.log(options);
    
        if(lib == null || iconv == null || ffi == null) return false;
        
        var length = options.payments.length + options.receipts.length;
        
        var height = String(length * 5 + 100);
        
        lib.openport(name);
        lib.clearbuffer();
        lib.setup("100", height, "3", "8", "0", "0", "0");
        
        var left = 5;
        var top = 140;
        
        var lineH = 40;
        var lineHB = 45;
        
        var line = top;
        
        var titleOffset = 250 - options.title.length * 15;
        
        lib.windowsfont(titleOffset, 50, 65, 0, 2, 0, "arial", iconv.encode(options.title, 'gbk'));
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("装修单号: " + options.orderId, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("楼盘地址: " + options.orderAddr, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("收款时间: " + options.collectTime, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("金额: " + parseInt(options.referMoney), 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("大写: " + options.capitalize, 'gbk'));line = line + lineHB;
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        lib.windowsfont(5, line, 30, 0, 0, 0, "arial", iconv.encode("收款类型", 'gbk'));
        lib.windowsfont(650, line, 30, 0, 0, 0, "arial", iconv.encode("收款金额", 'gbk'));line = line + lineH;
        
        $.each(options.payments, function(i, v){
            
            lib.windowsfont(5, line, 30, 0, 0, 0, "arial", iconv.encode(v.paymentType, 'gbk'));
            lib.windowsfont(650, line, 30, 0, 0, 0, "arial", iconv.encode(v.money, 'gbk'));
            
            line = line + lineH;
        });
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        lib.windowsfont(5, line, 30, 0, 0, 0, "arial", iconv.encode("结算方式", 'gbk'));
        lib.windowsfont(650, line, 30, 0, 0, 0, "arial", iconv.encode("金额", 'gbk'));line = line + lineH;
        
        $.each(options.receipts, function(i, v){
            
            if(v.paymentWay == '刷卡' || v.paymentWay == "银行"){
                v.paymentWay = v.paymentWay + " " + v.bankInfo;
            }
            
            lib.windowsfont(5, line, 30, 0, 0, 0, "arial", iconv.encode(v.paymentWay, 'gbk'));
            lib.windowsfont(650, line, 30, 0, 0, 0, "arial", iconv.encode(v.money, 'gbk'));
            
            line = line + lineH;
        });
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("收款人: " + options.collecter, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("交款人: ", 'gbk'));line = line + lineH;
        
        lib.printlabel("1", "1");
        lib.closeport();
    }
    
    var salesPayment = function(options){
        /**
            销售单补款
            打印机规格 , 佳博GP1324D蓝牙版
            纸张规格 , 热敏打印纸110x50
         */
    
        if(lib == null || iconv == null || ffi == null) return false;
        
        var length = options.payments.length + options.receipts.length;
        
        var height = String(length * 5 + 120);
        
        lib.openport(name);
        lib.clearbuffer();
        lib.setup("100", height, "3", "8", "0", "0", "0");
        
        var left = 5;
        var top = 140;
        
        var lineH = 40;
        var lineHB = 45;
        
        var line = top;
        
        var titleOffset = 250 - options.title.length * 15;
        
        lib.windowsfont(titleOffset, 50, 60, 0, 2, 0, "arial", iconv.encode(options.title, 'gbk'));
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("装修单号: " + options.orderId, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("楼盘地址: " + options.orderAddr, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("收款时间: " + options.collectTime, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("金额: " + parseInt(options.referMoney), 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("大写: " + options.capitalize, 'gbk'));line = line + lineHB;
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        lib.windowsfont(5, line, 30, 0, 0, 0, "arial", iconv.encode("品牌", 'gbk'));
        lib.windowsfont(500, line, 30, 0, 0, 0, "arial", iconv.encode("收款类型", 'gbk'));
        lib.windowsfont(650, line, 30, 0, 0, 0, "arial", iconv.encode("收款金额", 'gbk'));line = line + lineH;
        
        $.each(options.payments, function(i, v){
            
            lib.windowsfont(5, line, 30, 0, 0, 0, "arial", iconv.encode(v.salesBrand, 'gbk'));
            lib.windowsfont(500, line, 30, 0, 0, 0, "arial", iconv.encode(v.paymentType, 'gbk'));
            lib.windowsfont(650, line, 30, 0, 0, 0, "arial", iconv.encode(v.money, 'gbk'));
            
            line = line + lineH;
        });
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        lib.windowsfont(5, line, 30, 0, 0, 0, "arial", iconv.encode("结算方式", 'gbk'));
        lib.windowsfont(650, line, 30, 0, 0, 0, "arial", iconv.encode("金额", 'gbk'));line = line + lineH;
        
        $.each(options.receipts, function(i, v){
            
            if(v.paymentWay == '刷卡' || v.paymentWay == "银行"){
                v.paymentWay = v.paymentWay + " " + v.bankInfo;
            }
            
            lib.windowsfont(5, line, 30, 0, 0, 0, "arial", iconv.encode(v.paymentWay, 'gbk'));
            lib.windowsfont(650, line, 30, 0, 0, 0, "arial", iconv.encode(v.money, 'gbk'));
            
            line = line + lineH;
        });
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("收款人: " + options.collecter, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("交款人: ", 'gbk'));line = line + lineH;
        
        lib.printlabel("1", "1");
        lib.closeport();
    }
    
    var salesPaymentForDeposit = function(options){
        /**
            销售单定金
            打印机规格 , 佳博GP1324D蓝牙版
            纸张规格 , 热敏打印纸110x50
            
            装修单号    1911300005  
            楼盘地址    鹏程花园二期 H6#12-06-14
            设计师 许文鸽 
            监理  许文鸽
            销售单号    1911300003  
            品牌  三星电器
            开票日期    2019-11-30
            实收金额    3041.077
            大写  叁仟零肆拾壹元柒分
            客户确认
            客户电话
            销售经手人
            品牌服务电话
            客户须知
         */
        
        if(lib == null || iconv == null || ffi == null) return false;

        lib.openport(name);
        lib.clearbuffer();
        lib.setup("100", "120", "3", "8", "0", "0", "0");
        
        var left = 5;
        var top = 140;
        
        var lineH = 40;
        var lineHB = 45;
        
        var line = top;
        
        var titleOffset = 250 - options.title.length * 15;
        
        lib.windowsfont(titleOffset, 50, 58, 0, 2, 0, "arial", iconv.encode(options.title, 'gbk'));
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("装修单号: " + options.orderId, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("楼盘地址: " + options.orderAddr, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("设计师: " + options.designer, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("监理: " + options.supervisor, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("销售单号: " + options.salesNo, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("品牌: " + options.brand, 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("开票日期: " + options.createTime, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("应收金额: " + options.referMoney, 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("实收金额: " + parseInt(options.referMoney), 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("大写: " + options.capitalize, 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("客户确认: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("客户电话: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("销售经手人: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("品牌服务电话: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("客户须知: ", 'gbk'));line = line + lineH;
        
        lib.printlabel("1", "1");
        lib.closeport();
    }
    
    var salesPaymentForFullpay = function(options){
        /**
            销售单补款
            打印机规格 , 佳博GP1324D蓝牙版
            纸张规格 , 热敏打印纸110x50
         */
        
        if(lib == null || iconv == null || ffi == null) return false;
        
        var length = options.salesItems.length;
        
        var height = String(length * 5 + 120);
        
        lib.openport(name);
        lib.clearbuffer();
        lib.setup("100", height, "3", "8", "0", "0", "0");
        
        var left = 5;
        var top = 140;
        
        var lineH = 40;
        var lineHB = 45;
        
        var line = top;
        
        var titleOffset = 250 - options.title.length * 15;
        
        lib.windowsfont(titleOffset, 50, 58, 0, 2, 0, "arial", iconv.encode(options.title, 'gbk'));
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("装修单号: " + options.orderId, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("楼盘地址: " + options.orderAddr, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("设计师: " + options.designer, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("监理: " + options.supervisor, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("销售单号: " + options.salesNo, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("品牌: " + options.brand, 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("开票日期: " + options.createTime, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("应收金额: " + options.referMoney, 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("实收金额: " + parseInt(options.referMoney), 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("大写: " + options.capitalize, 'gbk'));line = line + lineHB;
        
        lib.windowsfont(5, line, 25, 0, 0, 0, "arial", iconv.encode("商品", 'gbk'));
        lib.windowsfont(260, line, 25, 0, 0, 0, "arial", iconv.encode("单位", 'gbk'));
        lib.windowsfont(310, line, 25, 0, 0, 0, "arial", iconv.encode("数量", 'gbk'));
        lib.windowsfont(380, line, 25, 0, 0, 0, "arial", iconv.encode("单价", 'gbk'));
        lib.windowsfont(460, line, 25, 0, 0, 0, "arial", iconv.encode("总价", 'gbk'));
        lib.windowsfont(540, line, 25, 0, 0, 0, "arial", iconv.encode("备注", 'gbk'));line = line + lineH;
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        $.each(options.salesItems, function(i, v){
            
            lib.windowsfont(5, line, 25, 0, 0, 0, "arial", iconv.encode(v.name.substr(0, 15), 'gbk'));
            lib.windowsfont(260, line, 25, 0, 0, 0, "arial", iconv.encode(v.unit, 'gbk'));
            lib.windowsfont(310, line, 25, 0, 0, 0, "arial", iconv.encode(v.num, 'gbk'));
            lib.windowsfont(380, line, 25, 0, 0, 0, "arial", iconv.encode(v.price, 'gbk'));
            lib.windowsfont(460, line, 25, 0, 0, 0, "arial", iconv.encode(v.total, 'gbk'));
            lib.windowsfont(540, line, 25, 0, 0, 0, "arial", iconv.encode(v.comment.substr(0, 15), 'gbk'));
            
            line = line + lineH;
        });
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("客户确认: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("客户电话: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("销售经手人: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("品牌服务电话: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("客户须知: ", 'gbk'));line = line + lineH;
        
        lib.printlabel("1", "1");
        lib.closeport();
    }
    
    var salesPaymentForRefund = function(options){
        /**
            打印测试方法
            打印机规格 , 佳博GP1324D蓝牙版
            纸张规格 , 热敏打印纸110x50
         */
        
        if(lib == null || iconv == null || ffi == null) return false;

        var length = options.salesItems.length;
        
        var height = String(length * 5 + 150);
        
        lib.openport(name);
        lib.clearbuffer();
        lib.setup("100", height, "3", "8", "0", "0", "0");
        
        var left = 5;
        var top = 140;
        
        var lineH = 40;
        var lineHB = 45;
        
        var line = top;
        
        var titleOffset = 250 - options.title.length * 15;
        
        lib.windowsfont(titleOffset, 50, 60, 0, 2, 0, "arial", iconv.encode(options.title, 'gbk'));
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("装修单号: " + options.orderId, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("楼盘地址: " + options.orderAddr, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("设计师: " + options.designer, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("监理: " + options.supervisor, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("销售单号: " + options.salesNo, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("品牌: " + options.brand, 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("开票日期: " + options.createTime, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("应收金额: " + options.referMoney, 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("实收金额: " + parseInt(options.referMoney), 'gbk'));line = line + lineHB;
        lib.windowsfont(5, line, 38, 0, 2, 0, "arial", iconv.encode("大写: " + options.capitalize, 'gbk'));line = line + lineHB;
        
        lib.windowsfont(5, line, 25, 0, 0, 0, "arial", iconv.encode("商品", 'gbk'));
        lib.windowsfont(260, line, 25, 0, 0, 0, "arial", iconv.encode("单位", 'gbk'));
        lib.windowsfont(310, line, 25, 0, 0, 0, "arial", iconv.encode("数量", 'gbk'));
        lib.windowsfont(380, line, 25, 0, 0, 0, "arial", iconv.encode("单价", 'gbk'));
        lib.windowsfont(460, line, 25, 0, 0, 0, "arial", iconv.encode("总价", 'gbk'));
        lib.windowsfont(540, line, 25, 0, 0, 0, "arial", iconv.encode("备注", 'gbk'));line = line + lineH;
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        $.each(options.salesItems, function(i, v){
            
            lib.windowsfont(5, line, 25, 0, 0, 0, "arial", iconv.encode(v.name, 'gbk'));
            lib.windowsfont(260, line, 25, 0, 0, 0, "arial", iconv.encode(v.unit, 'gbk'));
            lib.windowsfont(310, line, 25, 0, 0, 0, "arial", iconv.encode(v.num, 'gbk'));
            lib.windowsfont(380, line, 25, 0, 0, 0, "arial", iconv.encode(v.price, 'gbk'));
            lib.windowsfont(460, line, 25, 0, 0, 0, "arial", iconv.encode(v.total, 'gbk'));
            lib.windowsfont(540, line, 25, 0, 0, 0, "arial", iconv.encode(v.comment.substr(0, 15), 'gbk'));
            
            line = line + lineH;
        });
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("银行: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("卡号: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("开户行省份: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("开户行城市: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("开户行网点: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("持卡人姓名: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("持卡人电话: ", 'gbk'));line = line + lineH;
        
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("客户确认: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("客户电话: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("退款经手人: ", 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("备注: 客户打款在退款办理后7个工作日到账", 'gbk'));line = line + lineH;
        
        lib.printlabel("1", "1");
        lib.closeport();
    }
    
    var vaward = function(options){
        /**
            打印测试方法
            打印机规格 , 佳博GP1324D蓝牙版
            纸张规格 , 热敏打印纸110x50
         */
         
        if(lib == null || iconv == null || ffi == null) return false;

        var length = options.items.length;
        
        var height = String(length * 5 + 80);
        
        lib.openport(name);
        lib.clearbuffer();
        lib.setup("100", height, "3", "8", "0", "0", "0");
        
        var left = 5;
        var top = 140;
        
        var lineH = 40;
        var lineHB = 45;
        
        var line = top;
        
        var titleOffset = 250 - options.title.length * 15;
        
        lib.windowsfont(titleOffset, 50, 60, 0, 2, 0, "arial", iconv.encode(options.title, 'gbk'));
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("票号: " + options.no, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("楼盘地址: " + options.address, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("设计师: " + options.belonger, 'gbk'));line = line + lineH;
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("活动名称: " + options.title, 'gbk'));line = line + lineH;
        
        lib.windowsfont(5, line, 25, 0, 0, 0, "arial", iconv.encode("奖品名称", 'gbk'));
        lib.windowsfont(310, line, 25, 0, 0, 0, "arial", iconv.encode("单位", 'gbk'));
        lib.windowsfont(500, line, 25, 0, 0, 0, "arial", iconv.encode("数量", 'gbk'));line = line + lineH;
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        $.each(options.items, function(i, v){
            
            lib.windowsfont(5, line, 25, 0, 0, 0, "arial", iconv.encode(v.name, 'gbk'));
            lib.windowsfont(310, line, 25, 0, 0, 0, "arial", iconv.encode(v.unit, 'gbk'));
            lib.windowsfont(500, line, 25, 0, 0, 0, "arial", iconv.encode(v.num, 'gbk'));
            
            line = line + lineH;
        });
        
        lib.sendcommand('BAR 5,' + line + ',750,2');line = line + lineH;
        
        lib.windowsfont(5, line, 35, 0, 0, 0, "arial", iconv.encode("客户签字: ", 'gbk'));line = line + lineH;
        
        lib.printlabel("1", "1");
        lib.closeport();
    }
    
    var about = function(){
        
        /**
           动态库提示信息
        */
        
        if(lib == null || iconv == null || ffi == null) return false;
        
        lib.about();
    }
    
    return {
        name: "",
        args: {},
        init: function(){
            
            this.about = about;
            this.test = test;
            
            this.payment = payment;
            this.salesPayment = salesPayment;
            
            this.salesPaymentForDeposit = salesPaymentForDeposit;
            this.salesPaymentForFullpay = salesPaymentForFullpay;
            this.salesPaymentForRefund = salesPaymentForRefund;
            
            this.vaward = vaward;
            
            printer = this;

            if(!parent.window.isPC){
                return false;
            }
            
            try {
                iconv = require('iconv-lite');  
                ffi = require('ffi');
                
                lib = ffi.Library('TSCLIB.dll',{
                    'about': ['int', []],
                    'openport': ['int', ['string']],
                    'clearbuffer': ['int', []],
                    'setup': ['int', ['string','string','string','string','string','string','string']],
                    'printerfont': ['int', ['string','string','string','string','string','string','string']],
                    'barcode': ['int', ['string','string','string','string','string','string','string','string','string']],
                    'windowsfont': ['int', ['int', 'int', 'int', 'int', 'int', 'int', 'string', 'string']],
                    'sendcommand': ['int', ['string']],
                    'printlabel': ['int', ['string','string']],
                    'closeport': ['int', []]
                });
            } catch(err) {
                console.log("no printer");
            }
            
            return this;
        },
        handle: function(name, options){
            
            /**
                调用方式
                new Printer().init().handle("test1", {"name": "baity"});
                printer.handle("test1", {"name": "baity"});
            */
            
            if(!name || !options){
                name = this.name;
                options = this.args;
            }
            
            this[name] && this[name](options);
            
            this.name = "";
            this.args = {};
        }
    }
};
