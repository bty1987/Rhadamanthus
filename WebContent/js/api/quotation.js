$.extend(api.index, {
    functionAreaIndex: {
        url: "/views/quotation/functionArea.html"
    },
    quotationItemIndex: {
        url: "/views/quotation/quotationItem.html"
    },
    quotationVersionIndex: {
        url: "/views/quotation/quotationVersion.html"
    },
    systemDefineItemIndex: {
        url: "/views/quotation/systemDefineItem.html"
    },

    quotationIndex: {
        url: "/views/quotation/quotationIndex.html"
    },
    quotationDetailIndex: {
        url: "/views/quotation/quotationDetail.html"
    },
    quotationPartIndex: {
        url: "/views/quotation/quotationPart.html"
    },
    quotationWholeIndex: {
        url: "/views/quotation/quotationWhole.html"
    },
    quotationOutputIndex: {
        url: "/views/quotation/quotationOutput.html"
    },

    addReduceIndex: {
        url: "/views/quotation/addReduceIndex.html"
    },
    addReducePartIndex: {
        url: "/views/quotation/addReducePart.html"
    },
    addReduceOutputIndex: {
        url: "/views/quotation/addReduceOutput.html"
    },

    extensionIndex: {
        url: "/views/quotation/extensionIndex.html"
    },
    extensionPartIndex: {
        url: "/views/quotation/extensionPart.html"
    },

    quotetionIndex: {
        url: "/views/quotation/quotetionIndex.html"
    },
    quotetionPartIndex: {
        url: "/views/quotation/quotetionPart.html"
    },
    quotetionCompareIndex: {
        url: "/views/quotation/quotetionCompare.html"
    },

    selectionIndex: {
        url: "/views/quotation/selectionIndex.html"
    },
    selectionPartIndex: {
        url: "/views/quotation/selectionPart.html"
    },
    selectionOutputIndex: {
        url: "/views/quotation/selectionOutput.html"
    },

    protationIndex: {
        url: "/views/quotation/protationIndex.html"
    },
    protationPart: {
        url: "/views/quotation/protationPart.html"
    },
    protationOutputIndex: {
        url: "/views/quotation/protationOutput.html"
    },

    normIndex: {
        url: "/views/quotation/normtionIndex.html"
    },
    normPart: {
        url: "/views/quotation/normtionPart.html"
    },
});

