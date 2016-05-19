
var Project = (function(){

    var projConf = [
        //铲大白
        {
            "proApi" : {
                "url": "queryChanConstructionScheduleByOrderId.do",
                "paramName" : {"orderId" : "chanConstructionSchedule.orderId"},
                "resName" : "chanConstructionSchedule",
                "subIdName" : "ccsId"
            },
            "timeApi" : {
                "url" : "setChanConstructionScheduleForInfo.do",
                "paramName" : {
                    "subid" : "chanConstructionSchedule.ccsId",
                    "startTime" : "chanConstructionSchedule.startTime",
                    "endTime" : "chanConstructionSchedule.endTime"
                },
                "isUnique" : false
            },
            "workApi" : {
                "get" : {
                    "url" : "queryUserForNameByDuty.do",
                    "params" : {"duty" : "铲大白"}
                },
                "add" : {
                    "url" : "setChanConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "chanConstructionSchedule.ccsId",
                        "workerId" : "chanConstructionSchedule.workerId"
                    },
                    "resName" : "chanConstructionSchedule"
                },
                "delete" : {
                    "url" : "setChanConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "chanConstructionSchedule.ccsId",
                        "workerId" : "chanConstructionSchedule.workerId"
                    }
                },
                "isUnique" : true
            },
            "picApi" : {
                "get" : {
                    "url" : "queryChanDrawingByCcsId.do",
                    "paramName" : {
                        "subid" : "chanDrawing.ccsId"
                    },
                    "resName" : "chanDrawings",
                    "picidName" : "cdId"
                },
                "add" : {
                    "url" : "addChanDrawings.do",
                    "paramName" : {
                        "csid" : "chanDrawing.csId",
                        "subid" : "chanDrawing.ccsId",
                        "url" : "drawingUrls",
                        "type" : "chanDrawing.type"
                    }
                },
                "delete" : {
                    "url" : "deleteChanDrawing.do",
                    "paramName" : {
                        "picid" : "chanDrawing.cdId"
                    }
                }
            }

        },
        //放线
        {
            "proApi" : {
                "url": "queryPutlineConstructionScheduleByOrderId.do",
                "paramName" : {"orderId" : "putlineConstructionSchedule.orderId"},
                "resName" : "putlineConstructionSchedule",
                "subIdName" : "plcsId"
            },
            "timeApi" : {
                "url" : "setPutlineConstructionScheduleForInfo.do",
                "paramName" : {
                    "subid" : "putlineConstructionSchedule.plcsId",
                    "time" : "putlineConstructionSchedule.putlineTime"
                },
                "isUnique" : true
            },
            "workApi" : {
                "get" : {
                    "url" : "queryUserForNameByDuty.do",
                    "params" : {"duty" : "放线"}
                },
                "add" : {
                    "url" : "setPutlineConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "putlineConstructionSchedule.plcsId",
                        "workerId" : "putlineConstructionSchedule.workerId"
                    },
                    "resName" : "putlineConstructionSchedule"
                },
                "delete" : {
                    "url" : "setPutlineConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "putlineConstructionSchedule.plcsId",
                        "workerId" : "putlineConstructionSchedule.workerId"
                    }
                },
                "isUnique" : true
            },
            "picApi" : {
                "get" : {
                    "url" : "queryPutlineDrawingByPlcsId.do",
                    "paramName" : {
                        "subid" : "putlineDrawing.plcsId"
                    },
                    "resName" : "putlineDrawings",
                    "picidName" : "pldId"
                },
                "add" : {
                    "url" : "addPutlineDrawings.do",
                    "paramName" : {
                        "csid" : "putlineDrawing.csId",
                        "subid" : "putlineDrawing.plcsId",
                        "url" : "drawingUrls",
                        "type" : "putlineDrawing.type"
                    }
                },
                "delete" : {
                    "url" : "deletePutlineDrawing.do",
                    "paramName" : {
                        "picid" : "putlineDrawing.pldId"
                    }
                }
            }

        },
        //水力电
        {
            "proApi" : {
                "url": "queryWaterwayCircuitPowerConstructionScheduleByOrderId.do",
                "paramName" : {"orderId" : "waterwayCircuitPowerConstructionSchedule.orderId"},
                "resName" : "waterwayCircuitPowerConstructionSchedule",
                "subIdName" : "wcpcsId"
            },
            "timeApi" : {
                "url" : "setWaterwayCircuitPowerConstructionScheduleInfo.do",
                "paramName" : {
                    "subid" : "waterwayCircuitPowerConstructionSchedule.wcpcsId",
                    "startTime" : "waterwayCircuitPowerConstructionSchedule.startTime",
                    "endTime" : "waterwayCircuitPowerConstructionSchedule.endTime"
                },
                "isUnique" : false
            },
            "workApi" : {
                "init" : {
                    "url" : "queryWaterwayCircuitPowerConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "waterwayCircuitPowerConstructionSchedule.wcpcsId"
                    },
                    "resName" : "constructionScheduleWorkers",
                    "workerid" : "wcpcswId"
                },
                "get" : {
                    "url" : "queryUserForNameByDutysAO.do",
                    "params" : { "dutysO[0]" : "水暖工" , "dutysO[1]" : "电工" , "dutysO[2]" : "力工"}
                },
                "add" : {
                    "url" : "addWaterwayCircuitPowerConstructionScheduleWorker.do",
                    "paramName" : {
                        "orderid" : "waterwayCircuitPowerConstructionScheduleWorker.orderId",
                        "subid" : "waterwayCircuitPowerConstructionScheduleWorker.wcpcsId",
                        "workerId" : "waterwayCircuitPowerConstructionScheduleWorker.workerId"
                    },
                    "resName" : "waterwayCircuitPowerConstructionScheduleWorker"
                },
                "delete" : {
                    "url" : "deleteWaterwayCircuitPowerConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "chanConstructionSchedule.ccsId",
                        "workerId" : "waterwayCircuitPowerConstructionScheduleWorker.wcpcswId"
                    }
                },
                "isUnique" : false
            },
            "picApi" : {
                "get" : {
                    "url" : "queryWaterwayCircuitPowerDrawingByWcpcsId.do",
                    "paramName" : {
                        "subid" : "waterwayCircuitPowerDrawing.wcpcsId"
                    },
                    "resName" : "waterwayCircuitPowerDrawings",
                    "picidName" : "wcpdId"
                },
                "add" : {
                    "url" : "addWaterwayCircuitPowerDrawings.do",
                    "paramName" : {
                        "csid" : "waterwayCircuitPowerDrawing.csId",
                        "subid" : "waterwayCircuitPowerDrawing.wcpcsId",
                        "url" : "drawingUrls",
                        "type" : "waterwayCircuitPowerDrawing.type"
                    }
                },
                "delete" : {
                    "url" : "deleteWaterwayCircuitPowerDrawing.do",
                    "paramName" : {
                        "picid" : "waterwayCircuitPowerDrawing.wcpdId"
                    }
                }
            }
        },
        //瓦工
        {
            "proApi" : {
                "url": "queryBricklayConstructionScheduleByOrderId.do",
                "paramName" : {"orderId" : "bricklayConstructionSchedule.orderId"},
                "resName" : "bricklayConstructionSchedule",
                "subIdName" : "bcsId"
            },
            "timeApi" : {
                "url" : "setBricklayConstructionScheduleForInfo.do",
                "paramName" : {
                    "subid" : "bricklayConstructionSchedule.bcsId",
                    "startTime" : "bricklayConstructionSchedule.startTime",
                    "endTime" : "bricklayConstructionSchedule.endTime"
                },
                "isUnique" : false
            },
            "workApi" : {
                "init" : {
                    "url" : "queryBricklayConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "bricklayConstructionSchedule.bcsId"
                    },
                    "resName" : "constructionScheduleWorkers",
                    "workerid" : "bcswId"
                },
                "get" : {
                    "url" : "queryUserForNameByDuty.do",
                	"params" : {"duty" : "瓦工"}
                },
                "add" : {
                    "url" : "addBricklayConstructionScheduleWorker.do",
                    "paramName" : {
                        "orderid" : "bricklayConstructionScheduleWorker.orderId",
                        "subid" : "bricklayConstructionScheduleWorker.bcsId",
                        "workerId" : "bricklayConstructionScheduleWorker.workerId"
                    },
                    "resName" : "bricklayConstructionScheduleWorker"
                },
                "delete" : {
                    "url" : "deleteBricklayConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "bricklayConstructionSchedule.ccsId",
                        "workerId" : "bricklayConstructionScheduleWorker.bcswId"
                    }
                },
                "isUnique" : false
            },
            "picApi" : {
                "get" : {
                    "url" : "queryBricklayDrawingByBcsId.do",
                    "paramName" : {
                        "subid" : "bricklayDrawing.bcsId"
                    },
                    "resName" : "bricklayDrawings",
                    "picidName" : "bdId"
                },
                "add" : {
                    "url" : "addBricklayDrawings.do",
                    "paramName" : {
                        "csid" : "bricklayDrawing.csId",
                        "subid" : "bricklayDrawing.bcsId",
                        "url" : "drawingUrls",
                        "type" : "bricklayDrawing.type"
                    }
                },
                "delete" : {
                    "url" : "deleteBricklayDrawing.do",
                    "paramName" : {
                        "picid" : "bricklayDrawing.bdId"
                    }
                }
            }
        },
        //地面找平
        {
            "proApi" : {
                "url": "queryGroundLevelingConstructionScheduleByOrderId.do",
                "paramName" : {"orderId" : "groundLevelingConstructionSchedule.orderId"},
                "resName" : "groundLevelingConstructionSchedule",
                "subIdName" : "glcsId"
            },
            "timeApi" : {
                "url" : "setGroundLevelingConstructionScheduleForInfo.do",
                "paramName" : {
                    "subid" : "groundLevelingConstructionSchedule.glcsId",
                    "startTime" : "groundLevelingConstructionSchedule.startTime",
                    "endTime" : "groundLevelingConstructionSchedule.endTime"
                },
                "isUnique" : false
            },
            "workApi" : {
                "init" : {
                    "url" : "queryGroundLevelingConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "groundLevelingConstructionSchedule.glcsId"
                    },
                    "resName" : "constructionScheduleWorkers",
                    "workerid" : "glcswId"
                },
                "get" : {
                    "url" : "queryUserForNameByDuty.do",
                	"params" : {"duty" : "地面找平"}
                },
                "add" : {
                    "url" : "addGroundLevelingConstructionScheduleWorker.do",
                    "paramName" : {
                        "orderid" : "groundLevelingConstructionScheduleWorker.orderId",
                        "subid" : "groundLevelingConstructionScheduleWorker.glcsId",
                        "workerId" : "groundLevelingConstructionScheduleWorker.workerId"
                    },
                    "resName" : "groundLevelingConstructionScheduleWorker"
                },
                "delete" : {
                    "url" : "deleteGroundLevelingConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "groundLevelingConstructionSchedule.glcsId",
                        "workerId" : "groundLevelingConstructionScheduleWorker.glcswId"
                    }
                },
                "isUnique" : false
            },
            "picApi" : {
                "get" : {
                    "url" : "queryGroundLevelingDrawingByGlcsId.do",
                    "paramName" : {
                        "subid" : "groundLevelingDrawing.glcsId"
                    },
                    "resName" : "groundLevelingDrawings",
                    "picidName" : "gldId"
                },
                "add" : {
                    "url" : "addGroundLevelingDrawings.do",
                    "paramName" : {
                        "csid" : "groundLevelingDrawing.csId",
                        "subid" : "groundLevelingDrawing.glcsId",
                        "url" : "drawingUrls",
                        "type" : "groundLevelingDrawing.type"
                    }
                },
                "delete" : {
                    "url" : "deleteGroundLevelingDrawing.do",
                    "paramName" : {
                        "picid" : "groundLevelingDrawing.gldId"
                    }
                }
            }
        },
        //木工
        {
            "proApi" : {
                "url": "queryCarpentConstructionScheduleByOrderId.do",
                "paramName" : {"orderId" : "carpentConstructionSchedule.orderId"},
                "resName" : "carpentConstructionSchedule",
                "subIdName" : "ccsId"
            },
            "timeApi" : {
                "url" : "setCarpentConstructionScheduleForInfo.do",
                "paramName" : {
                    "subid" : "carpentConstructionSchedule.ccsId",
                    "startTime" : "carpentConstructionSchedule.startTime",
                    "endTime" : "carpentConstructionSchedule.endTime"
                },
                "isUnique" : false
            },
            "workApi" : {
                "init" : {
                    "url" : "queryCarpentConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "carpentConstructionSchedule.ccsId"
                    },
                    "resName" : "constructionScheduleWorkers",
                    "workerid" : "ccswId"
                },
                "get" : {
                    "url" : "queryUserForNameByDuty.do",
                	"params" : {"duty" : "木工"}
                },
                "add" : {
                    "url" : "addCarpentConstructionScheduleWorker.do",
                    "paramName" : {
                        "orderid" : "carpentConstructionScheduleWorker.orderId",
                        "subid" : "carpentConstructionScheduleWorker.ccsId",
                        "workerId" : "carpentConstructionScheduleWorker.workerId"
                    },
                    "resName" : "carpentConstructionScheduleWorker"
                },
                "delete" : {
                    "url" : "deleteCarpentConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "carpentConstructionSchedule.ccsId",
                        "workerId" : "carpentConstructionScheduleWorker.ccswId"
                    }
                },
                "isUnique" : false
            },
            "picApi" : {
                "get" : {
                    "url" : "queryCarpentDrawingByCcsId.do",
                    "paramName" : {
                        "subid" : "carpentDrawing.ccsId"
                    },
                    "resName" : "carpentDrawings",
                    "picidName" : "cdId"
                },
                "add" : {
                    "url" : "addCarpentDrawings.do",
                    "paramName" : {
                        "csid" : "carpentDrawing.csId",
                        "subid" : "carpentDrawing.ccsId",
                        "url" : "drawingUrls",
                        "type" : "carpentDrawing.type"
                    }
                },
                "delete" : {
                    "url" : "deleteCarpentDrawing.do",
                    "paramName" : {
                        "picid" : "carpentDrawing.cdId"
                    }
                }
            }
        },
        //油工
        {
            "proApi" : {
                "url": "queryOilConstructionScheduleByOrderId.do",
                "paramName" : {"orderId" : "oilConstructionSchedule.orderId"},
                "resName" : "oilConstructionSchedule",
                "subIdName" : "ocsId"
            },
            "timeApi" : {
                "url" : "setOilConstructionScheduleForInfo.do",
                "paramName" : {
                    "subid" : "oilConstructionSchedule.ocsId",
                    "startTime" : "oilConstructionSchedule.startTime",
                    "endTime" : "oilConstructionSchedule.endTime"
                },
                "isUnique" : false
            },
            "workApi" : {
                "init" : {
                    "url" : "queryOilConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "oilConstructionSchedule.ocsId"
                    },
                    "resName" : "constructionScheduleWorkers",
                    "workerid" : "ocswId"
                },
                "get" : {
                    "url" : "queryUserForNameByDuty.do",
                	"params" : {"duty" : "油工"}
                },
                "add" : {
                    "url" : "addOilConstructionScheduleWorker.do",
                    "paramName" : {
                        "orderid" : "oilConstructionScheduleWorker.orderId",
                        "subid" : "oilConstructionScheduleWorker.ocsId",
                        "workerId" : "oilConstructionScheduleWorker.workerId"
                    },
                    "resName" : "oilConstructionScheduleWorker"
                },
                "delete" : {
                    "url" : "deleteOilConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "oilConstructionSchedule.ocsId",
                        "workerId" : "oilConstructionScheduleWorker.ocswId"
                    }
                },
                "isUnique" : false
            },
            "picApi" : {
                "get" : {
                    "url" : "queryOilDrawingByOcsId.do",
                    "paramName" : {
                        "subid" : "oilDrawing.ocsId"
                    },
                    "resName" : "oilDrawings",
                    "picidName" : "odId"
                },
                "add" : {
                    "url" : "addOilDrawings.do",
                    "paramName" : {
                        "csid" : "oilDrawing.csId",
                        "subid" : "oilDrawing.ocsId",
                        "url" : "drawingUrls",
                        "type" : "oilDrawing.type"
                    }
                },
                "delete" : {
                    "url" : "deleteOilDrawing.do",
                    "paramName" : {
                        "picid" : "oilDrawing.odId"
                    }
                }
            }
        },
        //水电安装
        {
            "proApi" : {
                "url": "queryWaterwayCircuitCheckConstructionScheduleByOrderId.do",
                "paramName" : {"orderId" : "waterwayCircuitCheckConstructionSchedule.orderId"},
                "resName" : "waterwayCircuitCheckConstructionSchedule",
                "subIdName" : "wcccsId"
            },
            "timeApi" : {
                "url" : "setWaterwayCircuitCheckConstructionScheduleForInfo.do",
                "paramName" : {
                    "subid" : "waterwayCircuitCheckConstructionSchedule.wcccsId",
                    "startTime" : "waterwayCircuitCheckConstructionSchedule.startTime",
                    "endTime" : "waterwayCircuitCheckConstructionSchedule.endTime"
                },
                "isUnique" : false
            },
            "workApi" : {
                "init" : {
                    "url" : "queryWaterwayCircuitCheckConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "waterwayCircuitCheckConstructionSchedule.wcccsId"
                    },
                    "resName" : "constructionScheduleWorkers",
                    "workerid" : "wcccswId"
                },
                "get" : {
                	"url" : "queryUserForNameByDutysAO.do",
                    "params" : { "dutysO[0]" : "水暖工" , "dutysO[1]" : "电工" , "dutysO[2]" : "力工"}
                },
                "add" : {
                    "url" : "addWaterwayCircuitCheckConstructionScheduleWorker.do",
                    "paramName" : {
                        "orderid" : "waterwayCircuitCheckConstructionScheduleWorker.orderId",
                        "subid" : "waterwayCircuitCheckConstructionScheduleWorker.wcccsId",
                        "workerId" : "waterwayCircuitCheckConstructionScheduleWorker.workerId"
                    },
                    "resName" : "waterwayCircuitCheckConstructionScheduleWorker"
                },
                "delete" : {
                    "url" : "deleteWaterwayCircuitCheckConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "waterwayCircuitCheckConstructionSchedule.wcccsId",
                        "workerId" : "waterwayCircuitCheckConstructionScheduleWorker.wcccswId"
                    }
                },
                "isUnique" : false
            },
            "picApi" : {
                "get" : {
                    "url" : "queryWaterwayCircuitCheckDrawingByWcpcsId.do",
                    "paramName" : {
                        "subid" : "waterwayCircuitCheckDrawing.wcccsId"
                    },
                    "resName" : "waterwayCircuitCheckDrawings",
                    "picidName" : "wccdId"
                },
                "add" : {
                    "url" : "addWaterwayCircuitCheckDrawings.do",
                    "paramName" : {
                        "csid" : "waterwayCircuitCheckDrawing.csId",
                        "subid" : "waterwayCircuitCheckDrawing.wcccsId",
                        "url" : "drawingUrls",
                        "type" : "waterwayCircuitCheckDrawing.type"
                    }
                },
                "delete" : {
                    "url" : "deleteWaterwayCircuitCheckDrawing.do",
                    "paramName" : {
                        "picid" : "waterwayCircuitCheckDrawing.wccdId"
                    }
                }
            }
        },
        //保洁
        {
            "proApi" : {
                "url": "queryCleaningConstructionScheduleByOrderId.do",
                "paramName" : {"orderId" : "cleaningConstructionSchedule.orderId"},
                "resName" : "cleaningConstructionSchedule",
                "subIdName" : "ccsId"
            },
            "timeApi" : {
                "url" : "setCleaningConstructionScheduleForInfo.do",
                "paramName" : {
                    "subid" : "cleaningConstructionSchedule.ccsId",
                    "startTime" : "cleaningConstructionSchedule.startTime",
                    "endTime" : "cleaningConstructionSchedule.endTime"
                },
                "isUnique" : false
            },
            "workApi" : {
                "init" : {
                    "url" : "queryCleaningConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "cleaningConstructionSchedule.ccsId"
                    },
                    "resName" : "constructionScheduleWorkers",
                    "workerid" : "ccswId"
                },
                "get" : {
                	"url" : "queryUserForNameByDuty.do",
                	"params" : {"duty" : "保洁"}
                },
                "add" : {
                    "url" : "addCleaningConstructionScheduleWorker.do",
                    "paramName" : {
                        "orderid" : "cleaningConstructionScheduleWorker.orderId",
                        "subid" : "cleaningConstructionScheduleWorker.ccsId",
                        "workerId" : "cleaningConstructionScheduleWorker.workerId"
                    },
                    "resName" : "cleaningConstructionScheduleWorker"
                },
                "delete" : {
                    "url" : "deleteCleaningConstructionScheduleWorker.do",
                    "paramName" : {
                        "subid" : "cleaningConstructionSchedule.ccsId",
                        "workerId" : "cleaningConstructionScheduleWorker.ccswId"
                    }
                },
                "isUnique" : false
            },
            "picApi" : {
                "get" : {
                    "url" : "queryCleaningDrawingByCcsId.do",
                    "paramName" : {
                        "subid" : "cleaningDrawing.ccsId"
                    },
                    "resName" : "cleaningDrawings",
                    "picidName" : "cdId"
                },
                "add" : {
                    "url" : "addCleaningDrawings.do",
                    "paramName" : {
                        "csid" : "cleaningDrawing.csId",
                        "subid" : "cleaningDrawing.ccsId",
                        "url" : "drawingUrls",
                        "type" : "cleaningDrawing.type"
                    }
                },
                "delete" : {
                    "url" : "deleteCleaningDrawing.do",
                    "paramName" : {
                        "picid" : "cleaningDrawing.cdId"
                    }
                }
            }
        },
    ];

    var project = {
        $time : {
            $start : $('.start-time', '#time'),
            $end : $('.end-time', '#time'),
            $btn : $('#saveTime'),
        },
        $worker : {
            $workerList : $('#worker'),
            $btn : $('#addWorder'),
        },
        $pic : {
            $picList : $('#pic'),
            $btn : $('#addPic'),
        },
        $photoBrowser : null,

        authentication : "",
        orderid : "",
        pindex : 0,
        csid : null,
        subid : null,
        picViewSettings : {
            photos : [],
            type: 'popup'
        },
        getProjectInfo : function () {
            var that = this;
            var _project = projConf[that.pindex];
            var _params,_picParams, _workerParams;
            _params = _picParams = _workerParams ={"authentication" : that.authentication};
            _params[ _project.proApi.paramName.orderId] = that.orderid;

            //获取时间
            $.ajax({
                type: 'POST',
                url: config.serverHost + _project.proApi.url,
                data: _params,
                dataType : "json",
                async: false,
                success: function(res){
                    var _resName = _project.proApi.resName;

                    that.csid = res[_resName].csId;
                    that.subid = res[_resName][_project.proApi.subIdName];

                    that.$time.$start.val(res[_resName].startTime);
                    that.$time.$end.val(res[_resName].endTime);
                    //todo

                    //获取工人
                    _project.workApi.isUnique ? (
                        res[_resName].workerName && painter.createWorker(res[_resName]).appendTo(that.$worker.$workerList)
                    ) : (
                        _workerParams[_project.workApi.init.paramName.subid] = res[_resName][_project.proApi.subIdName],
                        $.ajax({
                            type: 'POST',
                            url: config.serverHost + _project.workApi.init.url,
                            data: _workerParams,
                            dataType : "json",
                            async: false,
                            success: function(res){

                                var _resName = _project.workApi.init.resName;

                                res[_resName].length && $.each(res[_resName], function(i, v){
                                    var $worker = painter.createWorker(v);
                                    project.$worker.$workerList.append($worker);

                                });


                            },error: function (xhr, errorType, error) {
                                dd.device.notification.alert({
                                    message: "错误" + error + errorType,
                                    title: "提示",
                                    buttonName: "确认",
                                });
                            }
                        })
                    );
                },error: function (xhr, errorType, error) {
                    dd.device.notification.alert({
                        message: "错误" + error + errorType,
                        title: "提示",
                        buttonName: "确认",
                    });
                }
            });

            //获取图片
            that.subid && (
                _picParams[_project.picApi.get.paramName.subid] = that.subid,
                $.ajax({
                    type: 'POST',
                    url: config.serverHost + _project.picApi.get.url,
                    data: _picParams,
                    dataType : "json",
                    async: false,
                    success: function(res){

                        var _resName = _project.picApi.get.resName;

                        res[_resName].length && ($.each(res[_resName], function(i, v){
                            var $pic = painter.createPic(v);
                            project.$pic.$picList.append($pic);

                        }),project.$photoBrowser = $.photoBrowser(project.picViewSettings));


                    },error: function (xhr, errorType, error) {
                        dd.device.notification.alert({
                            message: "错误" + error + errorType,
                            title: "提示",
                            buttonName: "确认",
                        });
                    }
                })
            );
        }
    };
    //各种事件绑定
    var binding = {

        openAutofill : function(){
            var that = this;
            (project.$worker.$btn).on('click', function(e){
                $('.list-block ul', '#search-panel').empty();
                that.openPanel();
            });
        },
        /*
        * msg:placeholder提示
        * */
        openPanel : function(){
            var pannel = $('#search-panel');
            var isopen = $.openPanel(pannel);
            $('#search').val(null).attr({"placeholder" : "请输入工人"});
            return isopen;
        },

        bindAutofill : function(){

            $('#search').on('input', function(){

                var _value = $(this).val();
                var _params = {"authentication": project["authentication"],"pinyinName" : _value,"timestamp" : new Date().getTime()};
                $('.list-block ul', '#search-panel').empty();

                $.ajax({
                    type: 'POST',
                    url: config.serverHost + projConf[project.pindex].workApi.get.url,
                    data: $.extend(true, {}, projConf[project.pindex].workApi.get.params, _params),
                    dataType : "json",
                    success: function(res){
                        res.autoFillKeyValue && res.autoFillKeyValue.length && $.each(res.autoFillKeyValue, function(i, v){
                            var $li = painter.createItem(v);

                            $('.list-block ul', '#search-panel').append($li);
                        });
                    },error: function (xhr, errorType, error) {
                        dd.device.notification.alert({
                            message: "错误" + error + errorType,
                            title: "提示",
                            buttonName: "确认",
                        });
                    }
                });
            });
        },

        //保存时间
        saveTime : function(){
            (project.$time.$btn).click(function(){
                var _startTime = project.$time.$start.val();
                var _endTime = project.$time.$end.val();
                var _params = {"authentication":project.authentication};
                _params[projConf[project.pindex].timeApi.paramName.subid] = project.subid;
                if(projConf[project.pindex].timeApi.isUnique){
                    _params[projConf[project.pindex].timeApi.paramName.time] = _startTime;
                }else{
                    _params[projConf[project.pindex].timeApi.paramName.startTime] = _startTime;
                    _params[projConf[project.pindex].timeApi.paramName.endTime] = _endTime;
                }

                $.ajax({
                    type: 'POST',
                    url: config.serverHost + projConf[project.pindex].timeApi.url,
                    data: _params,
                    dataType : "json",
                    async: false,
                    success: function(res){

                        var message = "操作成功";

                        if(!res.errorCode == 0){
                            message = res.errorMsg;
                        }
                        $.alert(message);

                    },error: function (xhr, errorType, error) {
                        dd.device.notification.alert({
                            message: "错误" + error + errorType,
                            title: "提示",
                            buttonName: "确认",
                        });
                    }
                });
            });
        },
        //添加工人
        saveWorker : function(userId, callback){
            var _params = {"authentication":project.authentication};
            !projConf[project.pindex].workApi.isUnique && (_params[projConf[project.pindex].workApi.add.paramName.orderid] = project.orderid);
            _params[projConf[project.pindex].workApi.add.paramName.subid] = project.subid;
            _params[projConf[project.pindex].workApi.add.paramName.workerId] = userId;
            $.ajax({
                type: 'POST',
                url: config.serverHost + projConf[project.pindex].workApi.add.url,
                data: _params,
                dataType : "json",
                async: false,
                success: function(res){

                    var message = "添加成功";

                    if(!res.errorCode == 0){
                        message = res.errorMsg;
                    }

                    $.alert(message);

                    res.errorCode == 0 && callback(res[projConf[project.pindex].workApi.add.resName]);
                },error: function (xhr, errorType, error) {
                    dd.device.notification.alert({
                        message: "错误" + error + errorType,
                        title: "提示",
                        buttonName: "确认",
                    });
                }
            });
        },
        //删除工人
        deleteWorker : function(userId, isunique, callback){
            var _params = {"authentication":project.authentication};
            _params[projConf[project.pindex].workApi.delete.paramName.workerId] = userId;
            isunique && (_params[projConf[project.pindex].workApi.delete.paramName.subid] = project.subid);
            $.ajax({
                type: 'POST',
                url: config.serverHost + projConf[project.pindex].workApi.delete.url,
                data: _params,
                dataType : "json",
                async: false,
                success: function(res){

                    var message = "删除成功";

                    if(!res.errorCode == 0){
                        message = res.errorMsg;
                    }

                    $.alert(message);

                    res.errorCode == 0 && callback();
                },error: function (xhr, errorType, error) {
                    dd.device.notification.alert({
                        message: "错误" + error + errorType,
                        title: "提示",
                        buttonName: "确认",
                    });
                }
            });

        },

        //上传图片
        uploadPic : function(){
            project.$pic.$btn.click(function(){
                dd.biz.util.uploadImage({
                    multiple: true, //是否多选，默认false
                    max: 5, //最多可选个数
                    onSuccess : function(result) {
                        var _url = projConf[project.pindex].picApi.add.paramName.url;
                        var _params = {"authentication":project.authentication};
                        _params[projConf[project.pindex].picApi.add.paramName.subid] = project.subid;
                        _params[projConf[project.pindex].picApi.add.paramName.csid] = project.csid;
                        _params[projConf[project.pindex].picApi.add.paramName.type] = 1;
                        result.length &&($.each(result, function(i, v){
//                            var _path = v.replace(config.mediaDdServer,"");
                        	var _path = v.split("/media/")[1];
                            _params[_url+ "[" + i + "]" ] = _path;
                        }),
                        $.ajax({
                            type: 'POST',
                            url: config.serverHost + projConf[project.pindex].picApi.add.url,
                            data: _params,
                            dataType : "json",
                            async: false,
                            success: function(res){

                                var _resName = projConf[project.pindex].picApi.get.resName;

                                res[_resName].length && ($.each(res[_resName], function(i, v){
                                    var $pic = painter.createPic(v);
                                    project.$pic.$picList.append($pic);

                                }),project.$photoBrowser = $.photoBrowser(project.picViewSettings));

                                var message = "添加成功";

                                if(!res.errorCode == 0){
                                    message = res.errorMsg;
                                }

                                $.alert(message);

                                res.errorCode == 0 && callback(res[projConf[project.pindex].workApi.add.resName]);
                            },error: function (xhr, errorType, error) {
                                dd.device.notification.alert({
                                    message: "错误" + error + errorType,
                                    title: "提示",
                                    buttonName: "确认",
                                });
                            }
                        })) ;
                    },
                    onFail : function() {
                        dd.device.notification.alert({
                            message: "错误" + error + errorType,
                            title: "提示",
                            buttonName: "确认",
                        });
                    }
                })

            });
        },
        //删除图片
        deletePic : function(picid, callBack){
            var _params = {"authentication":project.authentication};
            _params[projConf[project.pindex].picApi.delete.paramName.picid] = picid;
            $.ajax({
                type: 'POST',
                url: config.serverHost + projConf[project.pindex].picApi.delete.url,
                data: _params,
                dataType : "json",
                async: false,
                success: function(res){

                    var message = "删除成功";

                    if(!res.errorCode == 0){
                        message = res.errorMsg;
                    }

                    $.alert(message);

                    res.errorCode == 0 && callBack();
                },error: function (xhr, errorType, error) {
                    dd.device.notification.alert({
                        message: "错误" + error + errorType,
                        title: "提示",
                        buttonName: "确认",
                    });
                }
            });
        },
        searchFocus : function(){
            $('#search-panel').on('open',function(e){
                $('#search').focus();
            });
        },
        init : function(){
            this.openAutofill();
            this.bindAutofill();
            this.searchFocus();
            this.saveTime();
            this.uploadPic();
        }
    };

    var painter = {
        createPic : function(pic){
            var _type = pic.type,
                $pic = $('<div></div>').addClass('img-item'),
                $img = $('<img>');

            var _url, _url2;
            _url = _url2 = pic.drawingUrl;

            if(_type == 0){
                _url = config.mediaServer + '/showImg.do' + '?imgBasePath='+ _url +'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime();
                _url2 = config.mediaServer + '/showImg.do' + '?imgBasePath='+ _url2 +'&timestamp='+ new Date().getTime();
            }
            if(_type == 1){
                _url = config.mediaDdServer + _url + '_150x150.jpg';
                _url2 = config.mediaDdServer + _url2;
            }

            $img.attr('src', _url);

            project.picViewSettings.photos.push(_url2);
            $pic.append($img);

            $pic.on('click', function () {
                var a = $(this).index();
                project.$photoBrowser.open(a);
            });
            $pic.on('longTap', function () {
                var a = $(this).index();
                $.confirm('删除当前图片？', function () {
                    binding.deletePic(pic[projConf[project.pindex].picApi.get.picidName] , function(){

                        var _picList = [];
                        $pic.remove();
                        $.each(project.picViewSettings.photos, function(i, v){
                            i != a && _picList.push(project.picViewSettings.photos[i]);
                        });
                        project.picViewSettings.photos = _picList;
                        project.$photoBrowser = $.photoBrowser(project.picViewSettings);
                    });
                });
            });

            return $pic;
        },
        createWorker : function(worker){
            var $worker = $('<li></li>').addClass('item-content');
            var $itemInner = $('<div></div>').addClass('item-inner');
            var $itemTitle = $('<div></div>').addClass('item-title').html(worker.workerId + ' : ' + worker.workerName);
            $itemInner.append($itemTitle).appendTo($worker);

            $worker.on('longTap', function () {
                var $this = $(this);
                var workerId = projConf[project.pindex].workApi.isUnique ? "" : worker[projConf[project.pindex].workApi.init.workerid];
                $.confirm('删除当前工人？', function () {
                    binding.deleteWorker(workerId, true, function(){
                        $.closePanel('#search-panel');
                        $this.remove();
                    });
                });
            });

            return $worker;
        },
        createItem : function(v){
            var that = this;
            var $li = $('<li></li>').addClass('item-content');
            var $content = $('<div></div>').addClass('item-inner');
            var $val = $('<div></div>').addClass('item-title').html(v.value);
            $content.append($val).appendTo($li);
            $li.on('click', function(){
                binding.saveWorker(v.key, function(data){
                    $.closePanel('#search-panel');
                    projConf[project.pindex].workApi.isUnique && project.$worker.$workerList.empty();
                    project.$worker.$workerList.append(that.createWorker(data));
                });
            });

            return $li;
        }
    };

    return {
        init : function(authentication){
            //"1510220003"
            var urlParams = utils.getUrlParams();
            project.authentication = authentication;
            project.orderid = urlParams.orderid;
            project.pindex = parseInt(urlParams.index);
            project.getProjectInfo();
            binding.init();
        },
        renderTime : function(){
            var urlParams = utils.getUrlParams();
            var _index = parseInt(urlParams.index);
            if(projConf[_index].timeApi.isUnique){
                project.$time.$start.parents('.item-inner').find('.item-title').text('时间');
                project.$time.$end.parents('li').hide();
            }
        }
    };
})();

$(function(){

    $.init();

    //hostAddr = "http://" + window.location.host;
    Project.renderTime();
    Ding.handle(23777027, window.location.href, function(config, user){
        Project.init(config.authenticationEncode);
    },["biz.util.uploadImage"]);

});