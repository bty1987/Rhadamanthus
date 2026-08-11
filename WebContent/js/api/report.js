$.extend(api.index, {
    reportBizDeptIndex: {
        url: "/views/report/reportBizDept.html"
    },
    reportDesignDeptIndex: {
        url: "/views/report/reportDesignDept.html"
    },
    reportBizRegionIndex: {
        url: "/views/report/reportBizRegion.html"
    },
    reportDesignRegionIndex: {
        url: "/views/report/reportDesignRegion.html"
    },
    materialDepartmentReportIndex: {
        url: "/views/report/materialDepartmentReport.html"
    },
    materialDesignReportIndex: {
        url: "/views/report/materialDesignReport.html"
    },
    materialMerchantReportIndex: {
        url: "/views/report/materialMerchantReport.html"
    },
    rankIndex: {
        url: "/views/report/rank.html"
    },
    decorationFunnelReportIndex: {
        url: "/views/report/decorationFunnelReport.html"
    },
    paymentReportIndex: {
        url: "/views/report/paymentReport.html"
    },
    fulfillmentReportIndex: {
        url: "/views/report/fulfillmentReport.html"
    },
    materialSalesReportIndex: {
        url: "/views/report/materialSalesReport.html"
    },
    customerReportIndex: {
        url: "/views/report/customerReport.html"
    },
    inventoryReportIndex: {
        url: "/views/report/inventoryReport.html"
    },
    approvalReportIndex: {
        url: "/views/report/approvalReport.html"
    }
});