$.extend(api, {
    quotation: {

        queryQuotationClassification: {
            url: "queryQuotationClassification.do",
            demo: true
        },
        queryQuotationBigCategory: {
            url: "queryQuotationBigCategory.do",
            demo: true
        },
        queryQuotationSmallCategory: {
            url: "queryQuotationSmallCategory.do",
            demo: true
        },
        queryQuotationType: {
            url: "queryQuotationType.do",
            demo: true
        },

        pageQuotationVersion: {
            url: "pageQuotationVersion.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["trafficRate", "manageRate", "taxRate"]
            }]
        },
        queryQuotationVersion: {
            url: "queryQuotationVersion.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "quotationVersions",
                args: ["trafficRate", "manageRate", "taxRate"]
            }]
        },
        queryQuotationVersionByVersionId: {
            url: "queryQuotationVersionByVersionId.do",
            type: "query",
            tranargs: [{
                result: "quotationVersion",
                args: ["trafficRate", "manageRate", "taxRate"]
            }]
        },
        addQuotationVersion: {
            url: "addQuotationVersion.do",
            type: "update",
            tranargs: {
                args: ["quotationVersion.trafficRate", "quotationVersion.manageRate", "quotationVersion.taxRate"]
            }
        },
        updateQuotationVersion: {
            url: "updateQuotationVersion.do",
            type: "update",
            tranargs: {
                args: ["quotationVersion.trafficRate", "quotationVersion.manageRate", "quotationVersion.taxRate"]
            }
        },
        updateQuotationForStatus: {
            url: "updateQuotationForStatus.do"
        },
        updateQuotationVersionForDefault: {
            url: "updateQuotationVersionForDefault.do"
        },

        pageFunctionArea: {
            url: "pageFunctionArea.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total"]
            }]
        },
        queryFunctionAreaByIdAVersionId: {
            url: "queryFunctionAreaByIdAVersionId.do",
            type: "query",
            tranargs: [{
                result: "functionArea",
                args: ["total"]
            }]
        },
        queryFunctionAreaByVersionId: {
            url: "queryFunctionAreaByVersionId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "functionArea",
                args: ["total"]
            }]
        },
        addFunctionArea: {
            url: "addFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["functionArea.total"]
            }
        },
        updateFunctionArea: {
            url: "updateFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["functionArea.total"]
            }
        },
        deleteFunctionArea: {
            url: "deleteFunctionArea.do"
        },

        pageQuotationCtem: {
            url: "pageQuotationCtem.do"
        },

        queryQuotationCtem: {
            url: "queryQuotationCtem.do"
        },

        addQuotationCtem: {
            url: "addQuotationCtem.do"
        },

        updateQuotationCtem: {
            url: "updateQuotationCtem.do"
        },

        updateQuotationCtemForStatus: {
            url: "updateQuotationCtemForStatus.do"
        },

        pageQuotationItem: {
            url: "pageQuotationItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["addPrice", "unitPrice", "subPrice"]
            }]
        },
        pageQuotationItemByVersionId: {
            url: "pageQuotationItemByVersionId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["addPrice", "unitPrice", "subPrice"]
            }]
        },
        queryQuotationItemByItemIdAVersionId: {
            url: "queryQuotationItemByItemIdAVersionId.do",
            type: "query",
            tranargs: [{
                result: "quotationItem",
                args: ["addPrice", "unitPrice", "subPrice"]
            }]
        },
        addQuotationItem: {
            url: "addQuotationItem.do",
            type: "update",
            tranargs: {
                args: ["quotationItem.addPrice", "quotationItem.unitPrice", "quotationItem.subPrice"]
            }
        },
        updateQuotationItem: {
            url: "updateQuotationItem.do",
            type: "update",
            tranargs: {
                args: ["quotationItem.addPrice", "quotationItem.unitPrice", "quotationItem.subPrice"]
            }
        },
        updateQuotationItemForStatus: {
            url: "updateQuotationItemForStatus.do"
        },
        updateQuotationItemForDiscount: {
            url: "updateQuotationItemForDiscount.do"
        },

        queryFunctionAreaItemByFunctionAreaId: {
            url: "queryFunctionAreaItemByFunctionAreaId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "functionAreaItems-quotationItem",
                args: ["addPrice", "unitPrice", "subPrice"]
            }]
        },
        addFunctionAreaItem: {
            url: "addFunctionAreaItem.do"
        },
        deleteFunctionAreaItemByIds: {
            url: "deleteFunctionAreaItemByIds.do"
        },
        updateFunctionAreaItem: {
            url: "updateFunctionAreaItem.do"
        },
        pageSystemDefineItem: {
            url: "pageSystemDefineItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["addPrice", "unitPrice", "subPrice"]
            }]
        },
        pageSystemDefineItemForEnable: {
            url: "pageSystemDefineItemForEnable.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["addPrice", "unitPrice", "subPrice"]
            }]
        },
        querySystemDefineItemByItemId: {
            url: "querySystemDefineItemByItemId.do",
            type: "query",
            tranargs: [{
                result: "systemDefineItem",
                args: ["addPrice", "unitPrice", "subPrice"]
            }]
        },
        addSystemDefineItem: {
            url: "addSystemDefineItem.do",
            type: "update",
            tranargs: {
                args: ["systemDefineItem.addPrice", "systemDefineItem.unitPrice", "systemDefineItem.subPrice"]
            }
        },
        updateSystemDefineItem: {
            url: "updateSystemDefineItem.do",
            type: "update",
            tranargs: {
                args: ["systemDefineItem.addPrice", "systemDefineItem.unitPrice", "systemDefineItem.subPrice"]
            }
        },
        updateSystemDefineItemForStatus: {
            url: "updateSystemDefineItemForStatus.do"
        },
        updateSystemDefineItemForDiscount: {
            url: "updateSystemDefineItemForDiscount.do"
        },
        deleteSystemDefineItem: {
            url: "deleteSystemDefineItem.do"
        },

        pageQuotationBigCategory: {
            url: "pageQuotationBigCategory.do"
        },
        pageQuotationType: {
            url: "pageQuotationType.do"
        },
        pageQuotationSmallCategory: {
            url: "pageQuotationSmallCategory.do"
        },
        pageQuotationClassification: {
            url: "pageQuotationClassification.do"
        },

        pagePresignProduce: {
            url: "pagePresignProduce.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["quotePrice", "quoteArea", "unitPrice", "costPrice", "profitRate", "preferPrice", "mostPrice", "costRate", "mostRate"]
            }]
        },
        queryPresignProduce: {
            url: "queryPresignProduce.do",
            type: "query",
            tranargs: [{
                result: "presignProduces",
                args: ["quotePrice", "quoteArea", "unitPrice", "costPrice", "profitRate", "preferPrice"]
            }]
        },
        addPresignProduce: {
            url: "addPresignProduce.do",
            type: "update",
            tranargs: {
                args: ["presignProduce.quotePrice", "presignProduce.quoteArea", "presignProduce.unitPrice", "presignProduce.costPrice", "presignProduce.profitRate", "presignProduce.preferPrice", "presignProduce.mostPrice", "presignProduce.costRate", "presignProduce.mostRate"]
            }
        },
        updatePresignProduce: {
            url: "updatePresignProduce.do",
            type: "update",
            tranargs: {
                args: ["presignProduce.quotePrice", "presignProduce.quoteArea", "presignProduce.unitPrice", "presignProduce.costPrice", "presignProduce.profitRate", "presignProduce.preferPrice", "presignProduce.mostPrice", "presignProduce.costRate", "presignProduce.mostRate"]
            }
        },
        updatePresignProduceForStatus: {
            url: "updatePresignProduceForStatus.do"
        },

        pagePresignItem: {
            url: "pagePresignItem.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["basicNum", "price", "cost"]
            }]
        },
        queryPresignItemByPiid: {
            url: "queryPresignItemByPiid.do",
            type: "query",
            tranargs: [{
                result: "presignItem",
                args: ["basicNum", "price", "cost"]
            }]
        },
        addPresignItem: {
            url: "addPresignItem.do",
            type: "update",
            tranargs: {
                args: ["presignItem.basicNum", "presignItem.price", "presignItem.cost"]
            }
        },
        updatePresignItem: {
            url: "updatePresignItem.do",
            type: "update",
            tranargs: {
                args: ["presignItem.basicNum", "presignItem.price", "presignItem.cost"]
            }
        },
        updatePresignItemForStatus: {
            url: "updatePresignItemForStatus.do"
        },
        deletePresignItem: {
            url: "deletePresignItem.do"
        },

        queryPresignCost: {
            url: "queryPresignCost.do",
            type: "query",
            tranargs: [{
                result: "presignCosts",
                args: ["toplimit", "lowlimit", "costPrice"]
            }]
        },
        addPresignCost: {
            url: "addPresignCost.do",
            type: "update",
            tranargs: {
                args: ["presignCost.toplimit", "presignCost.lowlimit", "presignCost.costPrice"]
            }
        },
        deletePresignCost: {
            url: "deletePresignCost.do"
        },

        queryProtationByOrderId: {
            url: "queryProtationByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "protations",
                args: ["quotePrice", "quoteArea", "unitPrice", "costPrice", "profitRate", "basicPrice", "comdPrice", "commPrice", "adddPrice", "addmPrice", "subdPrice", "submPrice", "totalPrice"]
            }]
        },
        queryProtationForDefaultByOrderId: {
            url: "queryProtationForDefaultByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "protation",
                args: ["quotePrice", "quoteArea", "unitPrice", "costPrice", "profitRate", "basicPrice", "comdPrice", "commPrice", "adddPrice", "addmPrice", "subdPrice", "submPrice", "totalPrice", "totalCost"]
            }]
        },
        queryProtationByPid: {
            url: "queryProtationByPid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "protation",
                args: ["quotePrice", "quoteArea", "unitPrice", "costPrice", "profitRate", "basicPrice", "comdPrice", "commPrice", "adddPrice", "addmPrice", "subdPrice", "submPrice", "totalPrice", "preferPrice", "totalCost", "totalProfit", "costRate", "mostRate", "mostPrice"]
            }]
        },
        addProtation: {
            url: "addProtation.do",
            type: "update",
            tranargs: {
                args: ["protation.quotePrice", "protation.quoteArea", "protation.unitPrice", "protation.costPrice", "protation.profitRate", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.totalPrice", "protation.preferPrice", "protation.unitPrice"]
            }
        },
        updateProtation: {
            url: "updateProtation.do",
            type: "update",
            tranargs: {
                args: ["protation.preferPrice"]
            }
        },
        updateProtationForAdvance: {
            url: "updateProtationForAdvance.do",
            type: "update",
            tranargs: {
                args: ["protation.quotePrice", "protation.quoteArea", "protation.unitPrice", "protation.costPrice", "protation.costRate", "protation.mostRate", "protation.profitRate", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.totalPrice", "protation.preferPrice", "protation.totalCost", "protation.totalProfit"]
            }
        },
        updateProtationForStatus: {
            url: "updateProtationForStatus.do"
        },
        changeProtationForDefault: {
            url: "changeProtationForDefault.do"
        },
        deleteProtation: {
            url: "deleteProtation.do"
        },

        queryProtationItemByPid: {
            url: "queryProtationItemByPid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "protationItems",
                args: ["basicNum", "price", "num", "cost"]
            }]
        },
        updateProtationItem: {
            url: "updateProtationItem.do",
            type: "update",
            intercept: true,
            tranargs: {
                args: ["protation.quotePrice", "protation.quoteArea", "protation.costPrice", "protation.costRate", "protation.mostRate", "protation.profitRate", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.totalPrice", "protationItem.basicNum", "protationItem.price", "protationItem.num", "protationItem.cost", "protation.totalCost", "protation.totalProfit", "protation.costRate", "protation.mostRate", "protation.mostPrice"]
            }
        },
        deleteProtationItem: {
            url: "deleteProtationItem.do",
            type: "update",
            intercept: true,
            tranargs: {
                args: ["protation.quotePrice", "protation.quoteArea", "protation.costPrice", "protation.costRate", "protation.mostRate", "protation.profitRate", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.totalPrice", "protationItem.basicNum", "protationItem.price", "protationItem.num", "protationItem.cost", "protation.totalCost", "protation.totalProfit", "protation.costRate", "protation.mostRate", "protation.mostPrice"]
            }
        },
        lockProtation: {
            url: "lockProtation.do"
        },
        unlockProtation: {
            url: "unlockProtation.do"
        },

        pageProtation: {
            url: "pageProtation.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["quotePrice", "quoteArea", "unitPrice", "costPrice", "profitRate", "basicPrice", "comdPrice", "commPrice", "adddPrice", "addmPrice", "subdPrice", "submPrice", "totalPrice", "mostPrice", "costRate", "mostRate", "totalCost", "totalProfit"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },

        queryProtationCost: {
            url: "queryProtationCost.do",
            type: "query",
            tranargs: [{
                result: "protationCosts",
                args: ["toplimit", "lowlimit", "costPrice"]
            }]
        },

        pageQuotation: {
            url: "pageQuotation.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "notSalesmanRate", "taxPrice", "taxRate"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },
        queryQuotationByOrderId: {
            url: "queryQuotationByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "quotations",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "notSalesmanRate", "taxPrice", "taxRate"]
            }]
        },
        queryQuotationForDefaultByOrderId: {
            url: "queryQuotationForDefaultByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "quotation",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "notSalesmanRate", "taxPrice", "taxRate"]
            }]
        },
        queryQuotationById: {
            url: "queryQuotationById.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "quotation",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "notSalesmanRate", "taxPrice", "taxRate"]
            }]
        },
        queryQuotationForConfig: {
            url: "queryQuotationForConfig.do",
            demo: true
        },
        addQuotation: {
            url: "addQuotation.do"
        },
        updateQuotation: {
            url: "updateQuotation.do"
        },
        updateQuotationForAdvance: {
            url: "updateQuotationForAdvance.do",
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.taxPrice", "quotation.taxRate"]
            }
        },
        deleteQuotationById: {
            url: "deleteQuotationById.do"
        },
        replicaQuotation: {
            url: "replicaQuotation.do",
            type: "update",
            tranargs: {
                args: [],
                query: [{
                    result: "quotation",
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "notSalesmanRate", "taxPrice", "taxRate"]
                }]
            }
        },
        cloneQuotation: {
            url: "cloneQuotation.do",
            type: "update",
            tranargs: {
                args: [],
                query: [{
                    result: "quotation",
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "notSalesmanRate", "taxPrice", "taxRate"]
                }]
            }
        },
        copyQuotation: {
            url: "copyQuotation.do",
            type: "update",
            tranargs: {
                args: [],
                query: [{
                    result: "quotation",
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "notSalesmanRate", "taxPrice", "taxRate"]
                }]
            }
        },
        changeQuotationForDefault: {
            url: "changeQuotationForDefault.do",
        },
        lockQuotation: {
            url: "lockQuotation.do"
        },
        unlockQuotation: {
            url: "unlockQuotation.do"
        },

        queryQuotationFunctionAreaForCommonByQuotationId: {
            url: "queryQuotationFunctionAreaForCommonByQuotationId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "quotationFunctionAreas",
                args: ["total"]
            }]
        },
        queryQuotationFunctionAreaByQuotationId: {
            url: "queryQuotationFunctionAreaByQuotationId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "quotationFunctionAreas",
                args: ["total"]
            }, {
                result: "quotationFunctionAreas-quotationFunctionAreaParam",
                args: ["girth", "area", "height", "holeLength", "holeHeight", "windowLength", "windowHeight", "beamLength", "beamHeight"]
            }, {
                result: "quotationFunctionAreas-quotationFunctionAreaItems",
                args: ["unitPrice", "initNum", "num"]
            }]
        },
        addQuotationFunctionArea: {
            url: "addQuotationFunctionArea.do"
        },
        addQuotationFunctionAreaByFunctionAreaIds: {
            url: "addQuotationFunctionAreaByFunctionAreaIds.do",
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.taxRate", "quotation.taxPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotationFunctionAreas.quotationFunctionAreaParam.girth", "quotationFunctionAreas.quotationFunctionAreaParam.area", "quotationFunctionAreas.quotationFunctionAreaParam.height", "quotationFunctionAreas.quotationFunctionAreaParam.holeLength", "quotationFunctionAreas.quotationFunctionAreaParam.holeHeight", "quotationFunctionAreas.quotationFunctionAreaParam.windowLength", "quotationFunctionAreas.quotationFunctionAreaParam.windowHeight", "quotationFunctionAreas.quotationFunctionAreaParam.beamLength", "quotationFunctionAreas.quotationFunctionAreaParam.beamHeight", ],
                query: [{
                    result: "quotationFunctionAreas",
                    args: ["total"]
                }, {
                    result: "quotationFunctionAreas-quotationFunctionAreaParam",
                    args: ["girth", "area", "height", "holeLength", "holeHeight", "windowLength", "windowHeight", "beamLength", "beamHeight"]
                }, {
                    result: "quotationFunctionAreas-quotationFunctionAreaItems",
                    args: ["unitPrice", "initNum", "num"]
                }]
            }
        },
        updateQuotationFunctionArea: {
            url: "updateQuotationFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.taxPrice", "quotation.taxRate", "quotationFunctionArea.quotationFunctionAreaParam.girth", "quotationFunctionArea.quotationFunctionAreaParam.area", "quotationFunctionArea.quotationFunctionAreaParam.height", "quotationFunctionArea.quotationFunctionAreaParam.holeLength", "quotationFunctionArea.quotationFunctionAreaParam.holeHeight", "quotationFunctionArea.quotationFunctionAreaParam.windowLength", "quotationFunctionArea.quotationFunctionAreaParam.windowHeight", "quotationFunctionArea.quotationFunctionAreaParam.beamLength", "quotationFunctionArea.quotationFunctionAreaParam.beamHeight", ],
                query: [{
                    result: "quotation",
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate", "taxPrice", "taxRate"]
                }, {
                    result: "quotationFunctionArea",
                    args: ["total"]
                }, {
                    result: "quotationFunctionArea-quotationFunctionAreaParam",
                    args: ["girth", "area", "height", "holeLength", "holeHeight", "windowLength", "windowHeight", "beamLength", "beamHeight"]
                }]
            }
        },
        deleteQuotationFunctionArea: {
            url: "deleteQuotationFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.taxPrice", "quotation.taxRate"]
            }
        },

        queryQuotationFunctionAreaItemByQuotationFunctionAreaId: {
            url: "queryQuotationFunctionAreaItemByQuotationFunctionAreaId.do",
            type: "query",
            tranargs: [{
                result: "quotationFunctionAreaItems",
                args: ["initNum", "num", "addPrice", "unitPrice", "subPrice"]
            }]
        },
        updateQuotationFunctionAreaItem: {
            url: "updateQuotationFunctionAreaItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.taxPrice", "quotation.taxRate", "quotationFunctionAreaItem.initNum", "quotationFunctionAreaItem.num", "quotationFunctionAreaItem.addPrice", "quotationFunctionAreaItem.unitPrice", "quotationFunctionAreaItem.subPrice"]
            }
        },
        updateQuotationFunctionAreaItemForSpec: {
            url: "updateQuotationFunctionAreaItemForSpec.do",
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.taxPrice", "quotation.taxRate", "quotationFunctionAreaItem.addPrice", "quotationFunctionAreaItem.unitPrice", "quotationFunctionAreaItem.subPrice"]
            }
        },
        updateQuotationFunctionAreaItemForIndex: {
            url: "updateQuotationFunctionAreaItemForIndex.do",
            intercept: true
        },
        updateQuotationFunctionAreaItemByQuotationIdAType: {
            url: "updateQuotationFunctionAreaItemByQuotationIdAType.do",
            type: "update",
            tranargs: {
                args: ["quotationFunctionAreaItem.unitPrice"]
            }
        },
        deleteQuotationFunctionAreaItem: {
            url: "deleteQuotationFunctionAreaItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.taxPrice", "quotation.taxRate"]
            }
        },

        pageExtension: {
            url: "pageExtension.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["undisPrice", "total"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },
        pageExtensionByOrderId: {
            url: "pageExtensionByOrderId.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["undisPrice", "disPrice", "total"]
            }]
        },
        queryExtensionByOrderId: {
            url: "queryExtensionByOrderId.do",
            type: "query",
            tranargs: [{
                result: "extensions",
                args: ["undisPrice", "disPrice", "total"]
            }, {
                result: "extensions-extensionItems",
                args: ["addPrice", "unitPrice", "subPrice", "num"]
            }]
        },
        queryExtensionByEid: {
            url: "queryExtensionByEid.do",
            type: "query",
            tranargs: [{
                result: "extension",
                args: ["undisPrice", "disPrice", "total"]
            }, {
                result: "extension-extensionItems",
                args: ["addPrice", "unitPrice", "subPrice", "num"]
            }]
        },
        addExtension: {
            url: "addExtension.do"
        },
        updateExtension: {
            url: "updateExtension.do",
            intercept: true
        },
        updateExtensionForAdvance: {
            url: "updateExtensionForAdvance.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["extension.undisPrice", "extension.disPrice", "extension.total"]
            }
        },
        deleteExtension: {
            url: "deleteExtension.do",
            intercept: true
        },

        queryExtensionItemByEid: {
            url: "queryExtensionItemByEid.do",
            type: "query",
            tranargs: [{
                result: "extensionItems",
                args: ["addPrice", "unitPrice", "subPrice", "num", "initnum"]
            }]
        },
        queryExtensionItemByEids: {
            url: "queryExtensionItemByEids.do",
            type: "query",
            tranargs: [{
                result: "extensionItems",
                args: ["addPrice", "unitPrice", "subPrice", "num", "initnum"]
            }]
        },
        updateExtensionItem: {
            url: "updateExtensionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["extension.undisPrice", "extension.disPrice", "extension.total", "extensionItem.addPrice", "extensionItem.unitPrice", "extensionItem.subPrice", "extensionItem.num", "extensionItem.initnum"]
            }
        },
        deleteExtensionItem: {
            url: "deleteExtensionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["extension.undisPrice", "extension.disPrice", "extension.total"]
            }
        },

        queryQuotetion: {
            url: "queryQuotetion.do",
            type: "query",
            tranargs: [{
                result: "quotetions",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "basePrice", "taxPrice", "taxRate"]
            }]
        },
        queryQuotetionByQid: {
            url: "queryQuotetionByQid.do",
            type: "query",
            tranargs: [{
                result: "quotetion",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "basePrice", "taxPrice", "taxRate"]
            }]
        },
        queryQuotetionByNo: {
            url: "queryQuotetionByNo.do",
            type: "query",
            tranargs: [{
                result: "quotetion",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "basePrice", "taxPrice", "taxRate"]
            }]
        },
        addQuotetion: {
            url: "addQuotetion.do"
        },
        updateQuotetion: {
            url: "updateQuotetion.do"
        },
        updateQuotetionForAdvance: {
            url: "updateQuotetionForAdvance.do",
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.basePrice", "quotetion.taxPrice", "quotetion.taxRate"]
            }
        },
        deleteQuotetion: {
            url: "deleteQuotetion.do"
        },
        replicaQuotetion: {
            url: "replicaQuotetion.do",
            type: "update",
            tranargs: {
                args: [],
                query: [{
                    result: "quotetion",
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "basePrice", "notSalesmanRate", "taxPrice", "taxRate"]
                }]
            }
        },
        cloneQuotetion: {
            url: "cloneQuotetion.do",
            type: "update",
            tranargs: {
                args: [],
                query: [{
                    result: "quotetion",
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "basePrice", "notSalesmanRate", "taxPrice", "taxRate"]
                }]
            }
        },
        copyQuotetion: {
            url: "copyQuotetion.do",
            type: "update",
            tranargs: {
                args: [],
                query: [{
                    result: "quotetion",
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "basePrice", "notSalesmanRate", "taxPrice", "taxRate"]
                }]
            }
        },

        queryQuotetionFunctionAreaByQid: {
            url: "queryQuotetionFunctionAreaByQid.do",
            type: "query",
            tranargs: [{
                result: "quotetionFunctionAreas-quotetionFunctionAreaItems",
                args: ["unitPrice", "num"]
            }]
        },
        addQuotetionFuctionArea: {
            url: "addQuotetionFuctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.basePrice", "quotetion.taxPrice", "quotetion.taxRate"],
                query: [{
                    result: "quotetionFunctionAreas-quotetionFunctionAreaItems",
                    args: ["unitPrice", "num"]
                }]
            }
        },
        updateQuotetionFunctionArea: {
            url: "updateQuotetionFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.basePrice", "quotetion.taxPrice", "quotetion.taxRate"],
            }
        },
        deleteQuotetionFunctionArea: {
            url: "deleteQuotetionFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.basePrice", "quotetion.taxPrice", "quotetion.taxRate"],
            }
        },

        updateQuotetionFunctionAreaItem: {
            url: "updateQuotetionFunctionAreaItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.basePrice", "quotetion.taxPrice", "quotetion.taxRate", "quotetionFunctionAreaItem.unitPrice", "quotetionFunctionAreaItem.num"],
            }
        },
        updateQuotetionFunctionAreaItemForIndex: {
            url: "updateQuotetionFunctionAreaItemForIndex.do",
            intercept: true
        },
        updateQuotetionFunctionAreaItemForSpec: {
            url: "updateQuotetionFunctionAreaItemForSpec.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.basePrice", "quotetion.taxPrice", "quotetion.taxRate", "quotetionFunctionAreaItem.unitPrice"],
            }
        },
        deleteQuotetionFunctionAreaItem: {
            url: "deleteQuotetionFunctionAreaItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.basePrice", "quotetion.taxPrice", "quotetion.taxRate"],
            }
        },
        // -------- 选材单 -------------------------
        pageSelection: {
            url: "pageSelection.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "quotationTotal", "extensionAddTotal", "extensionReduceTotal", "addReduceAddTotal", "addReduceMinusTotal"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },
        querySelectionByOrderId: {
            url: "querySelectionByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "selection",
                args: ["total", "quotationTotal", "extensionAddTotal", "extensionReduceTotal", "addReduceAddTotal", "addReduceMinusTotal"]
            }]
        },
        querySelectionByQid: {
            url: "querySelectionByQid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "selection",
                args: ["total", "quotationTotal", "extensionAddTotal", "extensionReduceTotal", "addReduceAddTotal", "addReduceMinusTotal"]
            }]
        },
        updateSelectionForAdvance: {
            url: "updateSelectionForAdvance.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["selection.total", "selection.quotationTotal", "selection.extensionAddTotal", "selection.extensionReduceTotal", "selection.addReduceAddTotal", "selection.addReduceMinusTotal"],
            }
        },
        addSelection: {
            url: "addSelection.do"
        },
        sendSelection: {
            url: "sendSelection.do"
        },
        affirmSelection: {
            url: "affirmSelection.do"
        },
        // -------- 选材项 -------------------------
        pageSelectionItem: {
            url: "pageSelectionItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num", "initNum", "refnum", "postprice", "preprice"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },
        pageSelectionItemForSupplier: {
            url: "pageSelectionItemForSupplier.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num", "initNum", "refnum", "postprice", "preprice"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },
        pageSelectionItemForEscorter: {
            url: "pageSelectionItemForEscorter.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num", "initNum", "refnum", "postprice", "preprice"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },
        querySelectionItemByOrderId: {
            url: "querySelectionItemByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "selectionItems",
                args: ["num", "initNum", "refnum", "postprice", "preprice"]
            }]
        },
        querySelectionItem: {
            url: "querySelectionItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "selectionItems",
                args: ["num", "initNum", "refnum", "postprice", "preprice"]
            }]
        },
        collateSelectionItem: {
            url: "collateSelectionItem.do",
            type: "query"
        },
        addSelectionItem: {
            url: "addSelectionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["selection.total", "selection.quotationTotal", "selection.extensionAddTotal", "selection.extensionReduceTotal", "selection.addReduceAddTotal", "selection.addReduceMinusTotal", "selectionItem.initNum", "selectionItem.num", "selectionItem.postprice", "selectionItem.preprice", ],
                query: [{
                    result: "selectionItem",
                    args: ["num", "initNum", "refnum", "postprice", "preprice"]
                }]
            }
        },
        updateSelectionItem: {
            url: "updateSelectionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["selection.total", "selection.quotationTotal", "selection.extensionAddTotal", "selection.extensionReduceTotal", "selection.addReduceAddTotal", "selection.addReduceMinusTotal", "selectionItem.num"],
            }
        },
        tranSelectionItem: {
            url: "tranSelectionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["selectionItems.num"]
            }
        },
        checkSelectionItem: {
            url: "checkSelectionItem.do"
        },
        confirmSelectionItem: {
            url: "confirmSelectionItem.do"
        },
        finishSelectionItem: {
            url: "finishSelectionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["selectionItems.refnum"]
            }
        },
        reviewSelectionItem: {
            url: "reviewSelectionItem.do"
        },
        balanceSelectionItem: {
            url: "balanceSelectionItem.do"
        },
        deleteSelectionItem: {
            url: "deleteSelectionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["selection.total", "selection.quotationTotal", "selection.extensionAddTotal", "selection.extensionReduceTotal", "selection.addReduceAddTotal", "selection.addReduceMinusTotal"],
            }
        },
        cutoffSelectionItem: {
            url: "cutoffSelectionItem.do"
        },

        // -------- 定额 -------------------------
        pageNormtion: {
            url: "pageNormtion.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["moodTotal"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },
        queryNormtion: {
            url: "queryNormtion.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "normtion",
                args: ["moodTotal", "mriceTotal"]
            }]
        },
        queryQuotationNormood: {
            url: "queryQuotationNormood.do",
            type: "query",
            tranargs: [{
                result: "quotationFunctionAreas-quotationFunctionAreaItems",
                args: ["unitPrice", "initNum", "num"]
            }, {
                result: "quotationFunctionAreas-quotationFunctionAreaItems-normood",
                args: ["normnum", "storenum"]
            }, {
                result: "quotationFunctionAreas-quotationFunctionAreaItems-normood-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        queryNormoodItem: {
            url: "queryNormoodItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "normoodItems",
                args: ["normnum", "storenum"]
            }]
        },
        // 增加方法
        addNormoodItem: {
            url: "addNormoodItem.do",
            type: "update",
            tranargs: {
                args: ["normoodItem.normnum", "normoodItem.storenum"],
                query: [{
                    result: "normoodItems",
                    args: ["normnum", "storenum"]
                }]
            }
        },
        // 删除方法
        deleteNormoodItem: {
            url: "deleteNormoodItem.do",
            intercept: true
        },

        queryNormriceItem: {
            url: "queryNormriceItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "normriceItems",
                args: ["trannum", "salary", "num"]
            }]
        },
        addNormriceItem: {
            url: "addNormriceItem.do",
            type: "update",
            tranargs: {
                args: ["normriceItem.trannum", "normriceItem.salary", "normriceItem.num"],
                query: [{
                    result: "normriceItem",
                    args: ["trannum", "salary", "num"]
                }]
            },
        },
        deleteNormriceItem: {
            url: "deleteNormriceItem.do",
            intercept: true
        },

        queryExtensionNormood: {
            url: "queryExtensionNormood.do",
            type: "query",
            tranargs: [{
                result: "extensions-extensionItems",
                args: ["addPrice", "unitPrice", "subPrice", "num"]
            }, {
                result: "extensions-extensionItems-normood",
                args: ["normnum", "storenum"]
            }, {
                result: "extensions-extensionItems-normood-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        queryAddReduceNormood: {
            url: "queryAddReduceNormood.do",
            type: "query",
            tranargs: [{
                result: "addReduces-addReduceItems",
                args: ["unitPrice", "initNum", "num"]
            }, {
                result: "addReduces-addReduceItems-normood",
                args: ["normnum", "storenum"]
            }, {
                result: "addReduces-addReduceItems-normood-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        queryQuotationNormrice: {
            url: "queryQuotationNormrice.do",
            type: "query",
            tranargs: [{
                result: "quotationFunctionAreas-quotationFunctionAreaItems",
                args: ["unitPrice", "initNum", "num"]
            }, {
                result: "quotationFunctionAreas-quotationFunctionAreaItems-normrice",
                args: ["trannum", "salary"]
            }, {
                result: "quotationFunctionAreas-quotationFunctionAreaItems-normrice-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        queryExtensionNormrice: {
            url: "queryExtensionNormrice.do",
            type: "query",
            tranargs: [{
                result: "extensions-extensionItems",
                args: ["unitPrice", "initnum", "num"]
            }, {
                result: "extensions-extensionItems-normrice",
                args: ["trannum", "salary"]
            }, {
                result: "extensions-extensionItems-normrice-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        queryAddReduceNormrice: {
            url: "queryAddReduceNormrice.do",
            type: "query",
            tranargs: [{
                result: "addReduces-addReduceItems",
                args: ["unitPrice", "initnum", "num"]
            }, {
                result: "addReduces-addReduceItems-normrice",
                args: ["trannum", "salary"]
            }, {
                result: "addReduces-addReduceItems-normrice-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        amountQuotationNormood: {
            url: "amountQuotationNormood.do",
            type: "query",
            tranargs: [{
                result: "normoods",
                args: ["normnum", "storenum"]
            }, {
                result: "normoods-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        amountExtensionNormood: {
            url: "amountExtensionNormood.do",
            type: "query",
            tranargs: [{
                result: "normoods",
                args: ["normnum", "storenum"]
            }, {
                result: "normoods-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        amountAddReduceNormood: {
            url: "amountAddReduceNormood.do",
            type: "query",
            tranargs: [{
                result: "normoods",
                args: ["normnum", "storenum"]
            }, {
                result: "normoods-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        amountQuotationNormrice: {
            url: "amountQuotationNormrice.do",
            type: "query",
            tranargs: [{
                result: "normrices",
                args: ["trannum", "salary", "amount"]
            }, {
                result: "normrices-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        amountExtensionNormrice: {
            url: "amountExtensionNormrice.do",
            type: "query",
            tranargs: [{
                result: "normrices",
                args: ["trannum", "salary", "amount"]
            }, {
                result: "normrices-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        amountAddReduceNormrice: {
            url: "amountAddReduceNormrice.do",
            type: "query",
            tranargs: [{
                result: "normrices",
                args: ["trannum", "salary", "amount"]
            }, {
                result: "normrices-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },

    }
});

$.extend(api, {
    addReduce: {

        pageAddReduce: {
            url: "pageAddReduce.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "discount"]
            }, {
                result: "paging-data-decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },

        pageAddReduceByOrderId: {
            url: "pageAddReduceByOrderId.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "discount"]
            }]
        },
        queryAddReduceByOrderId: {
            url: "queryAddReduceByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "addReduces",
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "discount"]
            }, {
                result: "addReduces-addReduceItems",
                args: ["addPrice", "unitPrice", "subPrice", "num"]
            }]
        },
        queryAddReduceForPayedByOrderId: {
            url: "queryAddReduceForPayedByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "addReduces",
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "discount"]
            }, {
                result: "addReduces-addReduceItems",
                args: ["addPrice", "unitPrice", "subPrice", "num"]
            }]
        },
        queryAddReduceByArid: {
            url: "queryAddReduceByArid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "addReduce",
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "discount"]
            }, {
                result: "addReduce-addReduceItems",
                args: ["addPrice", "unitPrice", "subPrice", "num"]
            }]
        },
        queryAddReduceByDecorationPaymentId: {
            url: "queryAddReduceByDecorationPaymentId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "addReduce",
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "discount"]
            }, {
                result: "addReduce-addReduceItems",
                args: ["addPrice", "unitPrice", "subPrice", "num"]
            }]
        },
        addAddReduce: {
            url: "addAddReduce.do"
        },
        updateAddReduce: {
            url: "updateAddReduce.do",
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.discount"],
            }
        },
        updateAddReduceForAdvance: {
            url: "updateAddReduceForAdvance.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.discount"],
            }
        },
        submitAddReduce: {
            url: "submitAddReduce.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.discount"],
            }
        },
        unpayAddReduce: {
            url: "unpayAddReduce.do"
        },
        confirmAddReduce: {
            url: "confirmAddReduce.do"
        },
        affirmAddReduce: {
            url: "affirmAddReduce.do"
        },
        sendAddReduce: {
            url: "sendAddReduce.do"
        },
        deleteAddReduce: {
            url: "deleteAddReduce.do",
            intercept: true
        },

        queryAddReduceItemByAddReduceId: {
            url: "queryAddReduceItemByAddReduceId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "addReduceItems",
                args: ["addPrice", "unitPrice", "subPrice", "num", "initnum"]
            }]
        },

        queryAddReduceItemByAddReduceIds: {
            url: "queryAddReduceItemByAddReduceIds.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "addReduceItems",
                args: ["addPrice", "unitPrice", "subPrice", "num", "initnum"]
            }]
        },
        updateAddReduceItem: {
            url: "updateAddReduceItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.discount", "addReduceItem.addPrice", "addReduceItem.unitPrice", "addReduceItem.subPrice", "addReduceItem.num", "addReduceItem.initnum"],
            }
        },
        updateAddReduceItemForAdvance: {
            url: "updateAddReduceItemForAdvance.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.discount"],
            }
        },
        deleteAddReduceItem: {
            url: "deleteAddReduceItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.discount"],
            }
        },

    }
});
