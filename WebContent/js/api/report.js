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

    }
});
