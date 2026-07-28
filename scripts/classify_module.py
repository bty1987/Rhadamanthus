# -*- coding: utf-8 -*-
"""
为 communion.operation 全量数据推断 moduleId (一级模块)。
策略: operation 字段是 camelCase 方法名, 含业务实体关键词。
      按一级模块(34个)逐一匹配关键词, 优先级 = 列表顺序(更具体的优先)。

输出:
  - operation_module_map.tsv: oid -> moduleId (含 operation 便于核对)
  - 未匹配的 operation 列表(打印到 stdout)
"""
import io
import re
import sys

TSV = r"D:\ERP\Rhadamanthus\scripts\operation_dump.tsv"
OUT = r"D:\ERP\Rhadamanthus\scripts\operation_module_map.tsv"

# 一级模块 mid -> 名称 (来自 communion.module level=1)
# 仅保留有业务语义的; 部分纯导航模块(首页/业务/设计/监理)暂不分配 operation
# 规则表: (mid, 名称, [关键词...])  -- 关键词按 operation 字段中可能出现的 token
# 顺序敏感: 更具体/更窄的模块放前面, 先匹配先生效
RULES = [
    # ---- 通用/系统类 (mid=1 系统) 放最后兜底, 这里先排具体业务模块 ----

    # 营销 (mid=338 营销, system=1) -- 营销案例/人员/口碑/会员/购物车/评价/砍价
    #   ★ 已吸收原 system=2 的: 大活动(380)/领券(379) 关键词
    #   大活动 = Vactivity/Vaward/Vprize/Vscore/Vticket/Vpayment/Vcustomer (VIP活动体系)
    #   领券 = Coupon/MuserCoupon (卡券体系)
    (338, "营销", ["Ecase", "Eperson", "Eopinions", "Ecity", "Epicture",
                   "Cnotice", "CardPhoto", "Emember", "Member", "Muser",
                   "Slide", "Background", "Macontrol",
                   "Cart", "Evaluate", "Behead", "behead",
                   "Vactivity", "Vaward", "Vprize", "Vscore", "Vticket",
                   "Vpayment", "Vcustomer",
                   "AwardStock", "AwardPurchase", "AwardRecord",
                   "Coupon"]),

    # 注: 招聘/供应商关键词已分别并入下方 mid=4(人事)/mid=227(主材) 的规则条目
    #     原 system=2 的 672(招聘)/524(厂商)/380(大活动)/379(领券) 不再单独使用

    # 薪资 (mid=134) -- WorkerSalary 工人工费, Salary 薪资
    (134, "薪资", ["WorkerSalary", "SalaryDrawing", "Salary"]),

    # 生产 (mid=194) -- Production 生产
    (194, "生产", ["Production"]),

    # 仓储/货单 (mid=203) -- Manifest 货单, Storehouse 仓库, Inventory 库存图纸,
    #                        Purchase 采购
    (203, "仓储", ["Manifest", "Storehouse", "InventoryDrawing",
                   "GoodsStorehouseStock", "Purchase", "pagePurchase"]),

    # 会计 (mid=103) -- Voucher 凭证, Subject 科目, AccountBook 账本
    #    注意: 不含 AccountItem, 因 DecorationAccountItem(装修决算项)/SalesAccount 等属业务模块
    (103, "会计", ["Voucher", "Subject", "AccountBook"]),

    # 国补 (mid=861)
    (861, "国补", ["Subsidy"]),

    # 结算 (mid=457) -- Balance 结算类 (BalanceSales/BalanceSelection/BalanceCutpay 等)
    #    注意: 结算模块涵盖 销售/选材/装修 的结算对账动作
    (457, "结算", ["Balance"]),

    # 款项 (mid=10) -- Payment/AdvancePayment/ProxyPayment/Paytran/Withhold/PaymentScale
    #    通用付款/预付款/代付款/转换款/代扣/付款比例/服务款(ServicePayment)/收据(Receipt)
    #    注意: 装修款/主材款/销售款不在此, 归各自模块; 服务款属通用款项
    (10, "款项", ["Paytran", "ProxyPayment", "Withhold", "PaymentScale",
                  "PaymentContract", "PaymentType", "PaymentConfig",
                  "PaymentPlatform", "PaymentFunctionRight",
                  "AdvancePayment", "PaymentByPaymentId", "PaymentByPid",
                  "PaymentByOrderId", "collectPayment", "confirmPayment",
                  "sendPayment", "addPayment", "updatePayment", "withdrawPayment",
                  "pollingPaymentContract", "redirectPaymentContract",
                  "ServicePayment", "ServiceReceipt", "makeServicePayment",
                  "Receipt", "CusAdvance", "CusPayment", "CusServicePayment",
                  "countCusServicePaymentForAmount", "pagePayment",
                  "queryServer", "pospay"]),

    # 信息 (mid=7) -- Notice 公告, Plan 计划, Message 消息, PhoneCall 电话,
    #                 Feedback 反馈, Talking 沟通, Survey 调研, Event 事件,
    #                 Worksheet 工单, Information
    (7, "信息", ["Notice", "Plan", "Message", "PhoneCall", "PhoneAuthCode",
                 "Feedback", "FeedbackRecord", "FeedbackDrawing",
                 "Talking", "Survey", "SurveyTemplate",
                 "Event", "Worksheet", "Information", "pageMessage",
                 "countMessage", "updateMessageForRead", "sendMessage"]),

    # 日志 (mid=8) -- Log
    (8, "日志", ["Log"]),

    # 报表 (mid=9) -- Report/Chart/ChainPage 链路页面
    (9, "报表", ["Report", "Chart", "ChainPage"]),

    # 审批 (mid=2) -- Approval/Approver
    (2, "审批", ["Approval", "Approver"]),

    # 报价 (mid=316) -- Quotation/Quotetion(历史)/Protation(利润测算)/
    #                    Normtion/Normrice/Normood/Normtime/Normadd/Normpack(定额体系)/
    #                    Cormrice(工费配比)/Presign(预签)/FunctionArea(功能区)/
    #                    QuotationNamingRule/AddReduce 增减单/Extension 扩展项/
    #                    Qeasure 量房
    #    注意: AddReduce(增减单) 和 Extension(扩展) 属报价域, 必须在工程/装修前匹配
    (316, "报价", ["Quotation", "Quotetion", "Protation", "Normtion", "Normrice",
                   "Normood", "Normtime", "Normadd", "Normpack",
                   "Cormrice", "Presign", "FunctionArea",
                   "QuotationNamingRule", "QuotationFunctionRight",
                   "QuotationProfile", "QuotationAssign", "autoQuotationAssign",
                   "AddReduce", "Extension", "Qeasure"]),

    # 工程/施工 (mid=237) -- Construction 施工, DrawLine 放线, Process 工序,
    #                         Acceptance 验收, Accessory/Occessories 辅料,
    #                         Aoods 辅材, Constructer 工人, Qualiter 质检员
    #    注意: Accessories(辅材)/Accessory 必须在装修前匹配(辅料属工程域)
    (237, "工程", ["Construction", "DrawLine", "DrawlineGroup", "Process",
                   "Acceptance", "Accessory", "Accessories", "Occessories",
                   "Aoods", "Constructer", "Qualiter", "Pace",
                   "PaceNode", "Flowpath", "Kaoods"]),

    # 主材 (mid=227) -- Material 主材, Mpayment/Morder/Mbrand/Mcategory/
    #                    Mcolor/Mformat/Mgoods/Mprice 主材相关,
    #                    Soods 选材/主材销售项, Selection 选材, Noods 辅料定义,
    #                    Goods 商品, Price 价格, Color 颜色, Format 规格,
    #                    GoodsKind 商品类别, Category 分类
    #    说明: Soods(选材)/Selection(选材)/Noods(辅料定义)/Goods/Price/Color/Format
    #          在方林体系里属于"主材"域(商品池+选材+主材销售)
    #          Supplier/SupplierContract/SupplierSignet/BrandSupplier 供应商
    #          (原system=2的524厂商, 供应商主要服务于主材采购/选材/辅材)
    (227, "主材", ["Material", "Mpayment", "Morder", "Mbrand", "Mcategory",
                   "Mcolor", "Mformat", "Mgoods", "Mprice",
                   "Soods", "Selection", "Noods",
                   "Goods", "Price", "Color", "Format",
                   "GoodsKind", "GoodsPool", "GoodsRecord",
                   "Category", "NormtimeItem",
                   "Supplier", "SupplierContract", "SupplierSignet",
                   "BrandSupplier"]),

    # 销售 (mid=204) -- Sales 销售, Oales 销售单, SalesActivity 销售活动,
    #                    SalesDelivery 销售发货, SalesRefunds 销售退货,
    #                    SalesBalance 销售结算(注意: 结算在457, 但销售结算动作归销售更贴切?
    #                    -- 见下方调整: SalesBalance 归结算457)
    (204, "销售", ["Sales", "Oales", "SalesActivity", "SalesDelivery",
                   "SalesRefunds", "SalesItem", "SalesPicture",
                   "SalesProfile", "SalesRecord", "SalesFunctionRight"]),

    # 房产 (mid=228) -- House 房产, Village 楼盘, HouseLayout 户型,
    #                    BuildingNameRule, VillageRule
    (228, "房产", ["House", "Village", "HouseLayout", "BuildingNameRule",
                   "VillageRule"]),

    # 客户 (mid=240) -- Customer 客户, CustomerChance 客户机会,
    #                    CustomerOrigin 客源, CustomerSource 客户来源,
    #                    CustomerProfile 客户档案, CustomerPhone 客户电话,
    #                    CustomerAccount 客户账户, CustomerRecord 客户记录,
    #                    CustomerDeptRule, CustomerCompanyRule, CustomerUserRule,
    #                    CustomerLead 客户线索, CustomerProtectRule,
    #                    Custype 客户类型, Cuser 客户(对外), Cnotice,
    #                    Vustomer VIP客户
    #    注意: CustomerOrigin/Source/Lead/Chance 虽然有独立"客源"模块(378),
    #          但 operation 维度归"客户"更合适(378是导航菜单)
    (240, "客户", ["Customer", "Custype", "Cuser", "Vustomer",
                   "CustomerLead"]),

    # 客源 (mid=378) -- 纯客源菜单 (与客户240重叠, 这里仅保留无Customer前缀的客源token)
    #    实际上客源类都带Customer前缀, 已归240, 此处空占位, 留给人工再分
    # (378, "客源", []),

    # 装修 (mid=6) -- Decoration 装修 (最宽泛, 放靠后)
    #    涵盖装修单/装修合同/装修款/装修活动/装修决算/装修结算/装修人员/装修图片/
    #    装修满减(Holonomy)/装修匹配/装修半包(Midpack)/装修包干(Inclusive)/
    #    DecoraionReceipt (拼写错误, 装修款收据) 等
    (6, "装修", ["Decoration", "Decoraion"]),

    # 数据 (mid=5) -- 通用基础数据: Department 部门, Duty/Dutment 职务,
    #                  City/CityProper/Region 城市, Company 公司,
    #                  Role 角色, Organization 组织, Contract 合同(通用, 不含装修/人员合同),
    #                  DataDrawing 数据图纸, Signet 印章, Brand 品牌,
    #                  BrandInstorer 品牌入驻商, BrandUserRight,
    #                  Constant 常量, SystemConfig 系统配置, SystemDefineItem,
    #                  MeasurementUnit 计量单位, WorkType 工种,
    #                  Holiday 节假日, Activity 活动(通用), ActivityItem,
    #                  ReceiptType 收据类型, Task 任务, TaskParam,
    #                  Event 事件(通用), Module 模块, Operation 操作,
    #                  RoleModule, UserRole, RoleAction, Version 版本,
    #                  Upgrade 升级, Assistance 协助, DepartmentType, DepartmentPartner,
    #                  UserDepartment, CusContract 客户合同(通用)
    #    注意: 纯 Contract (addContract/pageContract/countContract/updateContract/
    #          updateContractForStatus) 是通用合同, 归此; DecorationContract/UserContract
    #          已被前面模块匹配
    (5, "数据", ["Department", "Duty", "Dutment", "City", "CityProper",
                 "Region", "Company", "Role", "Organization",
                 "DataDrawing", "Signet", "Brand", "BrandInstorer",
                 "BrandUserRight", "Constant", "SystemConfig", "SystemDefineItem",
                 "MeasurementUnit", "WorkType", "Holiday",
                 "Activity", "ActivityItem", "ReceiptType",
                 "Task", "TaskParam", "Module", "Operation",
                 "RoleModule", "UserRole", "RoleAction", "Version",
                 "Upgrade", "Assistance", "AssistanceItem",
                 "DepartmentType", "DepartmentPartner", "UserDepartment",
                 "pageActivity", "updateActivity", "addActivity",
                 "queryActivity", "CusContract",
                 "Contract", "addContract", "pageContract", "countContract",
                 "updateContract", "updateContractForStatus"]),

    # 人事 (mid=4) -- User 人员, UserInfo, UserEducation, UserExperience,
    #                  UserContract 人员合同, UserPrefer, UserFunction,
    #                  UserOperation, UserCompany, DingTalk 钉钉同步,
    #                  LoginInfo 登录信息, UserPartner,
    #                  Recruitment 招聘(原system=2的672, 招聘是人事核心子功能)
    (4, "人事", ["User", "DingTalk", "LoginInfo", "UserContract",
                 "UserPartner", "UserEducation", "UserExperience",
                 "UserOperation", "UserFunction", "UserCompany",
                 "UserInfo", "UserPrefer", "UserDept",
                 "Recruitment",
                 "registUser", "authUser", "confirmUser", "quitUser",
                 "tranUser", "addUser", "updateUser", "queryUser",
                 "pageUser", "signUserContract", "affixUserContract",
                 "filingUserContract", "viewUserContract", "expireUserContract",
                 "redirectUserContract", "signateUser", "updateUserForBaseInfo",
                 "updateUserForAdvance", "updateUserPrefer"]),

    # 系统 (mid=1) -- 兜底: 登录/认证/回调/上传/通用授权码/二维码/心跳/事件/会话/
    #                  通用权限同步(syncRoleModule/syncDecorationRight等) /
    #                  AuthCode 授权码, Conversation 会话, Droup/Group 分组,
    #                  Address 地址, Circle 动态, Event 事件(社交),
    #                  Picture/Photo 通用图片, Event 事件, Login 登录,
    #                  Callback 回调, VerifyCode 验证码, WmCode, QRCode,
    #                  ping 心跳, current 当前用户, defaultPassword, resetPassword,
    #                  changePassword, checkLicense, existPlan, vodeCusDecoration,
    #                  syncVillageData, syncUser, syncDuty, syncDepartment,
    #                  systemConfig, queryConstant(常量归5), ReceiptType(归5),
    #                  占位码/废弃码, 电话拨打, 轮询签名
    (1, "系统", ["AuthCode", "Conversation", "Chating", "Droup",
                 "Address", "Circle", "Event", "Login", "Logout",
                 "Callback", "VerifyCode", "Vode", "WmCode", "wmCode", "QRCode",
                 "ping", "current", "Password",
                 "checkLicense", "uploadFile", "Group",
                 "Picture", "Photo", "Slide", "Background",
                 "vodeCusDecoration", "checkoverCustomerLead",
                 "syncRoleModule", "syncDecorationRight", "syncDecorationFunctionRight",
                 "syncVillageData", "syncUser", "syncDuty", "syncDepartment",
                 "updateMonitor", "queryMonitor", "queryEvent",
                 "deleteEvent", "addEvent", "requestDDConfig",
                 "requestLoginChallenge", "requestConversation",
                 "responseConversation", "saveMuser", "bindingCusDecoration",
                 "affixDecorationContract", "Kingdee", "makeMemberOrder",
                 "makeMemberOrderItem", "updateMemberGoods", "queryMemberPoint",
                 "queryMemberForInfo", "cancelMemberOrder", "addMemberActivity",
                 "queryMemberByPhone", "Behead", "requestAuthCode",
                 "exchangeAuthCode", "socialAuthCode", "stateAuthCode",
                 "logoutAuthCode", "phoneAuthCode", "checkMacontrol",
                 "doLogin", "verifyCode", "codepay", "alipay", "wxpay",
                 "yspayCallback", "dingTalkCallback",
                 "fadadaCallback", "divisionCallback", "callbackPostar",
                 "callbackSwiftpass", "publishErpEvent", "registAuthCode",
                 "addKingdeeRecord", "pageKingdeeRecord",
                 "QWQMVERQMVTYU", "phoneCall", "pollingSignature",
                 "logout"]),
]


