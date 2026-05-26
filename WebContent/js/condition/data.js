Condition.addupRule("data", {

    "worktype": {
        label: "工种",
        type: "select",
        submitConfig: {
            name: "workTypeName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.common.queryWorkType,
            postData: {},
            listPath: "workTypes",
            keyPath: "name",
            valuePath: "name"
        }
    },

    "unit-name": {
        label: "查询单位",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "serviceNode-type": {
        label: "节点类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "serviceNodeType",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "village-name": {
        label: "楼盘名称",
        type: "text",
        submitConfig: {
            name: "villageName",
            op: "cn",
            validate: null
        }
    },
    "village-developer": {
        label: "开发商",
        type: "text",
        submitConfig: {
            name: "developer",
            op: "cn",
            validate: null
        }
    },

    "village-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "0",
                value: "全部"
            }, {
                key: "0",
                value: "启用"
            }, {
                key: "1",
                value: "禁用"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    "village-deliveryStart": {
        label: "交付时间起始",
        type: "datePicker",
        submitConfig: {
            name: "deliveryTimeStart",
            op: "ge",
            validate: null
        }
    },

    "village-deliveryEnd": {
        label: "交付时间结束",
        type: "datePicker",
        submitConfig: {
            name: "deliveryTimeEnd",
            op: "le",
            validate: null
        }
    },

    "houseLa-name": {
        label: "户型名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "houseLa-village": {
        label: "楼盘名称",
        type: "text",
        submitConfig: {
            name: "villageName",
            op: "cn",
            validate: null
        }
    },
    "houseLa-layout": {
        label: "房型",
        type: "text",
        submitConfig: {
            name: "layout",
            op: "cn",
            validate: null
        }
    },
    "houseLa-area": {
        label: "面积",
        type: "select",
        submitConfig: {
            name: "area",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: "area",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "receiptType-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "receiptType-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: {},
            listPath: constant.data().receiptType.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "receiptType-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: {},
            listPath: constant.data().receiptType.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "receiptType-fund": {
        label: "资金类型",
        type: "select",
        submitConfig: {
            name: "fund",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.data().receiptType.fund.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "receiptType-grade": {
        label: "等级",
        type: "select",
        submitConfig: {
            name: "grade",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.data().receiptType.grade.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "receiptType-kino": {
        label: "金蝶编号",
        type: "text",
        submitConfig: {
            name: "kino",
            op: "cn",
            validate: null
        }
    },
    "receiptType-kiname": {
        label: "金蝶名称",
        type: "text",
        submitConfig: {
            name: "kiname",
            op: "cn",
            validate: null
        }
    },
    "receiptType-kibalance": {
        label: "结算方式",
        type: "text",
        submitConfig: {
            name: "kibalance",
            op: "cn",
            validate: null
        }
    },
    "receiptType-bankno": {
        label: "银行账号",
        type: "text",
        submitConfig: {
            name: "bankno",
            op: "cn",
            validate: null
        }
    },
    "receiptType-assistant": {
        label: "辅核项",
        type: "text",
        submitConfig: {
            name: "assistant",
            op: "cn",
            validate: null
        }
    },
    "receiptType-value": {
        label: "POS值",
        type: "text",
        submitConfig: {
            name: "value",
            op: "cn",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: {},
            listPath: constant.data().receiptType.fund.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "quotation-version-no": {
        label: "版本编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        }
    },
    "quotation-version-name": {
        label: "版本名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "quotation-version-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: null,
            listPath: constant.data().quotationVersion.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "quotation-functionArea-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "quotation-version": {
        label: "版本",
        type: "select",
        submitConfig: {
            name: "versionId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationVersion,
            postData: {},
            listPath: "quotationVersions",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "quotation-ctem-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "quotation-item-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "quotation-item-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "quotationTypeId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationType,
            postData: {},
            listPath: "quotationTypes",
            keyPath: "id",
            valuePath: "name"
        }
    },
    "quotation-item-classification": {
        label: "分类",
        type: "select",
        submitConfig: {
            name: "quotationClassificationId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationClassification,
            postData: {},
            listPath: "quotationClassifications",
            keyPath: "id",
            valuePath: "name"
        }
    },
    "quotation-item-bigcategory": {
        label: "大类",
        type: "select",
        submitConfig: {
            name: "quotationBigCategoryId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationBigCategory,
            postData: {},
            listPath: "quotationBigCategorys",
            keyPath: "id",
            valuePath: "name"
        }
    },
    "quotation-item-smallcategory": {
        label: "小类",
        type: "select",
        submitConfig: {
            name: "quotationSmallCategoryId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationSmallCategory,
            postData: {},
            listPath: "quotationSmallCategorys",
            keyPath: "id",
            valuePath: "name"
        }
    },
    "quotation-item-busi": {
        label: "业务",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().quotationItem.type.datas.slice(0, 5),
            keyPath: "key",
            valuePath: "value"
        }
    },
    "quotation-price-createTime": {
        label: "创建时间",
        type: "select",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "quotation-normadd-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "quotation-normadd-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "Status",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "quotation-normpack-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "quotation-normpack-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "Status",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "model-no": {
        label: "型号",
        type: "text",
        submitConfig: {
            name: "materialModelNo",
            op: "cn",
            validate: null
        }
    },
    "model-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "materialModelName",
            op: "cn",
            validate: null
        }
    },
    "model-category": {
        label: "品类",
        type: "select",
        submitConfig: {
            name: "materialTypeId",
            op: "cn",
            validate: null
        },
        dataSource: {
            url: api.data.queryCategory,
            postData: {},
            listPath: "categorys",
            keyPath: "cid",
            valuePath: "name"
        }
    },
    "model-brand": {
        label: "品牌",// 中文名
        type: "autofill",// 类型
        submitConfig: {// 向后台提交的配置
            name: "materialBrandName",// 接口中的参数名
            op: "eq",// 查询方式
            validate: null
        // 校验规则
        },
        dataSource: { // 从后台取数据的各种配置
            url: api.data.queryBrandByPinyin, // 获取数据要调用的接口
            query: "brand.pinyin",
            postData: {}, // 获取数据时的请求参数
            listPath: "brands", // 响应list的json路径
            keyPath: "name", // 用来向后台提交的字段的json路径
            valuePath: "name" // 用来在页面显示的字段的json路径
        }
    },
    "model-righter": {
        label: "姓名",
        type: "autofill",
        submitConfig: {
            name: "userId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 0,
                "departmentType.name": "主材部"
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "goods-no": {
        label: "商品编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "cn",
            validate: null
        }
    },
    "goods-name": {
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "goods-name-one": {
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "goods-barcode": {
        label: "条形码",
        type: "text",
        submitConfig: {
            name: "barcode",
            op: "cn",
            validate: null
        }
    },
    "goods-gid": {
        label: "商品ID",
        type: "text",
        submitConfig: {
            name: "gid",
            op: "cn",
            validate: null
        }
    },
    "goods-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.ds.manifest,
            postData: {},
            listPath: "statusType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "brand-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "brand-category": {
        label: "品类",
        type: "select",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.data.queryCategory,
            postData: {},
            listPath: "categorys",
            keyPath: "cid",
            valuePath: "name"
        }
    },
    "brand-atttype": {
        label: "业务类型",
        type: "select",
        submitConfig: {
            name: "atttype",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "0",
                value: "内销"
            }, {
                key: "1",
                value: "外销"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "brandPool-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "category-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "category-isCoupon": {
        label: "券标识",
        type: "select",
        submitConfig: {
            name: "isCoupon",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "0",
                value: "优惠"
            }, {
                key: "1",
                value: "标准"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "category-isCount": {
        label: "统计标识 ",
        type: "select",
        submitConfig: {
            name: "isCount",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "0",
                value: "统计"
            }, {
                key: "1",
                value: "标准"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "goods-brand-name": {
        label: "商品品牌",
        type: "text",
        submitConfig: {
            name: "brand",
            op: "cn",
            validate: null
        }
    },
    "accessoriesType-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.data().accessoriesType.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "aoods-name": {
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "goods.name",
            op: "cn",
            validate: null
        }
    },
    "aoods-type": {
        label: "分类辅类",
        type: "text",
        submitConfig: {
            name: "accessoriesType.name",
            op: "cn",
            validate: null
        }
    },
    "aoods-type-sort": {
        label: "排序辅类",
        type: "text",
        submitConfig: {
            name: "sortType.name",
            op: "cn",
            validate: null
        }
    },
    "aoods-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "0",
                value: "启用"
            }, {
                key: "1",
                value: "禁用"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "aoods-bompany": {
        label: "归属公司",
        type: "select",
        submitConfig: {
            name: "bompany",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.system.queryCompany,
            postData: {},
            listPath: "companys",
            keyPath: "cid",
            valuePath: "name"
        }
    },

    "aoods-atttype": {
        label: "归属类型",
        type: "select",
        submitConfig: {
            name: "atttype",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "0",
                value: "标准"
            }, {
                key: "1",
                value: "外辅"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    "soods-name": {
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "goods.name",
            op: "cn",
            validate: null
        }
    },
    "soods-quotation-item-name": {
        label: "报价名称",
        type: "text",
        submitConfig: {
            name: "quotationItem.name",
            op: "cn",
            validate: null
        }
    },
    "soods-quotation-version": {
        label: "报价版本",
        type: "select",
        submitConfig: {
            name: "quotationItem.quotationVersion.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationVersion,
            postData: {},
            listPath: "quotationVersions",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "soods-category": {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "goods.category",
            op: "cn",
            validate: null
        },
    },
    "soods-brand": {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "goods.brand",
            op: "cn",
            validate: null
        },
    },
    "soods-quotation-smallcategory": {
        label: "小类",
        type: "select",
        submitConfig: {
            name: "quotationSmallCategory.id",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationSmallCategory,
            postData: {},
            listPath: "quotationSmallCategorys",
            keyPath: "id",
            valuePath: "name"
        }
    },
    "soods-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "status",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "noods-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },

    "storehouse-no": {
        label: "库房编号",
        type: "text",
        submitConfig: {
            name: "code",
            op: "cn",
            validate: null
        }
    },

    "storehouse-name": {
        label: "仓库名",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "storehouse-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: null,
            listPath: "status",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "storehouse-righter": {
        label: "姓名",
        type: "autofill",
        submitConfig: {
            name: "userId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "manifest-template-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },

    "drawline-group-name": {
        label: "放线小组",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "construction-node-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "construction-node-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: null,
            listPath: "status",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "construction-cost-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },

    "task-name": {
        label: "任务名称",
        type: "text",
        submitConfig: {
            name: "taskName",
            op: "eq",
            validate: null
        }
    },

    "task-isShow": {
        label: "显示",
        type: "select",
        submitConfig: {
            name: "taskIsShow",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "taskIsShow",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "task-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "taskStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "taskStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "task-level": {
        label: "等级",
        type: "select",
        submitConfig: {
            name: "taskLevel",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "taskLevel",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "chart-no": {
        label: "编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        }
    },
    "chart-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "chart-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "chartType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "chart-level": {
        label: "等级",
        type: "select",
        submitConfig: {
            name: "level",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "chartLevel",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "contract-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "contract-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "contractStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "contract-atttype": {
        label: "业务类型",
        type: "select",
        submitConfig: {
            name: "atttype",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().contract.atttype.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "signet-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "signet-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "signetStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "signet-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.ds.data,
            postData: {},
            listPath: "signetType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "talking-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "talking-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "talkingType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "talking-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "talkingStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "taskParam-module": {
        label: "模块",
        type: "select",
        submitConfig: {
            name: "module",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: null,
            listPath: [{
                key: "decoration",
                value: "装修"
            }, {
                key: "payment",
                value: "款项"
            }, {
                key: "sales",
                value: "销售"
            }, {
                key: "inventory",
                value: "仓储"
            }, {
                key: "construction",
                value: "工程"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "chating-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "chatingType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "paymentType-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "paymentType-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().paymentType.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "paymentType-paytype": {
        label: "付款类型",
        type: "select",
        submitConfig: {
            name: "paytype",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().paymentType.paytype.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "paymentType-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().paymentType.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "custype-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "custype-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().custype.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "custype-no": {
        label: "商户号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "cn",
            validate: null
        }
    },
    "custype-agent": {
        label: "机构号",
        type: "text",
        submitConfig: {
            name: "agent",
            op: "cn",
            validate: null
        }
    },
    "custype-phone": {
        label: "手机号",
        type: "text",
        submitConfig: {
            name: "phone",
            op: "cn",
            validate: null
        }
    },
    "custype-wxapp": {
        label: "小程序appid",
        type: "text",
        submitConfig: {
            name: "wxapp",
            op: "cn",
            validate: null
        }
    },
    "custype-atttype": {
        label: "业务类型",
        type: "select",
        submitConfig: {
            name: "atttype",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.payment().receipt.paymentType.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "custype-dgrade": {
        label: "装修等级",
        type: "select",
        submitConfig: {
            name: "dgrade",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().custype.dgrade.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "custype-sgrade": {
        label: "销售等级",
        type: "select",
        submitConfig: {
            name: "sgrade",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().custype.sgrade.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "custype-platform": {
        label: "支付平台",
        type: "select",
        submitConfig: {
            name: "platform",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().custype.platform.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "constant-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },

    "decoration-matching-name": {
        label: "类型名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },

    "decoration-matching-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "decoration-matching-typeness": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "typeness",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryDecorationAtttype,
            postData: {},
            listPath: "decorationAtttypes",
            keyPath: "key",
            valuePath: "name"
        }
    },

    "decoration-matching-isShow": {
        label: "显示",
        type: "select",
        submitConfig: {
            name: "isShow",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().decorationMatching.isShow.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "decoration-busitype-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: null,
            listPath: "status",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "decoration-busitype-name": {
        label: "类型名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },

    "decoration-busitype-alias": {
        label: "上级",
        type: "text",
        submitConfig: {
            name: "alias",
            op: "cn",
            validate: null
        }
    },

    "decoration-busitype-outside": {
        label: "三方标识",
        type: "select",
        submitConfig: {
            name: "outside",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.data().decorationBusitype.outside.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "decoration-busitype-isRefer": {
        label: "推荐标识",
        type: "select",
        submitConfig: {
            name: "isRefer",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.data().decorationBusitype.isRefer.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "decoration-busitype-isAward": {
        label: "奖励标识",
        type: "select",
        submitConfig: {
            name: "isAward",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.data().decorationBusitype.isAward.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "decoration-busitype-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.data().decorationBusitype.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "constant-module": {
        label: "模块",
        type: "text",
        submitConfig: {
            name: "module",
            op: "cn",
            validate: null
        }
    },
    "constant-field": {
        label: "字段",
        type: "text",
        submitConfig: {
            name: "field",
            op: "cn",
            validate: null
        }
    },
    "constant-key": {
        label: "键",
        type: "text",
        submitConfig: {
            name: "key",
            op: "cn",
            validate: null
        }
    },
    "surveyTemplate-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "surveyTemplate-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: null,
            listPath: "surveyTemplateStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "assistance-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "normood-quotationItem": {
        label: "报价项",
        type: "text",
        submitConfig: {
            name: "quotationItem.name",
            op: "eq",
            validate: null
        }
    },

    "normood-quotation-version": {
        label: "报价版本",
        type: "select",
        submitConfig: {
            name: "quotationItem.quotationVersion.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationVersion,
            postData: {},
            listPath: "quotationVersions",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "normood-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "normood-no": {
        label: "编号",
        type: "text",
        submitConfig: {
            name: "quotationItem.no",
            op: "eq",
            validate: null
        }
    },
    "normood-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().normood.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "normrice-quotationItem": {
        label: "报价项",
        type: "text",
        submitConfig: {
            name: "quotationItem.name",
            op: "eq",
            validate: null
        }
    },

    "normrice-quotation-version": {
        label: "报价版本",
        type: "select",
        submitConfig: {
            name: "quotationItem.quotationVersion.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationVersion,
            postData: {},
            listPath: "quotationVersions",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "normrice-constructionNode": {
        label: "施工节点",
        type: "text",
        submitConfig: {
            name: "constructionNode.name",
            op: "eq",
            validate: null
        }
    },
    "normrice-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().normood.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "constructionPace-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "constructionPace-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().constructionPaceNode.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "bankAccount-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "bankAccount-bankNo": {
        label: "卡号",
        type: "text",
        submitConfig: {
            name: "bankNo",
            op: "eq",
            validate: null
        }
    },
    "bankAccount-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().bankAccount.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "construction-period-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },

    "goodsKind-no": {
        label: "编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        }
    },

    "goodsKind-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "goodsKind-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.data().goodsKind.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "inspect-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "inspect-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.data().inspect.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "goodsRecord-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.data().goodsRecord.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "goodsRecord-operator": {
        label: "操作人",
        type: "autofill",
        submitConfig: {
            name: "operator.userId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":"0" },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "goodsRecord-operateTime": {
        label: "操作时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "operateTime",
            op: "between",
            validate: null
        }
    },

    "normtime-quotationItem": {
        label: "报价项",
        type: "text",
        submitConfig: {
            name: "quotationItem.name",
            op: "eq",
            validate: null
        }
    },

    "normtime-quotation-version": {
        label: "报价版本",
        type: "select",
        submitConfig: {
            name: "quotationItem.quotationVersion.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationVersion,
            postData: {},
            listPath: "quotationVersions",
            keyPath: "no",
            valuePath: "name"
        }
    },

    "normtime-constructionNode": {
        label: "施工节点",
        type: "text",
        submitConfig: {
            name: "constructionNode.name",
            op: "eq",
            validate: null
        }
    },

    "normtime-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().normtime.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    }
});
