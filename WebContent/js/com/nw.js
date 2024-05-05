var http = require('http');
var os = require('os');
var fs = require('fs');
var request = require('request');
var unzip = require('unzip2');
var path = require('path');
var FdfsClient = require('fdfs');
var rimraf = require('rimraf');

var Driver = function() {

    var basicConf = {
        zipPath: null,// 压缩包文件名
        newPath: path.dirname(process.execPath) + "\\", // 文件根目录
        temporary: path.dirname(process.execPath) + "\\temporary\\", // temporary文件夹目录
        license: path.dirname(process.execPath) + "\\package.nw\\license\\LICENSE",
        isRestart: false,
    };

    var driver = {

        /* 读取本地版本 */
        readFile: function() {

            console.log("NW Tools Driver Query Upgrade");

            setTimeout(function() {

                if (config.versionCode != "" && config.versionCode != null) {

                    // 查询数据版本号,进行比对,这里调用接口查询dd版本号,返回适用版本号

                    console.log(config.versionCode);
                    console.log(config.versionCode);

                    var _option = {
                        "upgrade.trialno": config.versionCode
                    };

                    com.post(api.upgrade.matchUpgrade, _option, function(res) {

                        console.log(res);

                        if (res.upgrade.no != null && config.versionCode != res.upgrade.no) {
                            var maxNo = res.maxNo;
                            alert('检测到新版本 , 确定执行更新!(当前版本:' + config.versionCode + ',最新版本:' + maxNo + ')');
                            driver.upgrade(res, maxNo);
                        } else {
                            driver.deleteFile();
                        }

                    }, null);
                }
            }, 5000);
        },
        upgrade: function(res, maxNo) {

            basicConf.isRestart = basicConf.isRestart || res.upgrade.isRestart == 1;

            var size = res.upgrade.fileSize;
            var paths = res.upgrade.path.split('/');

            basicConf.zipPath = paths[paths.length - 1];

            var versionPath = res.upgrade.path; // 获取当前下载目录地址
            var suffix = versionPath.substr(versionPath.lastIndexOf("/") + 1, versionPath.length);
            var _path = basicConf.temporary + suffix;

            var interval = driver.interval(_path, size, res.upgrade.no);

            var media = config.media;

            driver.httpHandle(media + versionPath, _path, basicConf.zipPath, res.upgrade.no, maxNo, interval);
        },
        interval: function(_path, _size, no) {

            $('.progress', '#layerAdd').attr('data-percent', "");
            $('.progress-bar', '#layerAdd').css('width', "");

            layer.closeAll();

            var interval = 0;

            setTimeout(function() {

                layer.open({
                    type: 1,
                    content: $('#layerAdd'),
                    title: no != undefined ? "正在更新,当前更新版本为:" + no : "正在更新",
                    area: ($(window).width() * 0.6 < 620 ? $(window).height() * 0.5 : 620) + "px",
                    closeBtn: 0, // 不显示关闭按钮
                    move: false,
                    skin: 'layui-layer-lan',
                    zIndex: 9999,
                });

                $('#layerAdd').removeClass('hide');

                interval = setInterval(function() {

                    fs.stat(_path, function(err, stat) {

                        var percentage = parseFloat((stat.size / _size) * 100).toFixed(2) + "%";
                        $('.progress', '#layerAdd').attr('data-percent', percentage);
                        $('.progress-bar', '#layerAdd').css('width', percentage);
                    });
                }, 300);

            }, 300);

            return interval;
        },
        deleteFile: function() {

            fs.readdir(basicConf.temporary, function(err, files) {

                if (files.length == 0)
                    return false;

                $.each(files, function(i, v) {

                    rimraf(basicConf.temporary + v, function(err) {

                        if (err)
                            console.log(err)
                    });
                });
            });
        },
        fdfsHandle: function(filepath, _path, zipPath, interval) {

            console.log("Fdfs Handle");

            fdfsClient.download(filepath).then(function(err) {

                console.log("开始下载!");

                driver.decompression(_path, zipPath, interval);
            })
        },
        httpHandle: function(filepath, _path, zipPath, no, maxNo, interval) {

            console.log(filepath);

            var req = http.request(filepath, function(res) {

                console.log(res);
                console.log(res.statusCode);

                if (res.statusCode == "302") {
                    driver.httpHandle(res.headers['location'], _path, zipPath, no, maxNo, interval);
                    return false;
                }

                if (res.statusCode != 200) {
                    driver.failure("Http Request Fail");
                }

                var fileBuff = [];

                res.on('data', function(chunk) {

                    var buffer = new Buffer(chunk);

                    fileBuff.push(buffer);
                });

                res.on('end', function() {

                    var totalBuff = Buffer.concat(fileBuff);

                    fs.appendFile(_path, totalBuff, function(err) {

                        console.log(err);

                        driver.decompression(_path, zipPath, no, maxNo, interval);
                    });
                });
            });

            req.on('error', function(e) {

                driver.failure("Http Download Fail");
            });

            req.end();
        },
        decompression: function(_path, zipPath, no, maxNo, interval) {

            var extract = unzip.Extract({
                path: basicConf.temporary
            });
            // 获取根目录
            fs.createReadStream(_path).pipe(extract); // 解压
            extract.on('close', function() {

                $.getScript(basicConf.temporary + 'upgrade\\upgrade.js').fail(function() {

                    driver.failure('升级包文件缺失.');
                }).done(function() {

                    console.log("加载升级执行文件");
                    var upgrade1 = new upgrade();
                    upgrade1.initCopy(basicConf.temporary, basicConf.newPath + "package.nw\\", function() {

                        console.log("复制文件完成");
                        upgrade1.initDel(basicConf.newPath + "package.nw\\");
                        console.log('更新完成准备重启');

                        setTimeout(function() {

                            upgrade1.initDeleteUpgrade(basicConf.temporary, zipPath, function() {

                                clearInterval(interval);
                                layer.closeAll();
                                $('#layerAdd').addClass('hide');

                                if (no != maxNo) {
                                    com.post(api.upgrade.matchUpgrade, {
                                        "upgrade.trialno": no
                                    }, function(res) {

                                        if (res.upgrade.no == null) {

                                            console.log('重启');

                                            if (basicConf.isRestart) {
                                                alert('更新完成,请点击确定,等待自动重启!');
                                                nwRestart();
                                            } else {
                                                alert('更新完成');
                                            }
                                        } else {
                                            driver.upgrade(res, maxNo);
                                        }
                                    });
                                } else {

                                    console.log('重启'); // 更新完成,执行PC端重启

                                    if (basicConf.isRestart) {
                                        alert('更新完成,请点击确定,等待自动重启!');
                                        nwRestart();
                                    } else {
                                        alert('更新完成');
                                    }
                                }

                            });
                        }, 3000);

                    }, function() {

                        alert('更新失败,请联系相关人员进行更新反馈');
                        nwRestart();
                    });
                });
            });
            extract.on('error', function(err) {

                driver.failure("解压错误");
            });
        },
        failure: function(err) {

            alert('升级失败, ' + err);

            require('nw.gui').Window.get().close();
        },
        importLocalZip: function(successCallback, yesCallback, zIndex) {

            layer.closeAll();
            layer.open({
                type: 1,
                // skin: 'layui-layer-lan',
                title: "载入升级包",
                content: $('#localUpgrade'),
                area: ($(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620) + "px",
                move: false,
                maxmin: false,
                resize: false,
                zIndex: zIndex,
                btn: ['确定'],
                yes: function() {

                    yesCallback();
                },
                success: function(layers, index) {

                    successCallback();
                },
                cancel: function() {

                    layer.closeAll();
                    $('#localUpgradeFile').removeAttr('data-path');
                    $('#localUpgradeFile').removeAttr('data-size');
                    $('#localUpgradeFile').val("");
                }
            });
        },
        importLocalLicense: function(successCallback, yesCallback, zIndex) {

            layer.closeAll();
            layer.open({
                type: 1,
                // skin: 'layui-layer-lan',
                title: "License",
                content: $('#localLicense'),
                area: ($(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620) + "px",
                move: false,
                maxmin: false,
                resize: false,
                zIndex: zIndex,
                btn: ['确定'],
                yes: function() {

                    yesCallback();
                },
                success: function(layers, index) {

                    successCallback();
                },
                cancel: function() {

                    layer.closeAll();
                }
            });
        },
        readLocalLicense: function(callback) {

            console.log("NW Tools Driver ReadLicense");

            fs.readFile(basicConf.license, "utf-8", function(error, data) {

                var licenseNO = "";
                var licenseSN = "";

                console.log(data);

                if (!error) {
                    var options = JSON.parse(data);

                    if (options.licenseNO)
                        licenseNO = options.licenseNO;
                    if (options.licenseSN)
                        licenseSN = options.licenseSN;
                }

                callback(licenseNO, licenseSN);
            });
        },
        updateLocalLicense: function(licenseNO, licenseSN) {

            console.log("NW Tools Driver UpdateLicense");

            var options = {
                "licenseNO": licenseNO,
                "licenseSN": licenseSN
            };

            fs.writeFile(basicConf.license, JSON.stringify(options), "utf-8", function(error) {

                if (err)
                    layer.msg('License更新失败');
            });

            layer.msg('操作成功');
        },
        checkLicense: function(success) {

            console.log("NW Tools Driver CheckLicense");

            driver.readLocalLicense(function(licenseNO, licenseSN) {

                var options = {
                    "licenseNO": licenseNO,
                    "licenseSN": licenseSN
                };

                com.post(api.common.checkLicense, options, function(res) {

                    if (success)
                        success();
                }, function(res) {

                    alert("设备无使用权限,如果有问题请联系管理员.");
                    require('nw.gui').Window.get().close();
                }, false);
            });
        },
        checkMacontrol: function(success, callback) {

            console.log("NW Tools Driver CheckMacontrol");

            var networkInterfaces = os.networkInterfaces();

            var key = 0;
            var options = {};

            $.each(networkInterfaces, function(index, value) {

                for ( var i in value) {

                    var _if = value[i];
                    var family = _if.family.toLowerCase();
                    var mac = _if.mac.replace(/:/g, '').replace(/-/g, '').toLowerCase();
                    var address = _if.address;
                    var internal = _if.internal;

                    if (family == "ipv4" && mac != "000000000000" && address !== '127.0.0.1' && !internal) {
                        options["macontrols[" + key + "].mac"] = mac;
                        options["macontrols[" + key + "].ip"] = address;
                        key++;
                    }
                }
            });

            if (Object.keys(options).length == 0) {
                alert("设备信息获取失败,如果有问题请联系管理员.");
                require('nw.gui').Window.get().close();
            }

            options["user.userId"] = params.userInfo.user.userId;

            com.post(api.common.checkMacontrol, options, function(res) {

                if (success)
                    success();
            }, function(res) {

                // alert("设备无使用权限,如果有问题请联系管理员.");
                // require('nw.gui').Window.get().close();
                if (callback)
                    callback(success);
            }, false);
        },
        initShortcut: function() {

            var option = {
                key: "Ctrl+Command+B",
                active: function() {

                    console.log("全局快捷键: " + this.key + " 被激活.");
                },
                failed: function(msg) {

                    console.log(msg);
                }
            };

            var openwin = new nw.Shortcut({
                key: "Ctrl+Command+O"
            });
            var closewin = new nw.Shortcut({
                key: "Ctrl+Command+C"
            });
            var shutwin = new nw.Shortcut({
                key: "Ctrl+Command+S"
            });
            var fangwin = new nw.Shortcut({
                key: "Ctrl+Command+B"
            });
            var fullwin = new nw.Shortcut({
                key: "F11"
            });

            openwin.on('active', function() {

                nw.Window.get().show();
            });

            closewin.on('active', function() {

                nw.Window.get().hide();
            });

            shutwin.on('active', function() {

                nw.Window.get().close();
            });

            fangwin.on('active', function() {

                console.log("wo shi ni ba");
            });

            fullwin.on('active', function() {

                if (win.isKioskMode) {
                    win.leaveKioskMode();
                    parent.window.document.getElementById("navbar-sun").style.display = "";
                } else {
                    win.enterKioskMode();
                    parent.window.document.getElementById("navbar-sun").style.display = "none";
                }
            })

            nw.App.registerGlobalHotKey(openwin);
            nw.App.registerGlobalHotKey(closewin);
            nw.App.registerGlobalHotKey(shutwin);
            nw.App.registerGlobalHotKey(fangwin);
            nw.App.registerGlobalHotKey(fullwin);
        },
        initTray: function() {

            var apath = path.dirname(process.execPath);

            var tray = new nw.Tray({
                title: '方林服务',
                icon: apath + '\\package.nw\\fanglinHD.png'
            });

            var menu = new nw.Menu();

            var openwin = new nw.MenuItem({
                label: '    打开  ',
                icon: apath + '\\package.nw\\assets\\altogether\\images\\medal-on.png'
            });
            var traywin = new nw.MenuItem({
                label: '    托盘  ',
                icon: apath + '\\package.nw\\assets\\altogether\\images\\coffee.png'
            });
            var shutwin = new nw.MenuItem({
                label: '    关闭  ',
                icon: apath + '\\package.nw\\assets\\altogether\\images\\cancel-on.png'
            });
            var fangwin = new nw.MenuItem({
                label: '  方林服务',
                icon: apath + '\\package.nw\\fanglinHD.png'
            });

            openwin.click = function() {

                nw.Window.get().show();
            }

            traywin.click = function() {

                nw.Window.get().hide();
            }

            shutwin.click = function() {

                nw.Window.get().close();
            }

            menu.append(openwin);
            menu.append(traywin);
            menu.append(shutwin);
            menu.append(fangwin);

            tray.menu = menu;

            tray.click = function() {

                nw.Window.get().show();
            }
        },
        listenClosed: function(callback) {

            nw.Window.get().on('close', function() {

                callback && callback();
            });
        },
        clearPassword: function() {

            chrome.passwordsPrivate.getSavedPasswordList(function(res) {

                $.each(res, function(i, v) {

                    chrome.passwordsPrivate.removeSavedPassword(v.loginPair);
                });
            });
        }

    }

    return {
        init: function() {

            console.log("NW Tools Driver Upgrade");
            driver.deleteFile();
            driver.readFile();
        },
        interval: function(_path, _size) {

            driver.interval(_path, _size);
        },
        decompression: function(_path, interval) {

            driver.decompression(_path, basicConf.zipPath, interval)
        },
        importLocalZip: function(successCallback, yesCallback, zIndex) {

            driver.importLocalZip(successCallback, yesCallback, zIndex)
        },
        importLocalLicense: function(successCallback, yesCallback, zIndex) {

            driver.importLocalLicense(successCallback, yesCallback, zIndex)
        },
        readLocalLicense: function(callback) {

            driver.readLocalLicense(callback);
        },
        updateLocalLicense: function(licenseNO, licenseSN) {

            driver.updateLocalLicense(licenseNO, licenseSN);
        },
        checkMacontrol: function(success, callback) {

            driver.checkMacontrol(success, driver.checkLicense);
        },
        initShortcut: function() {

            driver.initShortcut();
        },
        initTray: function() {

            driver.initTray();
        },
        listen: function() {

        },
        clearCache: function() {

            driver.clearPassword();
        }
    }
}

var nwRestart = function() {

    var child, child_process = require('child_process');
    if (process.platform == "darwin") {
        child = child_process.spawn("open", ["-n", "-a", process.execPath.match(/^([^\0]+?\.app)\//)[1]], {
            detached: true
        });
    } else {
        child = child_process.spawn(process.execPath, [], {
            detached: true
        });
    }
    child.unref();
    require("nw.gui").Window.get().close();
    process._nw_app.quit();
};

var updateWebDB = function(id, val) {

    db.transaction(function(tx) {

        tx.executeSql("update profile set val = ? where id = ?", [val, id],

        function(tx, result) {

            var data = [];
            db.transaction(function(tx) {

                tx.executeSql('SELECT * FROM profile where id = 1', [], function(tx, result) {

                    $.each(result.rows, function(i, v) {

                        data[v.name] = v.val;
                    });
                    config.versionCode = data.versionCode;
                }, function(tx, error) {

                    console.log('查询失败: ' + error.message);
                });
            });
        });
    });
}

$(function() {

    var nwtools = new Driver();

    // nwtools.init();
    window.authentication && nwtools.checkMacontrol(nwtools.init, nwtools.checkMacontrol);

    window.authentication && nwtools.initShortcut();

    window.authentication && nwtools.initTray();

    nwtools.clearCache();
});