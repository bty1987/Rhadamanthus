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
            url: "pagePutline.do"
        },
        queryRankForPlace: {
            url: "queryRankForPlace.do",
            demo: true
        },

        queryDecorationDesignerRank: {
            url: "queryDecorationDesignerRank.do"
        },
        queryDecorationDesignerDepartmentRank: {
            url: "queryDecorationDesignerDepartmentRank.do"
        },
        queryDecorationDesignerRegionRank: {
            url: "queryDecorationDesignerRegionRank.do"
        },
        decorationDesignerRank: {
            url: "decorationDesignerRank.do",
            demo: true
        },
        decorationDesignerDepartmentRank: {
            url: "decorationDesignerDepartmentRank.do",
            demo: true
        },
        decorationDesignerRegionRank: {
            url: "decorationDesignerRegionRank.do",
            demo: true
        },

        queryMaterialDesignerRank: {
            url: "queryMaterialDesignerRank.do"
        },
        queryMaterialDesignerDepartmentRank: {
            url: "queryMaterialDesignerDepartmentRank.do"
        },
        queryMaterialDesignerRegionRank: {
            url: "queryMaterialDesignerRegionRank.do"
        },
        materialDesignerRank: {
            url: "materialDesignerRank.do",
            demo: true
        },
        materialDesignerDepartmentRank: {
            url: "materialDesignerDepartmentRank.do",
            demo: true
        },
        materialDesignerRegionRank: {
            url: "materialDesignerRegionRank.do",
            demo: true
        },

        materialTypeReport: {
            url: "materialTypeReport.do",
            demo: true
        },
        materialBrandReport: {
            url: "materialBrandReport.do",
            demo: true
        },
        materialDepartmentReport: {
            url: "materialDepartmentReport.do",
            demo: true
        },
        designerReport: {
            url: "designerReport.do"
        },
        designerDeportmentReport: {
            url: "designerDeportmentReport.do"
        },
        designerRegionReport: {
            url: "designerRegionReport.do"
        },
        countMaterialType: {
            url: "countMaterialType.do",
            demo: true
        },
        countMaterialBrand: {
            url: "countMaterialBrand.do",
            demo: true
        },
        countDesigner: {
            url: "countDesigner.do",
            demo: true
        },
        countDesignerDepartment: {
            url: "countDesignerDepartment.do",
            demo: true
        },
        countDesignerRegion: {
            url: "countDesignerRegion.do",
            demo: true
        },

        reportCityCount: {
            url: "reportCityCount.do",
            demo: true
        },
        queryDecoration7Construction: {
            url: "queryDecoration7Construction.do",
            demo: true
        },
        queryDecoration7Achievement: {
            url: "queryDecoration7Achievement.do",
            type: "query",
            demo: true,
            tranargs: [{
                result: "paging-data",
                args: ["cs2", "cs3", "cs4", "cs5"]
            }]
        },
        updataDecoration7Construction: {
            url: "updataDecoration7Construction.do",
            demo: true
        }

    }
});