$.extend(api, {
    report: {
        pagePutline: {
            url: "pagePutline.do",
        },
        queryRankForPlace: {
            url: "queryRankForPlace.do",
            demo: true,
        },

        queryDecorationRank: {
            url: "queryDecorationRank.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "ranks",
                args: ["rank", "sachi", "tachi"]
            }]
        },
        queryDecorationDepartmentRank: {
            url: "queryDecorationDepartmentRank.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "ranks",
                args: ["rank", "sachi", "tachi"]
            }]
        },
        queryDecorationRegionRank: {
            url: "queryDecorationRegionRank.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "ranks",
                args: ["rank", "sachi", "tachi"]
            }]
        },
        decorationRank: {
            url: "decorationRank.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "ranks",
                args: ["rank", "sachi", "tachi"]
            }]
        },
        decorationDepartmentRank: {
            url: "decorationDepartmentRank.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "ranks",
                args: ["rank", "sachi", "tachi"]
            }]
        },
        decorationRegionRank: {
            url: "decorationRegionRank.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "ranks",
                args: ["rank", "sachi", "tachi"]
            }]
        },

        queryMaterialDesignerRank: {
            url: "queryMaterialDesignerRank.do",
        },
        queryMaterialDesignerDepartmentRank: {
            url: "queryMaterialDesignerDepartmentRank.do",
        },
        queryMaterialDesignerRegionRank: {
            url: "queryMaterialDesignerRegionRank.do",
        },
        materialDesignerRank: {
            url: "materialDesignerRank.do",
            demo: true,
        },
        materialDesignerDepartmentRank: {
            url: "materialDesignerDepartmentRank.do",
            demo: true,
        },
        materialDesignerRegionRank: {
            url: "materialDesignerRegionRank.do",
            demo: true,
        },

        materialTypeReport: {
            url: "materialTypeReport.do",
            demo: true,
        },
        materialBrandReport: {
            url: "materialBrandReport.do",
            demo: true,
        },
        materialDepartmentReport: {
            url: "materialDepartmentReport.do",
            demo: true,
        },
        designerReport: {
            url: "designerReport.do",
        },
        designerDeportmentReport: {
            url: "designerDeportmentReport.do",
        },
        designerRegionReport: {
            url: "designerRegionReport.do",
        },
        countMaterialType: {
            url: "countMaterialType.do",
            demo: true,
        },
        countMaterialBrand: {
            url: "countMaterialBrand.do",
            demo: true,
        },
        countDesigner: {
            url: "countDesigner.do",
            demo: true,
        },
        countDesignerDepartment: {
            url: "countDesignerDepartment.do",
            demo: true,
        },
        countDesignerRegion: {
            url: "countDesignerRegion.do",
            demo: true,
        },

        reportCityCount: {
            url: "reportCityCount.do",
            demo: true,
        },
        queryDecoration7Construction: {
            url: "queryDecoration7Construction.do",
            demo: true,
        },
        queryDecoration7Achievement: {
            url: "queryDecoration7Achievement.do",
            type: "query",
            demo: true,
            tranargs: [{
                result: "paging-data",
                args: ["cs0", "cs1", "cs2", "cs3", "cs4", "cs5", "cs6", "cs7"]
            }],
        },
        querySales7Achievement: {
            url: "querySales7Achievement.do",
            type: "query",
            demo: true,
            tranargs: [{
                result: "paging-data",
                args: ["cs0", "cs1", "cs2", "cs3", "cs4", "cs5", "cs6", "cs7"]
            }],
        },
        queryUser7Achievement: {
            url: "queryUser7Achievement.do",
            type: "query",
            demo: true,
        },
        queryConstruction7Achievement: {
            url: "queryConstruction7Achievement.do",
        },
        queryApproval7Achievement: {
            url: "queryApproval7Achievement.do",
        },
        updateDecoration7Construction: {
            url: "updateDecoration7Construction.do",
            demo: true,
        },
        updateDecoration7Achievement: {
            url: "updateDecoration7Achievement.do",
            demo: true,
        },
        rankAddReduce: {
            url: "rankAddReduce.do",
            type: "query",
            tranargs: [{
                result: "addReduceRankVOs",
                args: ["total"]
            }],
        },

        // ---- 装修销售转化分析（analytics 子域，数据源 report.metric_decoration_daily）----
        queryDecorationFunnel: {
            url: "queryDecorationFunnel.do",
            demo: true,
        },
        queryDecorationStatusDist: {
            url: "queryDecorationStatusDist.do",
            demo: true,
        },
        queryDecorationSignTrend: {
            url: "queryDecorationSignTrend.do",
            demo: true,
        },
        queryDecorationTypeDist: {
            url: "queryDecorationTypeDist.do",
            demo: true,
        },
        refreshDecorationMetric: {
            url: "refreshDecorationMetric.do",
            demo: true,
        },

        // ---- 财务收款分析（数据源 report.metric_payment_daily）----
        queryPaymentTrend: {
            url: "queryPaymentTrend.do",
            demo: true,
        },
        queryPaymentTypeDist: {
            url: "queryPaymentTypeDist.do",
            demo: true,
        },
        refreshPaymentMetric: {
            url: "refreshPaymentMetric.do",
            demo: true,
        },

        // ---- D3 装修履约：施工指标（数据源 report.metric_construction_monthly）----
        queryConstructionStartFinishTrend: {
            url: "queryConstructionStartFinishTrend.do",
            demo: true,
        },
        queryConstructionPeriodTrend: {
            url: "queryConstructionPeriodTrend.do",
            demo: true,
        },
        queryConstructionOverdueDist: {
            url: "queryConstructionOverdueDist.do",
            demo: true,
        },
        refreshConstructionMetric: {
            url: "refreshConstructionMetric.do",
            demo: true,
        },

        // ---- D3 装修履约：报价偏差（数据源 report.metric_quotation_monthly）----
        queryQuotationSignTrend: {
            url: "queryQuotationSignTrend.do",
            demo: true,
        },
        refreshQuotationMetric: {
            url: "refreshQuotationMetric.do",
            demo: true,
        },

        // ---- D4 主材经营（数据源 report.metric_sales_monthly）----
        querySalesTrend: {
            url: "querySalesTrend.do",
            demo: true,
        },
        querySalesCategoryDist: {
            url: "querySalesCategoryDist.do",
            demo: true,
        },
        refreshSalesMetric: {
            url: "refreshSalesMetric.do",
            demo: true,
        },

        // ---- D1 营销获客：客源转化（数据源 report.metric_customer_monthly）----
        queryCustomerFunnelTrend: {
            url: "queryCustomerFunnelTrend.do",
            demo: true,
        },
        queryCustomerSourceDist: {
            url: "queryCustomerSourceDist.do",
            demo: true,
        },
        queryCustomerConvertTrend: {
            url: "queryCustomerConvertTrend.do",
            demo: true,
        },
        refreshCustomerMetric: {
            url: "refreshCustomerMetric.do",
            demo: true,
        },

        // ---- D6 仓储物流（数据源 report.metric_inventory_monthly）----
        queryInventoryInOutTrend: {
            url: "queryInventoryInOutTrend.do",
            demo: true,
        },
        queryInventoryTypeDist: {
            url: "queryInventoryTypeDist.do",
            demo: true,
        },
        refreshInventoryMetric: {
            url: "refreshInventoryMetric.do",
            demo: true,
        },

        // ---- D9 运营管理：审批效率（数据源 report.metric_approval_monthly）----
        queryApprovalTrend: {
            url: "queryApprovalTrend.do",
            demo: true,
        },
        queryApprovalTypeDist: {
            url: "queryApprovalTypeDist.do",
            demo: true,
        },
        refreshApprovalMetric: {
            url: "refreshApprovalMetric.do",
            demo: true,
        },

    }
});
