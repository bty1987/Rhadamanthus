$.extend(api.index, {
    functionAreaIndex: {
        url: "/views/quotation/functionArea.html"
    },
    quotationAssignConfigIndex: {
        url: "/views/quotation/quotationAssignConfig.html"
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
    normriceItemIndex: {
        url: "/views/quotation/normriceItem.html"
    },

    ruotationIndex: {
        url: "/views/quotation/ruotationIndex.html"
    },
    ruotationPartIndex: {
        url: "/views/quotation/ruotationPart.html"
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
    selectionItemIndex: {
        url: "/views/quotation/selectionItem.html"
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

    qeasure4detailIndex: {
        url: "/views/quotation/qeasure4detail.html"
    },

    // 预算分配管理相关页面
    quotationAssignUserRuleIndex: {
        url: "/views/quotation/quotationAssignUserRule.html"
    },
    quotationAssignUserRuleItemIndex: {
        url: "/views/quotation/quotationAssignUserRuleItem.html"
    },

    quotationAssignRequestIndex: {
        url: "/views/quotation/quotationAssignRequest.html"
    },
    quotationAssignRequestSelfIndex: {
        url: "/views/quotation/quotationAssignRequest.html?mode=self"
    },
    quotationAssignRequestBudgetIndex: {
        url: "/views/quotation/quotationAssignRequest.html?type=budget"
    },
    quotationAssignRequestDesignIndex: {
        url: "/views/quotation/quotationAssignRequest.html?type=design"
    },
    quotationAssignConfigIndex: {
        url: "/views/quotation/quotationAssignConfig.html"
    },
    quotationAssignRecordIndex: {
        url: "/views/quotation/quotationAssignRecord.html"
    },

    quotationProfileIndex: {
        url: "/views/quotation/quotationProfile.html"
    },
    quotationProfile4detailIndex: {
        url: "/views/quotation/quotationProfile4detail.html"
    },
    quotationAssignTalkIndex: {
        url: "/views/quotation/quotationAssignTalk.html"
    }
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
        queryQuotationFunction: {
            url: "queryQuotationFunction.do"
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
        updateQuotationForTime: {
            url: "updateQuotationForTime.do"
        },
        updateQuotationVersionForDefault: {
            url: "updateQuotationVersionForDefault.do"
        },
        updateQuotationVersionForStatus: {
            url: "updateQuotationVersionForStatus.do"
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
        updateFunctionAreaForStatus: {
            url: "updateFunctionAreaForStatus.do"
        },
        deleteFunctionArea: {
            url: "deleteFunctionArea.do"
        },

        pageFunctionAreaType: {
            url: "pageFunctionAreaType.do",
            type: "query"
        },
        queryFunctionAreaType: {
            url: "queryFunctionAreaType.do",
            type: "query"
        },
        addFunctionAreaType: {
            url: "addFunctionAreaType.do",
            type: "update"
        },
        updateFunctionAreaType: {
            url: "updateFunctionAreaType.do",
            type: "update"
        },
        updateFunctionAreaTypeForStatus: {
            url: "updateFunctionAreaTypeForStatus.do"
        },
        deleteFunctionAreaType: {
            url: "deleteFunctionAreaType.do"
        },

        queryFunctionAreaCategoryByFaid: {
            url: "queryFunctionAreaCategoryByFaid.do",
            type: "query"
        },
        queryFunctionAreaCategoryForQuotation: {
            url: "queryFunctionAreaCategoryForQuotation.do",
            type: "query"
        },
        queryFunctionAreaFormatByFacids: {
            url: "queryFunctionAreaFormatByFacids.do",
            type: "query"
        },
        addFunctionAreaCategory: {
            url: "addFunctionAreaCategory.do",
            type: "update"
        },
        deleteFunctionAreaCategory: {
            url: "deleteFunctionAreaCategory.do",
            type: "update"
        },
        addFunctionAreaFormat: {
            url: "addFunctionAreaFormat.do",
            type: "update"
        },
        updateFunctionAreaFormat: {
            url: "updateFunctionAreaFormat.do",
            type: "update"
        },
        deleteFunctionAreaFormat: {
            url: "deleteFunctionAreaFormat.do",
            type: "update"
        },

        queryFunctionAreaOtem: {
            url: "queryFunctionAreaOtem.do"
        },
        makeFunctionAreaOtem: {
            url: "makeFunctionAreaOtem.do"
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

        queryQuotationFormat: {
            url: "queryQuotationFormat.do",
            type: "query",
            tranargs: [{
                result: "quotationFormats",
                args: ["price"]
            }]
        },

        queryQuotationFormatByQcid: {
            url: "queryQuotationFormatByQcid.do",
            type: "query",
            tranargs: [{
                result: "quotationFormats",
                args: ["price"]
            }]
        },
        addQuotationFormat: {
            url: "addQuotationFormat.do",
            type: "update",
            tranargs: {
                args: ["quotationFormat.price"]
            }
        },
        updateQuotationFormat: {
            url: "updateQuotationFormat.do",
            type: "update",
            tranargs: {
                args: ["quotationFormat.price"]
            }
        },
        updateQuotationFormatForStatus: {
            url: "updateQuotationFormatForStatus.do",
            type: "update",
            tranargs: {
                args: ["quotationFormat.price"]
            }
        },
        deleteQuotationFormat: {
            url: "deleteQuotationFormat.do"
        },

        pageQuotationItem: {
            url: "pageQuotationItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["addPrice", "unitPrice", "subPrice", "cost", "achePrice"]
            }]
        },
        pageQuotationItemByVersionId: {
            url: "pageQuotationItemByVersionId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["addPrice", "unitPrice", "subPrice", "cost", "achePrice"]
            }]
        },
        pageQuotationItemForPrice: {
            url: "pageQuotationItemForPrice.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["addPrice", "unitPrice", "subPrice", "cost", "achePrice"]
            }]
        },
        queryQuotationItemByItemIdAVersionId: {
            url: "queryQuotationItemByItemIdAVersionId.do",
            type: "query",
            tranargs: [{
                result: "quotationItem",
                args: ["addPrice", "unitPrice", "subPrice", "cost", "achePrice"]
            }]
        },
        queryQuotationItemByQiid: {
            url: "queryQuotationItemByQiid.do",
            type: "query",
            tranargs: [{
                result: "quotationItem",
                args: ["addPrice", "unitPrice", "subPrice", "cost", "achePrice"]
            }]
        },
        addQuotationItem: {
            url: "addQuotationItem.do",
            type: "update",
            tranargs: {
                args: ["quotationItem.addPrice", "quotationItem.unitPrice", "quotationItem.subPrice", "quotationItem.achePrice"]
            }
        },
        updateQuotationItem: {
            url: "updateQuotationItem.do",
            type: "update",
            tranargs: {
                args: ["quotationItem.addPrice", "quotationItem.unitPrice", "quotationItem.subPrice", "quotationItem.achePrice"]
            }
        },
        updateQuotationItemForStatus: {
            url: "updateQuotationItemForStatus.do"
        },
        updateQuotationItemForDiscount: {
            url: "updateQuotationItemForDiscount.do"
        },
        updateQuotationItemForFormula: {
            url: "updateQuotationItemForFormula.do"
        },
        updateQuotationItemForCost: {
            url: "updateQuotationItemForCost.do",
            type: "update",
            tranargs: {
                args: ["quotationItem.cost", "quotationItem.achePrice"]
            }
        },

        queryQuotationRtem: {
            url: "queryQuotationRtem.do",
            type: "query",
            tranargs: [{
                result: "quotationRtems-source",
                args: ["addPrice", "unitPrice", "subPrice", "cost", "achePrice"]
            }, {
                result: "quotationRtems-target",
                args: ["addPrice", "unitPrice", "subPrice", "cost", "achePrice"]
            }]
        },
        addQuotationRtem: {
            url: "addQuotationRtem.do",
        },
        deleteQuotationRtem: {
            url: "deleteQuotationRtem.do",
        },

        pageQuotationPrice: {
            url: "pageQuotationPrice.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["addPrice", "unitPrice", "subPrice"]
            }]
        },
        addQuotationPrice: {
            url: "addQuotationPrice.do",
            type: "update",
            tranargs: {
                args: ["quotationPrice.addPrice", "quotationPrice.unitPrice", "quotationPrice.subPrice"]
            }
        },
        updateQuotationPrice: {
            url: "updateQuotationPrice.do",
            type: "update",
            tranargs: {
                args: ["quotationPrice.addPrice", "quotationPrice.unitPrice", "quotationPrice.subPrice"]
            }
        },
        deleteQuotationPrice: {
            url: "deleteQuotationPrice.do"
        },

        queryQuotationPrefer: {
            url: "queryQuotationPrefer.do",
            type: "query",
            tranargs: [{
                result: "quotationPrefer",
                args: ["preferPrice", "managePrefer", "advancePrefer", "discount", "manageDiscount", "quotePrice", "quoteArea", "activityPrice", "activityProfit"]
            }]
        },
        updateQuotationPrefer: {
            url: "updateQuotationPrefer.do",
            type: "update",
            tranargs: {
                args: ["quotationPrefer.preferPrice", "quotationPrefer.managePrefer", "quotationPrefer.advancePrefer", "quotationPrefer.discount", "quotationPrefer.manageDiscount", "quotationPrefer.quotePrice", "quotationPrefer.quoteArea", "quotationPrefer.activityPrice", "quotationPrefer.activityProfit", "quotation.totalPrice", "quotation.taxPrice"]
            }
        },
        updateQuotationForInfo: {
            url: "updateQuotationForInfo.do",
        },

        pageQuotationLabel: {
            url: "pageQuotationLabel.do"
        },
        addQuotationLabel: {
            url: "addQuotationLabel.do"
        },
        updateQuotationLabel: {
            url: "updateQuotationLabel.do"
        },
        deleteQuotationLabel: {
            url: "deleteQuotationLabel.do"
        },

        pageQuotationRecord: {
            url: "pageQuotationRecord.do",
        },
        addQuotationRecord: {
            url: "addQuotationRecord.do",
        },

        queryFunctionAreaItemByFunctionAreaId: {
            url: "queryFunctionAreaItemByFunctionAreaId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "functionAreaItems-quotationItem",
                args: ["addPrice", "unitPrice", "subPrice", "achePrice"]
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
        updateFunctionAreaItemForSort: {
            url: "updateFunctionAreaItemForSort.do"
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
                args: ["quotePrice", "quoteArea", "unitPrice", "discount", "discountt", "manageRate", "manageDiscount", "manageDiscountt", "taxRate", "costPrice", "profitRate", "preferPrice", "mostPrice", "costRate", "mostRate", "activityPrice"]
            }]
        },
        queryPresignProduce: {
            url: "queryPresignProduce.do",
            type: "query",
            tranargs: [{
                result: "presignProduces",
                args: ["quotePrice", "quoteArea", "unitPrice", "discount", "discountt", "manageRate", "manageDiscount", "manageDiscountt", "taxRate", "costPrice", "profitRate", "preferPrice", "mostPrice", "costRate", "mostRate", "activityPrice"]
            }]
        },
        queryPresignProduceByPpid: {
            url: "queryPresignProduceByPpid.do",
            type: "query",
            tranargs: [{
                result: "presignProduce",
                args: ["quotePrice", "quoteArea", "unitPrice", "discount", "discountt", "manageRate", "manageDiscount", "manageDiscountt", "taxRate", "costPrice", "profitRate", "preferPrice", "mostPrice", "costRate", "mostRate", "activityPrice"]
            }]
        },
        addPresignProduce: {
            url: "addPresignProduce.do",
            type: "update",
            tranargs: {
                args: ["presignProduce.quotePrice", "presignProduce.quoteArea", "presignProduce.unitPrice", "presignProduce.discount", "presignProduce.discountt", "presignProduce.manageRate", "presignProduce.manageDiscount", "presignProduce.manageDiscountt", "presignProduce.taxRate", "presignProduce.costPrice", "presignProduce.profitRate", "presignProduce.preferPrice", "presignProduce.mostPrice", "presignProduce.costRate", "presignProduce.mostRate", "presignProduce.activityPrice"]
            }
        },
        updatePresignProduce: {
            url: "updatePresignProduce.do",
            type: "update",
            tranargs: {
                args: ["presignProduce.quotePrice", "presignProduce.quoteArea", "presignProduce.unitPrice", "presignProduce.discount", "presignProduce.discountt", "presignProduce.manageRate", "presignProduce.manageDiscount", "presignProduce.manageDiscountt", "presignProduce.taxRate", "presignProduce.costPrice", "presignProduce.profitRate", "presignProduce.preferPrice", "presignProduce.mostPrice", "presignProduce.costRate", "presignProduce.mostRate", "presignProduce.activityPrice"]
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
                args: ["basicNum", "price", "cost", "addPrice", "subPrice", "achePrice"]
            }]
        },
        pagePresignItemByPpid: {
            url: "pagePresignItemByPpid.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["basicNum", "price", "cost", "addPrice", "subPrice", "achePrice"]
            }, {
                result: "paging-data-presignProduce",
                args: ["quotePrice", "quoteArea", "unitPrice", "discount", "discountt", "manageRate", "manageDiscount", "manageDiscountt", "costPrice", "profitRate", "preferPrice", "mostPrice", "costRate", "mostRate"]
            }]
        },
        queryPresignItemByPiid: {
            url: "queryPresignItemByPiid.do",
            type: "query",
            tranargs: [{
                result: "presignItem",
                args: ["basicNum", "price", "cost", "addPrice", "subPrice", "achePrice"]
            }]
        },
        addPresignItem: {
            url: "addPresignItem.do",
            type: "update",
            tranargs: {
                args: ["presignItem.basicNum", "presignItem.price", "presignItem.cost", "presignItem.addPrice", "presignItem.subPrice", "presignItem.achePrice"]
            }
        },
        updatePresignItem: {
            url: "updatePresignItem.do",
            type: "update",
            tranargs: {
                args: ["presignItem.basicNum", "presignItem.price", "presignItem.cost", "presignItem.addPrice", "presignItem.subPrice", "presignItem.achePrice"]
            }
        },
        updatePresignItemForStatus: {
            url: "updatePresignItemForStatus.do"
        },
        deletePresignItem: {
            url: "deletePresignItem.do"
        },

        pagePresignPrice: {
            url: "pagePresignPrice.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["upperArea", "lowerArea", "price", "costPrice", "mostPrice", "activityPrice"]
            }]
        },
        queryPresignPrice: {
            url: "queryPresignPrice.do",
            type: "update",
            tranargs: {
                args: ["presignPrice.upperArea", "presignPrice.lowerArea", "presignPrice.price", "presignPrice.costPrice", "presignPrice.mostPrice", "presignPrice.activityPrice"],
                query: [{
                    result: "presignPrice",
                    args: ["upperArea", "lowerArea", "price", "costPrice", "mostPrice", "activityPrice"]
                }]
            },
        },
        addPresignPrice: {
            url: "addPresignPrice.do",
            type: "update",
            tranargs: {
                args: ["presignPrice.upperArea", "presignPrice.lowerArea", "presignPrice.price", "presignPrice.costPrice", "presignPrice.mostPrice", "presignPrice.activityPrice"]
            }
        },
        updatePresignPrice: {
            url: "updatePresignPrice.do",
            type: "update",
            tranargs: {
                args: ["presignPrice.upperArea", "presignPrice.lowerArea", "presignPrice.price", "presignPrice.costPrice", "presignPrice.mostPrice", "presignPrice.activityPrice"]
            }
        },
        updatePresignPriceForStatus: {
            url: "updatePresignPriceForStatus.do"
        },
        deletePresignPrice: {
            url: "deletePresignPrice.do"
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

        pageProtation: {
            url: "pageProtation.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["quotePrice", "quoteArea", "preferPrice", "managePrice", "manageDiscount", "taxPrice", "costPrice", "mostPrice", "totalCost", "totalProfit", "costRate", "mostRate", "manageRate", "taxRate", "profitRate", "discount", "unitPrice", "basicPrice", "comdPrice", "commPrice", "adddPrice", "addmPrice", "subdPrice", "submPrice", "subcPrice", "accdPrice", "accmPrice", "totalPrice", "manageProfit", "advanceProfit", "activityPrice", "activityProfit"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryProtationByOrderId: {
            url: "queryProtationByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "protations",
                args: ["quotePrice", "quoteArea", "preferPrice", "managePrice", "manageDiscount", "taxPrice", "costPrice", "mostPrice", "totalCost", "totalProfit", "costRate", "mostRate", "manageRate", "taxRate", "profitRate", "discount", "unitPrice", "basicPrice", "comdPrice", "commPrice", "adddPrice", "addmPrice", "subdPrice", "submPrice", "subcPrice", "accdPrice", "accmPrice", "totalPrice", "manageProfit", "advanceProfit", "activityPrice", "activityProfit"]
            }]
        },
        queryProtationForDefaultByOrderId: {
            url: "queryProtationForDefaultByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "protation",
                args: ["quotePrice", "quoteArea", "preferPrice", "managePrice", "manageDiscount", "taxPrice", "costPrice", "mostPrice", "totalCost", "totalProfit", "costRate", "mostRate", "manageRate", "taxRate", "profitRate", "discount", "unitPrice", "basicPrice", "comdPrice", "commPrice", "adddPrice", "addmPrice", "subdPrice", "submPrice", "subcPrice", "accdPrice", "accmPrice", "totalPrice", "manageProfit", "advanceProfit", "activityPrice", "activityProfit"]
            }]
        },
        queryProtationByPid: {
            url: "queryProtationByPid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "protation",
                args: ["quotePrice", "quoteArea", "preferPrice", "managePrice", "manageDiscount", "taxPrice", "costPrice", "mostPrice", "totalCost", "totalProfit", "costRate", "mostRate", "manageRate", "taxRate", "profitRate", "discount", "unitPrice", "basicPrice", "comdPrice", "commPrice", "adddPrice", "addmPrice", "subdPrice", "submPrice", "subcPrice", "accdPrice", "accmPrice", "totalPrice", "manageProfit", "advanceProfit", "activityPrice", "activityProfit"]
            }]
        },
        addProtation: {
            url: "addProtation.do",
            type: "update",
            tranargs: {
                args: ["protation.quotePrice", "protation.quoteArea", "protation.preferPrice", "protation.managePrice", "protation.manageDiscount", "protation.taxPrice", "protation.costPrice", "protation.mostPrice", "protation.totalCost", "protation.totalProfit", "protation.costRate", "protation.mostRate", "protation.manageRate", "protation.taxRate", "protation.profitRate", "protation.discount", "protation.unitPrice", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.subcPrice", "protation.accdPrice", "protation.accmPrice", "protation.totalPrice", "protation.manageProfit", "protation.advanceProfit", "protation.activityPrice", "protation.activityProfit"],
                query: [{
                    result: "protation",
                    args: ["quotePrice", "quoteArea", "preferPrice", "managePrice", "manageDiscount", "taxPrice", "costPrice", "mostPrice", "totalCost", "totalProfit", "costRate", "mostRate", "manageRate", "taxRate", "profitRate", "discount", "unitPrice", "basicPrice", "comdPrice", "commPrice", "adddPrice", "addmPrice", "subdPrice", "submPrice", "subcPrice", "accdPrice", "accmPrice", "totalPrice", "manageProfit", "advanceProfit", "activityPrice", "activityProfit"]
                }]
            }
        },
        updateProtation: {
            url: "updateProtation.do",
            type: "update",
            tranargs: {
                args: ["protation.quotePrice", "protation.quoteArea", "protation.preferPrice", "protation.managePrice", "protation.manageDiscount", "protation.taxPrice", "protation.costPrice", "protation.mostPrice", "protation.totalCost", "protation.totalProfit", "protation.costRate", "protation.mostRate", "protation.manageRate", "protation.taxRate", "protation.profitRate", "protation.discount", "protation.unitPrice", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.subcPrice", "protation.accdPrice", "protation.accmPrice", "protation.totalPrice", "protation.manageProfit", "protation.advanceProfit", "activityPrice", "activityProfit"]
            }
        },
        updateProtationForProfit: {
            url: "updateProtationForProfit.do",
            type: "update",
            tranargs: {
                args: ["protation.quotePrice", "protation.quoteArea", "protation.preferPrice", "protation.managePrice", "protation.manageDiscount", "protation.taxPrice", "protation.costPrice", "protation.mostPrice", "protation.totalCost", "protation.totalProfit", "protation.costRate", "protation.mostRate", "protation.manageRate", "protation.taxRate", "protation.profitRate", "protation.discount", "protation.unitPrice", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.subcPrice", "protation.accdPrice", "protation.accmPrice", "protation.totalPrice", "protation.manageProfit", "protation.advanceProfit", "protation.activityPrice", "protation.activityProfit"]
            }
        },
        updateProtationForAdvance: {
            url: "updateProtationForAdvance.do",
            type: "update",
            tranargs: {
                args: ["protation.quotePrice", "protation.quoteArea", "protation.preferPrice", "protation.managePrice", "protation.manageDiscount", "protation.taxPrice", "protation.costPrice", "protation.mostPrice", "protation.totalCost", "protation.totalProfit", "protation.costRate", "protation.mostRate", "protation.manageRate", "protation.taxRate", "protation.profitRate", "protation.discount", "protation.unitPrice", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.subcPrice", "protation.accdPrice", "protation.accmPrice", "protation.totalPrice", "protation.manageProfit", "protation.advanceProfit", "protation.activityPrice", "protation.activityProfit"]
            }
        },
        updateProtationForStatus: {
            url: "updateProtationForStatus.do"
        },
        changeProtationForDefault: {
            url: "changeProtationForDefault.do",
            type: "update",
            tranargs: {
                args: [],
                query: [{
                    result: "protation",
                    args: ["quotePrice", "quoteArea", "preferPrice", "managePrice", "manageDiscount", "taxPrice", "costPrice", "mostPrice", "totalCost", "totalProfit", "costRate", "mostRate", "manageRate", "taxRate", "profitRate", "discount", "unitPrice", "basicPrice", "comdPrice", "commPrice", "adddPrice", "addmPrice", "subdPrice", "submPrice", "subcPrice", "accdPrice", "accmPrice", "totalPrice", "manageProfit", "advanceProfit", "activityPrice", "activityProfit"]
                }]
            }
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
                args: ["basicNum", "price", "num", "cost", "addPrice", "subPrice", "achePrice"]
            }]
        },
        updateProtationItem: {
            url: "updateProtationItem.do",
            type: "update",
            intercept: true,
            tranargs: {
                args: ["protation.quotePrice", "protation.quoteArea", "protation.preferPrice", "protation.managePrice", "protation.manageDiscount", "protation.taxPrice", "protation.costPrice", "protation.mostPrice", "protation.totalCost", "protation.totalProfit", "protation.costRate", "protation.mostRate", "protation.manageRate", "protation.taxRate", "protation.profitRate", "protation.discount", "protation.unitPrice", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.subcPrice", "protation.accdPrice", "protation.accmPrice", "protation.totalPrice", "protation.manageProfit", "protation.advanceProfit", "protation.activityPrice", "protation.activityProfit", "protationItem.basicNum", "protationItem.num", "protationItem.cost", "protationItem.price", "protationItem.addPrice", "protationItem.subPrice", "protationItem.achePrice"]
            }
        },
        deleteProtationItem: {
            url: "deleteProtationItem.do",
            type: "update",
            intercept: true,
            tranargs: {
                args: ["protation.quotePrice", "protation.quoteArea", "protation.preferPrice", "protation.managePrice", "protation.manageDiscount", "protation.taxPrice", "protation.costPrice", "protation.mostPrice", "protation.totalCost", "protation.totalProfit", "protation.costRate", "protation.mostRate", "protation.manageRate", "protation.taxRate", "protation.profitRate", "protation.discount", "protation.unitPrice", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.subcPrice", "protation.accdPrice", "protation.accmPrice", "protation.totalPrice", "protation.manageProfit", "protation.advanceProfit", "protation.activityPrice", "protation.activityProfit", "protationItem.basicNum", "protationItem.num", "protationItem.cost", "protationItem.price", "protationItem.addPrice", "protationItem.subPrice", "protationItem.achePrice"]
            }
        },
        lockProtation: {
            url: "lockProtation.do"
        },
        unlockProtation: {
            url: "unlockProtation.do"
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
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "unachePrice", "consPrice", "comsPrice", "undisComPrice", "disComPrice", "taxPrice", "taxRate"]
            }, {
                result: "paging-data-decoration",
                args: ["notSalesmanRate"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryQuotationByOrderId: {
            url: "queryQuotationByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "quotations",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "unachePrice", "consPrice", "comsPrice", "undisComPrice", "disComPrice", "notSalesmanRate", "taxPrice", "taxRate"]
            }]
        },
        queryQuotationForDefaultByOrderId: {
            url: "queryQuotationForDefaultByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "quotation",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "unachePrice", "consPrice", "comsPrice", "undisComPrice", "disComPrice", "notSalesmanRate", "taxPrice", "taxRate"]
            }]
        },
        queryQuotationById: {
            url: "queryQuotationById.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "quotation",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "unachePrice", "consPrice", "comsPrice", "undisComPrice", "disComPrice", "notSalesmanRate", "taxPrice", "taxRate"]
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
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.consPrice", "quotation.comsPrice", "quotation.undisComPrice", "quotation.disComPrice", "quotation.taxPrice", "quotation.taxRate"]
            }
        },
        updateQuotationForPrice: {
            url: "updateQuotationForPrice.do",
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
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "unachePrice", "consPrice", "comsPrice", "undisComPrice", "disComPrice", "notSalesmanRate", "taxPrice", "taxRate"]
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
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "unachePrice", "consPrice", "comsPrice", "undisComPrice", "disComPrice", "notSalesmanRate", "taxPrice", "taxRate"]
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
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "costPrice", "unachePrice", "consPrice", "comsPrice", "undisComPrice", "disComPrice", "notSalesmanRate", "taxPrice", "taxRate"]
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
        submitQuotation: {
            url: "submitQuotation.do"
        },
        auditQuotation: {
            url: "auditQuotation.do"
        },
        finishQuotation: {
            url: "finishQuotation.do"
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
                args: ["unitPrice", "addPrice", "subPrice", "initNum", "num"]
            }],
            loading: {
                handle: true,
                content: "报价项加载中"
            },
        },
        addQuotationFunctionArea: {
            url: "addQuotationFunctionArea.do"
        },
        addQuotationFunctionAreaByFunctionAreaIds: {
            url: "addQuotationFunctionAreaByFunctionAreaIds.do",
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.taxRate", "quotation.taxPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.consPrice", "quotation.comsPrice", "quotation.undisComPrice", "quotation.disComPrice", "quotationFunctionAreas.quotationFunctionAreaParam.girth", "quotationFunctionAreas.quotationFunctionAreaParam.area", "quotationFunctionAreas.quotationFunctionAreaParam.height", "quotationFunctionAreas.quotationFunctionAreaParam.holeLength", "quotationFunctionAreas.quotationFunctionAreaParam.holeHeight", "quotationFunctionAreas.quotationFunctionAreaParam.windowLength", "quotationFunctionAreas.quotationFunctionAreaParam.windowHeight", "quotationFunctionAreas.quotationFunctionAreaParam.beamLength", "quotationFunctionAreas.quotationFunctionAreaParam.beamHeight", ],
                query: [{
                    result: "quotationFunctionAreas",
                    args: ["total"]
                }, {
                    result: "quotationFunctionAreas-quotationFunctionAreaParam",
                    args: ["girth", "area", "height", "holeLength", "holeHeight", "windowLength", "windowHeight", "beamLength", "beamHeight"]
                }, {
                    result: "quotationFunctionAreas-quotationFunctionAreaItems",
                    args: ["unitPrice", "addPrice", "subPrice", "initNum", "num"]
                }]
            }
        },
        updateQuotationFunctionArea: {
            url: "updateQuotationFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.consPrice", "quotation.comsPrice", "quotation.undisComPrice", "quotation.disComPrice", "quotation.taxPrice", "quotation.taxRate", "quotationFunctionArea.quotationFunctionAreaParam.girth", "quotationFunctionArea.quotationFunctionAreaParam.area", "quotationFunctionArea.quotationFunctionAreaParam.height", "quotationFunctionArea.quotationFunctionAreaParam.holeLength", "quotationFunctionArea.quotationFunctionAreaParam.holeHeight", "quotationFunctionArea.quotationFunctionAreaParam.windowLength", "quotationFunctionArea.quotationFunctionAreaParam.windowHeight", "quotationFunctionArea.quotationFunctionAreaParam.beamLength", "quotationFunctionArea.quotationFunctionAreaParam.beamHeight", ],
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
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.consPrice", "quotation.comsPrice", "quotation.undisComPrice", "quotation.disComPrice", "quotation.taxPrice", "quotation.taxRate"]
            }
        },
        copyQuotationFunctionArea: {
            url: "copyQuotationFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.consPrice", "quotation.comsPrice", "quotation.undisComPrice", "quotation.disComPrice", "quotation.taxPrice", "quotation.taxRate"],
                query: [{
                    result: "quotation",
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate", "taxPrice", "taxRate"]
                }, {
                    result: "quotationFunctionArea",
                    args: ["total"]
                }, {
                    result: "quotationFunctionArea-quotationFunctionAreaParam",
                    args: ["girth", "area", "height", "holeLength", "holeHeight", "windowLength", "windowHeight", "beamLength", "beamHeight"]
                }, {
                    result: "quotationFunctionArea-quotationFunctionAreaItems",
                    args: ["unitPrice", "addPrice", "subPrice", "initNum", "num"]
                }]
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
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.consPrice", "quotation.comsPrice", "quotation.undisComPrice", "quotation.disComPrice", "quotation.taxPrice", "quotation.taxRate", "quotationFunctionAreaItem.initNum", "quotationFunctionAreaItem.num", "quotationFunctionAreaItem.addPrice", "quotationFunctionAreaItem.unitPrice", "quotationFunctionAreaItem.subPrice"],
                query: [{
                    result: "quotationFunctionAreaItem",
                    args: ["initNum", "num", "addPrice", "unitPrice", "subPrice"]
                }]
            }
        },
        updateQuotationFunctionAreaItemForSpec: {
            url: "updateQuotationFunctionAreaItemForSpec.do",
            type: "update",
            tranargs: {
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.consPrice", "quotation.comsPrice", "quotation.undisComPrice", "quotation.disComPrice", "quotation.taxPrice", "quotation.taxRate", "quotationFunctionAreaItem.addPrice", "quotationFunctionAreaItem.unitPrice", "quotationFunctionAreaItem.subPrice"]
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
                args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice", "quotation.costPrice", "quotation.unachePrice", "quotation.consPrice", "quotation.comsPrice", "quotation.undisComPrice", "quotation.disComPrice", "quotation.taxPrice", "quotation.taxRate"]
            }
        },

        pageRuotation: {
            url: "pageRuotation.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["totalPrice"]
            }, {
                result: "paging-data-decoration",
                args: ["notSalesmanRate"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryRuotationById: {
            url: "queryRuotationById.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "ruotation",
                args: ["totalPrice"]
            }]
        },
        addRuotation: {
            url: "addRuotation.do",
            type: "update",
            tranargs: {
                args: ["ruotation.totalPrice"],
            }
        },
        updateRuotation: {
            url: "updateRuotation.do",
            type: "update",
            tranargs: {
                args: ["ruotation.totalPrice"],
            }
        },
        deleteRuotation: {
            url: "deleteRuotation.do"
        },

        queryRuotationItem: {
            url: "queryRuotationItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "ruotationItems",
                args: ["unitPrice", "addPrice", "subPrice", "initNum", "num"]
            }]
        },
        updateRuotationItem: {
            url: "updateRuotationItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["ruotation.totalPrice", "ruotationItem.unitPrice", "ruotationItem.addPrice", "ruotationItem.subPrice", "ruotationItem.initNum", "ruotationItem.num"],
                query: [{
                    result: "ruotationItem",
                    args: ["unitPrice", "addPrice", "subPrice", "initNum", "num"]
                }]
            }
        },
        updateRuotationItemForIndex: {
            url: "updateRuotationItemForIndex.do"
        },
        deleteRuotationItem: {
            url: "deleteRuotationItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["ruotation.totalPrice"]
            }
        },

        queryQuotationPicture: {
            url: "queryQuotationPicture.do"
        },
        addQuotationPicture: {
            url: "addQuotationPicture.do"
        },
        deleteQuotationPicture: {
            url: "deleteQuotationPicture.do"
        },

        pageExtension: {
            url: "pageExtension.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["undisPrice", "disPrice", "consPrice", "comsPrice", "total", "managePrice", "manageRate", "taxPrice", "taxRate"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        pageExtensionByOrderId: {
            url: "pageExtensionByOrderId.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["undisPrice", "disPrice", "consPrice", "comsPrice", "total", "managePrice", "manageRate", "taxPrice", "taxRate"]
            }]
        },
        queryExtensionByOrderId: {
            url: "queryExtensionByOrderId.do",
            type: "query",
            tranargs: [{
                result: "extensions",
                args: ["undisPrice", "disPrice", "consPrice", "comsPrice", "total", "managePrice", "manageRate", "taxPrice", "taxRate"]
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
                args: ["undisPrice", "disPrice", "consPrice", "comsPrice", "total", "managePrice", "manageRate", "taxPrice", "taxRate"]
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
                args: ["extension.undisPrice", "extension.disPrice", "extension.consPrice", "extension.comsPrice", "extension.total", "extension.managePrice", "extension.manageRate", "extension.taxPrice", "extension.taxRate"]
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
                args: ["extension.undisPrice", "extension.disPrice", "extension.consPrice", "extension.comsPrice", "extension.total", "extension.managePrice", "extension.manageRate", "extension.taxPrice", "extension.taxRate", "extensionItem.addPrice", "extensionItem.unitPrice", "extensionItem.subPrice", "extensionItem.num", "extensionItem.initnum"]
            }
        },
        upgradeExtensionItem: {
            url: "upgradeExtensionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["extensionItem.addPrice", "extensionItem.unitPrice", "extensionItem.subPrice", "extensionItem.num", "extensionItem.initnum"]
            }
        },
        deleteExtensionItem: {
            url: "deleteExtensionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["extension.undisPrice", "extension.disPrice", "extension.consPrice", "extension.comsPrice", "extension.total", "extension.managePrice", "extension.manageRate", "extension.taxPrice", "extension.taxRate"]
            }
        },

        queryQuotetion: {
            url: "queryQuotetion.do",
            type: "query",
            tranargs: [{
                result: "quotetions",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "unachePrice", "basePrice", "consPrice", "comsPrice", "taxPrice", "taxRate"]
            }]
        },
        queryQuotetionByQid: {
            url: "queryQuotetionByQid.do",
            type: "query",
            tranargs: [{
                result: "quotetion",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "unachePrice", "basePrice", "consPrice", "comsPrice", "taxPrice", "taxRate"]
            }]
        },
        queryQuotetionByNo: {
            url: "queryQuotetionByNo.do",
            type: "query",
            tranargs: [{
                result: "quotetion",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "unachePrice", "basePrice", "consPrice", "comsPrice", "taxPrice", "taxRate"]
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
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.unachePrice", "quotetion.basePrice", "quotetion.consPrice", "quotetion.comsPrice", "quotetion.taxPrice", "quotetion.taxRate"]
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
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "unachePrice", "basePrice", "consPrice", "comsPrice", "notSalesmanRate", "taxPrice", "taxRate"]
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
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "unachePrice", "basePrice", "consPrice", "comsPrice", "notSalesmanRate", "taxPrice", "taxRate"]
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
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "unachePrice", "basePrice", "consPrice", "comsPrice", "notSalesmanRate", "taxPrice", "taxRate"]
                }]
            }
        },

        queryQuotetionFunctionAreaByQid: {
            url: "queryQuotetionFunctionAreaByQid.do",
            type: "query",
            tranargs: [{
                result: "quotetionFunctionAreas-quotetionFunctionAreaItems",
                args: ["unitPrice", "addPrice", "subPrice", "num"]
            }, {
                result: "quotetionFunctionAreas-quotetionFunctionAreaParam",
                args: ["girth", "area", "height", "holeLength", "holeHeight", "windowLength", "windowHeight", "beamLength", "beamHeight"]
            }]
        },
        addQuotetionFunctionArea: {
            url: "addQuotetionFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.unachePrice", "quotetion.basePrice", "quotetion.consPrice", "quotetion.comsPrice", "quotetion.taxPrice", "quotetion.taxRate", "quotetionFunctionAreas.quotetionFunctionAreaParam.girth", "quotetionFunctionAreas.quotetionFunctionAreaParam.area", "quotetionFunctionAreas.quotetionFunctionAreaParam.height", "quotetionFunctionAreas.quotetionFunctionAreaParam.holeLength", "quotetionFunctionAreas.quotetionFunctionAreaParam.holeHeight", "quotetionFunctionAreas.quotetionFunctionAreaParam.windowLength", "quotetionFunctionAreas.quotetionFunctionAreaParam.windowHeight", "quotetionFunctionAreas.quotetionFunctionAreaParam.beamLength", "quotetionFunctionAreas.quotetionFunctionAreaParam.beamHeight", ],
                query: [{
                    result: "quotetionFunctionAreas-quotetionFunctionAreaItems",
                    args: ["unitPrice", "addPrice", "subPrice", "num"]
                }, {
                    result: "quotetionFunctionAreas-quotetionFunctionAreaParam",
                    args: ["girth", "area", "height", "holeLength", "holeHeight", "windowLength", "windowHeight", "beamLength", "beamHeight"]
                }]
            }
        },
        updateQuotetionFunctionArea: {
            url: "updateQuotetionFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.unachePrice", "quotetion.basePrice", "quotetion.consPrice", "quotetion.comsPrice", "quotetion.taxPrice", "quotetion.taxRate", "quotetionFunctionArea.quotetionFunctionAreaParam.girth", "quotetionFunctionArea.quotetionFunctionAreaParam.area", "quotetionFunctionArea.quotetionFunctionAreaParam.height", "quotetionFunctionArea.quotetionFunctionAreaParam.holeLength", "quotetionFunctionArea.quotetionFunctionAreaParam.holeHeight", "quotetionFunctionArea.quotetionFunctionAreaParam.windowLength", "quotetionFunctionArea.quotetionFunctionAreaParam.windowHeight", "quotetionFunctionArea.quotetionFunctionAreaParam.beamLength", "quotetionFunctionArea.quotetionFunctionAreaParam.beamHeight"],
                query: [{
                    result: "quotetion",
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "unachePrice", "basePrice", "consPrice", "comsPrice", "taxPrice", "taxRate"]
                }, {
                    result: "quotetionFunctionArea",
                    args: ["total"]
                }, {
                    result: "quotetionFunctionArea-quotetionFunctionAreaParam",
                    args: ["girth", "area", "height", "holeLength", "holeHeight", "windowLength", "windowHeight", "beamLength", "beamHeight"]
                }]
            }
        },
        deleteQuotetionFunctionArea: {
            url: "deleteQuotetionFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.unachePrice", "quotetion.basePrice", "quotetion.consPrice", "quotetion.comsPrice", "quotetion.taxPrice", "quotetion.taxRate"],
            }
        },
        copyQuotetionFunctionArea: {
            url: "copyQuotetionFunctionArea.do",
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.basePrice", "quotetion.costPrice", "quotetion.unachePrice", "quotetion.consPrice", "quotetion.comsPrice", "quotetion.taxPrice", "quotetion.taxRate"],
                query: [{
                    result: "quotetion",
                    args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "costPrice", "unachePrice", "basePrice", "consPrice", "comsPrice", "notSalesmanRate", "taxPrice", "taxRate"]
                }, {
                    result: "quotetionFunctionArea",
                    args: ["total"]
                }, {
                    result: "quotetionFunctionArea-quotetionFunctionAreaParam",
                    args: ["girth", "area", "height", "holeLength", "holeHeight", "windowLength", "windowHeight", "beamLength", "beamHeight"]
                }, {
                    result: "quotetionFunctionArea-quotetionFunctionAreaItems",
                    args: ["unitPrice", "addPrice", "subPrice", "initNum", "num"]
                }]
            }
        },

        updateQuotetionFunctionAreaItem: {
            url: "updateQuotetionFunctionAreaItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.unachePrice", "quotetion.basePrice", "quotetion.consPrice", "quotetion.comsPrice", "quotetion.taxPrice", "quotetion.taxRate", "quotetionFunctionAreaItem.unitPrice", "quotetionFunctionAreaItem.addPrice", "quotetionFunctionAreaItem.subPrice", "quotetionFunctionAreaItem.num"],
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
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.unachePrice", "quotetion.basePrice", "quotetion.consPrice", "quotetion.comsPrice", "quotetion.taxPrice", "quotetion.taxRate", "quotetionFunctionAreaItem.unitPrice", "quotetionFunctionAreaItem.addPrice", "quotetionFunctionAreaItem.subPrice"],
            }
        },
        deleteQuotetionFunctionAreaItem: {
            url: "deleteQuotetionFunctionAreaItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.costPrice", "quotetion.unachePrice", "quotetion.basePrice", "quotetion.consPrice", "quotetion.comsPrice", "quotetion.taxPrice", "quotetion.taxRate"],
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
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
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
        updateSelection: {
            url: "updateSelection.do"
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
        lockSelection: {
            url: "lockSelection.do"
        },
        unlockSelection: {
            url: "unlockSelection.do"
        },
        resetSelection: {
            url: "resetSelection.do"
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
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
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
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
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
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        pageSelectionItemForAccount: {
            url: "pageSelectionItemForAccount.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num", "initNum", "refnum", "postprice", "preprice"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
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
        updateSelectionItemForSupplier: {
            url: "updateSelectionItemForSupplier.do",
            intercept: true,
            type: "update"
        },
        refundSelectionItem: {
            url: "refundSelectionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["selectionItem.refnum"],
            }
        },
        addedSelectionItem: {
            url: "addedSelectionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["selectionItem.num"],
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
            url: "reviewSelectionItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["selectionItems.refnum"]
            }
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
            url: "cutoffSelectionItem.do",
            intercept: true,
        },
        rejectSelectionItem: {
            url: "rejectSelectionItem.do"
        },
        accountSelectionItem: {
            url: "accountSelectionItem.do"
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
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
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
        makeNormtion: {
            url: "makeNormtion.do",
            type: "update",
            tranargs: {
                args: ["normoodItem.normnum", "normoodItem.storenum", "normriceItem.trannum", "normriceItem.salary", "normriceItem.num"]
            }
        },
        makeNormtionForQuotation: {
            url: "makeNormtionForQuotation.do",
            type: "update",
            tranargs: {
                args: ["normoodItem.normnum", "normoodItem.storenum", "normriceItem.trannum", "normriceItem.salary", "normriceItem.num"]
            }
        },
        makeNormtionForExtension: {
            url: "makeNormtionForExtension.do",
            type: "update",
            tranargs: {
                args: ["normoodItem.normnum", "normoodItem.storenum", "normriceItem.trannum", "normriceItem.salary", "normriceItem.num"]
            }
        },
        makeNormtionForAddReduce: {
            url: "makeNormtionForAddReduce.do",
            type: "update",
            tranargs: {
                args: ["normoodItem.normnum", "normoodItem.storenum", "normriceItem.trannum", "normriceItem.salary", "normriceItem.num"]
            }
        },
        updateNormtionForStatus: {
            url: "updateNormtionForStatus.do"
        },

        queryNormoodItem: {
            url: "queryNormoodItem.do",
            type: "query",
            tranargs: [{
                result: "normoodItems",
                args: ["normnum", "storenum"]
            }]
        },
        amountNormoodItem: {
            url: "amountNormoodItem.do",
            type: "query",
            tranargs: [{
                result: "normoodItem",
                args: ["normnum", "storenum", "amount"]
            }]
        },
        addNormoodItem: {
            url: "addNormoodItem.do",
            type: "update",
            tranargs: {
                args: ["normoodItems.normnum", "normoodItems.storenum"],
                query: [{
                    result: "normoodItems",
                    args: ["normnum", "storenum"]
                }]
            }
        },
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
        confirmNormriceItem: {
            url: "confirmNormriceItem.do",
            type: "update"
        },
        rejectNormriceItem: {
            url: "rejectNormriceItem.do"
        },

        queryNormriceItemByType: {
            url: "queryNormriceItemByType.do",
            type: "query",
            tranargs: [{
                result: "normriceItems",
                args: ["trannum", "salary", "num"]
            }]
        },

        queryNormtimeItem: {
            url: "queryNormtimeItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "normtimeItems",
                args: ["trannum", "workdays", "num"]
            }]
        },
        addNormtimeItem: {
            url: "addNormtimeItem.do",
            type: "update",
            tranargs: {
                args: ["normtimeItem.trannum", "normtimeItem.workdays", "normtimeItem.num"],
                query: [{
                    result: "normtimeItem",
                    args: ["trannum", "workdays", "num"]
                }]
            },
        },
        deleteNormtimeItem: {
            url: "deleteNormtimeItem.do",
            intercept: true
        },

        queryQuotationNormood: {
            url: "queryQuotationNormood.do",
            type: "query",
            tranargs: [{
                result: "quotationFunctionAreas-quotationFunctionAreaItems",
                args: ["unitPrice", "initNum", "num"]
            }, {
                result: "quotationFunctionAreas-quotationFunctionAreaItems-normood",
                args: ["normnum", "storenum", "price"]
            }, {
                result: "quotationFunctionAreas-quotationFunctionAreaItems-normood-noods",
                args: ["selling", "balance"]
            }],
            loading: {
                handle: true,
                content: "报价定额信息加载中"
            }
        },
        queryExtensionNormood: {
            url: "queryExtensionNormood.do",
            type: "query",
            tranargs: [{
                result: "extensions-extensionItems",
                args: ["addPrice", "unitPrice", "subPrice", "num", "initnum"]
            }, {
                result: "extensions-extensionItems-normood",
                args: ["normnum", "storenum", "price"]
            }, {
                result: "extensions-extensionItems-normood-noods",
                args: ["selling", "balance"]
            }],
            loading: {
                handle: true,
                content: "扩展定额信息加载中"
            }
        },
        queryAddReduceNormood: {
            url: "queryAddReduceNormood.do",
            type: "query",
            tranargs: [{
                result: "addReduces-addReduceItems",
                args: ["unitPrice", "initnum", "num"]
            }, {
                result: "addReduces-addReduceItems-normood",
                args: ["normnum", "storenum", "price"]
            }, {
                result: "addReduces-addReduceItems-normood-noods",
                args: ["selling", "balance"]
            }],
            loading: {
                handle: true,
                content: "增减定额信息加载中"
            }
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
            }],
            loading: {
                handle: true,
            }
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
            }],
            loading: {
                handle: true,
            }
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
            }],
            loading: {
                handle: true,
            }
        },

        queryQuotationNormtime: {
            url: "queryQuotationNormtime.do",
            type: "query",
            tranargs: [{
                result: "quotationFunctionAreas-quotationFunctionAreaItems",
                args: ["unitPrice", "initNum", "num"]
            }, {
                result: "quotationFunctionAreas-quotationFunctionAreaItems-normtime",
                args: ["trannum", "workdays"]
            }, {
                result: "quotationFunctionAreas-quotationFunctionAreaItems-normtime-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }],
            loading: {
                handle: true,
            }
        },
        queryExtensionNormtime: {
            url: "queryExtensionNormtime.do",
            type: "query",
            tranargs: [{
                result: "extensions-extensionItems",
                args: ["addPrice", "unitPrice", "subPrice", "num", "initnum"]
            }, {
                result: "extensions-extensionItems-normtime",
                args: ["trannum", "workdays"]
            }, {
                result: "extensions-extensionItems-normtime-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }],
            loading: {
                handle: true,
            }
        },
        queryAddReduceNormtime: {
            url: "queryAddReduceNormtime.do",
            type: "query",
            tranargs: [{
                result: "addReduces-addReduceItems",
                args: ["unitPrice", "initnum", "num"]
            }, {
                result: "addReduces-addReduceItems-normtime",
                args: ["trannum", "workdays"]
            }, {
                result: "addReduces-addReduceItems-normtime-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }],
            loading: {
                handle: true,
            }
        },

        amountQuotationNormood: {
            url: "amountQuotationNormood.do",
            type: "query",
            tranargs: [{
                result: "normoods",
                args: ["normnum", "storenum", "price"]
            }, {
                result: "normoods-noods",
                args: ["selling", "balance"]
            }],
            loading: {
                handle: true,
            }
        },
        amountExtensionNormood: {
            url: "amountExtensionNormood.do",
            type: "query",
            tranargs: [{
                result: "normoods",
                args: ["normnum", "storenum", "price"]
            }, {
                result: "normoods-noods",
                args: ["selling", "balance"]
            }],
            loading: {
                handle: true,
            }
        },
        amountAddReduceNormood: {
            url: "amountAddReduceNormood.do",
            type: "query",
            tranargs: [{
                result: "normoods",
                args: ["normnum", "storenum", "price"]
            }, {
                result: "normoods-noods",
                args: ["selling", "balance"]
            }],
            loading: {
                handle: true,
            }
        },
        amountQuotationNormrice: {
            url: "amountQuotationNormrice.do",
            type: "query",
            tranargs: [{
                result: "normrices",
                args: ["trannum", "salary", "amount", "stuff", "num"]
            }, {
                result: "normrices-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }],
            loading: {
                handle: true,
            }
        },
        amountExtensionNormrice: {
            url: "amountExtensionNormrice.do",
            type: "query",
            tranargs: [{
                result: "normrices",
                args: ["trannum", "salary", "amount", "stuff", "num"]
            }, {
                result: "normrices-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }],
            loading: {
                handle: true,
            }
        },
        amountAddReduceNormrice: {
            url: "amountAddReduceNormrice.do",
            type: "query",
            tranargs: [{
                result: "normrices",
                args: ["trannum", "salary", "amount", "stuff", "num"]
            }, {
                result: "normrices-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }],
            loading: {
                handle: true,
            }
        },

        pageQeasure: {
            url: "pageQeasure.do",
            type: "query",
        },
        queryQeasureByOrderId: {
            url: "queryQeasureByOrderId.do",
            type: "query",
        },
        queryQeasureByQmid: {
            url: "queryQeasureByQmid.do",
            type: "query",
        },
        makeQeasure: {
            url: "makeQeasure.do",
        },
        handleQeasure: {
            url: "handleQeasure.do",
        },
        deleteQeasure: {
            url: "deleteQeasure.do",
        },

        queryQeasureFunctionArea: {
            url: "queryQeasureFunctionArea.do",
            type: "query",
        },
        queryQeasureFunctionAreaByQmfaId: {
            url: "queryQeasureFunctionAreaByQmfaId.do",
            type: "query",
        },
        makeQeasureFunctionArea: {
            url: "makeQeasureFunctionArea.do",
        },
        handleQeasureFunctionArea: {
            url: "handleQeasureFunctionArea.do",
        },
        deleteQeasureFunctionArea: {
            url: "deleteQeasureFunctionArea.do",
        },

        // -------- 预算分配管理 -------------------------
        // 预算员规则管理
        pageQuotationAssignUserRuleByCondition: {
            url: "pageQuotationAssignUserRuleByCondition.do"
        },
        queryQuotationAssignUserRuleForOption: {
            url: "queryQuotationAssignUserRuleForOption.do"
        },
        queryQuotationAssignUserRule: {
            url: "queryQuotationAssignUserRule.do"
        },
        queryQuotationAssignUserRuleByUid: {
            url: "queryQuotationAssignUserRuleByUid.do"
        },
        queryQuotationAssignUserRuleByCompany: {
            url: "queryQuotationAssignUserRuleByCompany.do"
        },
        queryQuotationAssignUserRuleByDid: {
            url: "queryQuotationAssignUserRuleByDid.do"
        },
        pullQuotationAssignUserRuleForPending: {
            url: "pullQuotationAssignUserRuleForPending.do"
        },
        addQuotationAssignUserRule: {
            url: "addQuotationAssignUserRule.do",
            validate: {
                "quotationAssignUserRule.user.uid": { required: true },
                "quotationAssignUserRule.company.cid": { required: true }
            }
        },
        updateQuotationAssignUserRule: {
            url: "updateQuotationAssignUserRule.do"
        },
        updateQuotationAssignUserRuleForStatus: {
            url: "updateQuotationAssignUserRuleForStatus.do"
        },
        disableQuotationAssignUserRuleByQaurid: {
            url: "disableQuotationAssignUserRuleByQaurid.do"
        },
        queryQuotationAssignUserRuleTypeByQaurid: {
            url: "queryQuotationAssignUserRuleTypeByQaurid.do"
        },
        updateQuotationAssignUserRuleType: {
            url: "updateQuotationAssignUserRuleType.do"
        },

        // 预算员规则明细
        queryQuotationAssignUserRuleItem: {
            url: "queryQuotationAssignUserRuleItem.do",
            type: "query",
            tranargs: [{
                result: "quotationAssignUserRuleItems",
                args: ["company", "department"]
            }]
        },

        // 根据公司/部门/装修类型查询可分配预算员
        queryQuotationAssignUserRuleForAvaile: {
            url: "queryQuotationAssignUserRuleForAvaile.do",
            type: "query",
            tranargs: [{
                result: "quotationAssignUserRules",
                args: ["user"]
            }]
        },

        // 待分配队列管理
        pageQuotationAssignRequestByCondition: {
            url: "pageQuotationAssignRequestByCondition.do"
        },
        queryQuotationAssignRequestForPending: {
            url: "queryQuotationAssignRequestForPending.do"
        },

        // ==================== 分配请求管理接口 ====================

        pageQuotationAssignRequest: {
            url: "pageQuotationAssignRequest.do",
            demo: true
        },

        // 预算员自助查询（后端自动注入当前用户userId过滤）
        pageQuotationAssignRequestByUserId: {
            url: "pageQuotationAssignRequestByUserId.do"
        },

        queryQuotationAssignRequestById: {
            url: "queryQuotationAssignRequestById.do",
            demo: true,
            type: "query"
        },

        createQuotationAssignRequest: {
            url: "createQuotationAssignRequest.do",
            validate: {
                "quotationAssignRequest.orderId": { required: true },
                "quotationAssignRequest.company.cid": { required: true }
            }
        },

        updateQuotationAssignRequest: {
            url: "updateQuotationAssignRequest.do",
            validate: {
                "quotationAssignRequest.qarid": { required: true }
            }
        },

        deleteQuotationAssignRequest: {
            url: "deleteQuotationAssignRequest.do",
            validate: {
                "quotationAssignRequest.qarid": { required: true }
            }
        },

        // ==================== 分配沟通消息接口 ====================

        queryQuotationAssignTalkByOrderId: {
            url: "queryQuotationAssignTalkByOrderId.do",
            result: "quotationAssignTalks"
        },

        sendQuotationAssignTalk: {
            url: "sendQuotationAssignTalk.do",
            result: "quotationAssignTalk"
        },

        // ==================== 分配记录管理接口 ====================

        pageQuotationAssignRecord: {
            url: "pageQuotationAssignRecord.do",
            demo: true
        },

        queryQuotationAssignRecordById: {
            url: "queryQuotationAssignRecordById.do",
            type: "query"
        },

        queryQuotationAssignRecordByOrderId: {
            url: "queryQuotationAssignRecordByOrderId.do",
        },

        // ==================== 预算员分配配置接口 ====================

        pageQuotationAssignConfig: {
            url: "pageQuotationAssignConfig.do",
        },

        queryQuotationAssignConfigById: {
            url: "queryQuotationAssignConfigById.do",
            type: "query"
        },

        createQuotationAssignConfig: {
            url: "createQuotationAssignConfig.do"
        },

        updateQuotationAssignConfig: {
            url: "updateQuotationAssignConfig.do"
        },

        deleteQuotationAssignConfig: {
            url: "deleteQuotationAssignConfig.do"
        },

        updateQuotationAssignConfigForStatus: {
            url: "updateQuotationAssignConfigForStatus.do"
        },

        updateQuotationAssignConfigForAssign: {
            url: "updateQuotationAssignConfigForAssign.do"
        },

        // ==================== 预算员规则管理接口 ====================

        pageQuotationAssignUserRule: {
            url: "pageQuotationAssignUserRule.do",
        },

        queryQuotationAssignUserRuleById: {
            url: "queryQuotationAssignUserRuleById.do",
            type: "query"
        },

        createQuotationAssignUserRule: {
            url: "createQuotationAssignUserRule.do"
        },

        updateQuotationAssignUserRule: {
            url: "updateQuotationAssignUserRule.do"
        },

        deleteQuotationAssignUserRule: {
            url: "deleteQuotationAssignUserRule.do"
        },

        updateQuotationAssignUserRuleForStatus: {
            url: "updateQuotationAssignUserRuleForStatus.do"
        },

        pageQuotationAssignUserRuleSummary: {
            url: "pageQuotationAssignUserRuleSummary.do"
        },

        syncQuotationAssignUserRuleStatus: {
            url: "syncQuotationAssignUserRuleStatus.do"
        },

        // ==================== 预算员规则明细（Item）管理接口 ====================

        pageQuotationAssignUserRuleItem: {
            url: "pageQuotationAssignUserRuleItem.do",
        },

        createQuotationAssignUserRuleItem: {
            url: "createQuotationAssignUserRuleItem.do"
        },

        updateQuotationAssignUserRuleItem: {
            url: "updateQuotationAssignUserRuleItem.do"
        },

        deleteQuotationAssignUserRuleItem: {
            url: "deleteQuotationAssignUserRuleItem.do"
        },

        createQuotationAssignUserRuleItemWithRule: {
            url: "createQuotationAssignUserRuleItemWithRule.do"
        },

        // 分配操作
        assignQuotationAssign: {
            url: "assignQuotationAssign.do",
            validate: {
                "quotationAssign.orderId": { required: true }
            }
        },

        // 入待分配队列（按 orderId 自动补全维度，写 PENDING 记录，独立事务）
        addQuotationAssignRequestForAuto: {
            url: "addQuotationAssignRequestForAuto.do",
            validate: {
                "quotationAssign.orderId": { required: true }
            }
        },

        // 正向自动分配（消费队列中该 orderId 的 PENDING 记录，尝试立即分配）
        autoQuotationAssign: {
            url: "autoQuotationAssign.do"
        },

        manualQuotationAssign: {
            url: "manualQuotationAssign.do",
            validate: {
                "quotationAssign.orderId": { required: true },
                "quotationAssign.quoter.userId": { required: true }
            }
        },
        finishQuotationAssign: {
            url: "finishQuotationAssign.do",
            validate: {
                "quotationAssign.orderId": { required: true }
            }
        },
        reassignQuotationAssign: {
            url: "reassignQuotationAssign.do",
            validate: {
                "quotationAssign.orderId": { required: true },
                "quotationAssign.quoter.userId": { required: true }
            }
        },
        transferQuotationAssign: {
            url: "transferQuotationAssign.do",
            validate: {
                "quotationAssign.orderId": { required: true },
                "quotationAssign.quoter.userId": { required: true }
            }
        },

        // -------- 增减项 -------------------------

        pageAddReduce: {
            url: "pageAddReduce.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "comsPrice", "discount", "taxRate", "taxPrice", "accountDiscount", "accountManageDiscount", "accountTaxDiscount"]
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
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "comsPrice", "discount", "taxRate", "taxPrice", "accountDiscount", "accountManageDiscount", "accountTaxDiscount"]
            }]
        },
        queryAddReduceByOrderId: {
            url: "queryAddReduceByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "addReduces",
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "comsPrice", "discount", "taxRate", "taxPrice", "accountDiscount", "accountManageDiscount", "accountTaxDiscount"]
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
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "comsPrice", "discount", "taxRate", "taxPrice", "accountDiscount", "accountManageDiscount", "accountTaxDiscount"]
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
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "comsPrice", "discount", "taxRate", "taxPrice", "accountDiscount", "accountManageDiscount", "accountTaxDiscount"]
            }, {
                result: "addReduce-addReduceItems",
                args: ["addPrice", "unitPrice", "subPrice", "num"]
            }]
        },
        queryAddReduceByDpid: {
            url: "queryAddReduceByDpid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "addReduce",
                args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice", "consPrice", "comsPrice", "discount", "taxRate", "taxPrice", "accountDiscount", "accountManageDiscount", "accountTaxDiscount"]
            }, {
                result: "addReduce-addReduceItems",
                args: ["addPrice", "unitPrice", "subPrice", "num"]
            }]
        },
        addAddReduce: {
            url: "addAddReduce.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.comsPrice", "addReduce.discount", "addReduce.taxRate", "addReduce.taxPrice", "addReduce.accountDiscount", "addReduce.accountManageDiscount", "addReduce.accountTaxDiscount"],
            }
        },
        updateAddReduce: {
            url: "updateAddReduce.do",
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.comsPrice", "addReduce.discount", "addReduce.taxRate", "addReduce.taxPrice", "addReduce.accountDiscount", "addReduce.accountManageDiscount", "addReduce.accountTaxDiscount"],
            }
        },
        updateAddReduceForAdvance: {
            url: "updateAddReduceForAdvance.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.comsPrice", "addReduce.discount", "addReduce.taxRate", "addReduce.taxPrice", "addReduce.accountDiscount", "addReduce.accountManageDiscount", "addReduce.accountTaxDiscount"],
            }
        },
        updateAddReduceForAccount: {
            url: "updateAddReduceForAccount.do",
            type: "update",
            tranargs: {
                args: ["addReduce.accountDiscount", "addReduce.accountManageDiscount", "addReduce.accountTaxDiscount"],
            }
        },
        openAddReduceForSalary: {
            url: "openAddReduceForSalary.do",
            type: "update"
        },
        rejectAddReduceForSalary: {
            url: "rejectAddReduceForSalary.do",
            type: "update"
        },
        submitAddReduce: {
            url: "submitAddReduce.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["addReduces.total"],
            }
        },
        cancelAddReduce: {
            url: "cancelAddReduce.do"
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
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.comsPrice", "addReduce.discount", "addReduceItem.addPrice", "addReduceItem.unitPrice", "addReduceItem.subPrice", "addReduceItem.num", "addReduceItem.initnum", "addReduce.taxRate", "addReduce.taxPrice"],
            }
        },
        updateAddReduceItemForAdvance: {
            url: "updateAddReduceItemForAdvance.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.comsPrice", "addReduce.discount", "addReduce.taxRate", "addReduce.taxPrice"],
            }
        },
        updateAddReduceItemForIndex: {
            url: "updateAddReduceItemForIndex.do",
            intercept: true
        },
        deleteAddReduceItem: {
            url: "deleteAddReduceItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice", "addReduce.consPrice", "addReduce.comsPrice", "addReduce.discount", "addReduce.taxRate", "addReduce.taxPrice"],
            }
        },

        // -------- 报价配置 -------------------------

        pageQuotationProfile: {
            url: "pageQuotationProfile.do"
        },
        queryQuotationProfileByQid: {
            url: "queryQuotationProfileByQid.do"
        },
        queryQuotationProfileByOrderId: {
            url: "queryQuotationProfileByOrderId.do"
        },
        queryQuotationProfileByQpid: {
            url: "queryQuotationProfileByQpid.do"
        },
        addQuotationProfile: {
            url: "addQuotationProfile.do"
        },
        makeQuotationProfile: {
            url: "makeQuotationProfile.do"
        },
        handleQuotationProfile: {
            url: "handleQuotationProfile.do"
        }
    }
});

$.extend(tools, {
    quotation: {
        version: function(content, no) {

            com.post(api.quotation.queryQuotationVersionByVersionId, {
                "quotationVersion.no": no
            }, function(res) {

                var quotationVersion = res.quotationVersion;

                com.showTip(content, "编号:" + quotationVersion.no + "<br\>版本名称:" + quotationVersion.name, "bottom");
            });
        }
    }
});