def classify(operation):
    """返回 (mid, name) 或 (None, None)。按 RULES 顺序, 第一个匹配即返回。"""
    if not operation:
        return None, None
    for mid, mname, keywords in RULES:
        for kw in keywords:
            # 用大小写敏感的子串匹配 (camelCase token)
            if kw in operation:
                return mid, mname
    return None, None


def main():
    rows = []
    with io.open(TSV, encoding="utf-8") as fh:
        header = fh.readline()
        for line in fh:
            line = line.rstrip("\n")
            if not line:
                continue
            parts = line.split("\t")
            if len(parts) < 4:
                continue
            oid, mid_old, name, op = parts[0], parts[1], parts[2], parts[3]
            rows.append((oid, mid_old, name, op))

    unmapped = []
    counts = {}
    with io.open(OUT, "w", encoding="utf-8", newline="") as out:
        out.write("oid\tmoduleId\tmoduleName\toperation\tname\n")
        for oid, mid_old, name, op in rows:
            mid, mname = classify(op)
            if mid is None:
                unmapped.append((oid, name, op))
                out.write("%s\t\t\t%s\t%s\n" % (oid, op, name))
            else:
                counts[mid] = counts.get(mid, 0) + 1
                out.write("%s\t%d\t%s\t%s\t%s\n" % (oid, mid, mname, op, name))

    print("=== mapping distribution (moduleId -> count) ===")
    for mid in sorted(counts):
        # 找模块名
        mname = next((n for m, n, _ in RULES if m == mid), "?")
        print("  mid=%-4d %-6s %d" % (mid, mname, counts[mid]))
    print("  TOTAL mapped: %d" % sum(counts.values()))
    print("\n=== UNMAPPED (%d) ===" % len(unmapped))
    for oid, name, op in unmapped:
        print("  oid=%s  op=%s  name=%s" % (oid, op, name))


if __name__ == "__main__":
    main()
