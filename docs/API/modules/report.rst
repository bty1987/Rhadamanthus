
.. _report:

***************
报表
***************

装修业绩排名
================

.. class:: api.report.DecorationRankAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: decorationRank
    
    :param drid: ID
    :type drid: Integer
    :param designer: 设计师 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type designer: Object
    :param depte: 部门 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type depte: Object
    :param region: 分区 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type region: Object
    :param month: 月份 , 格式 yyyymm
    :type month: Integer
    :param rank: 计算值
    :type rank: Integer
    :param type: 类型 , 0: 设计 , 1: 业务
    :type type: Short
    :param status: 状态 , 包括: 0: 初始 , 1: 失效
    :type status: Short
    :param company: 公司
    :type company: Integer
    
    .. data:: decorationDepartmentRank
    
    :param ddrid: ID
    :type ddrid: Integer
    :param depte: 部门 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type depte: Object
    :param region: 分区 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type region: Object
    :param month: 月份 , 格式 yyyymm
    :type month: Integer
    :param rank: 计算值
    :type rank: Integer
    :param type: 类型 , 0: 设计 , 1: 业务
    :type type: Short
    :param status: 状态 , 包括: 0: 初始 , 1: 失效
    :type status: Short
    :param company: 公司
    :type company: Integer
    
    .. data:: decorationRegionRank
    
    :param drrid: ID
    :type drrid: Integer
    :param region: 分区 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type region: Object
    :param month: 月份 , 格式 yyyymm
    :type month: Integer
    :param rank: 计算值
    :type rank: Integer
    :param type: 类型 , 0: 设计 , 1: 业务
    :type type: Short
    :param status: 状态 , 包括: 0: 初始 , 1: 失效
    :type status: Short
    :param company: 公司
    :type company: Integer

    .. method:: <I> queryDecorationRank
    
        装修业绩排名信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param decorationRank.type: 类型
        :type decorationRank.type: Short
        
        Example::
        
            {
                "decorationRank.type": 0
            }

        +--------+
        |Returns:|
        +--------+
		
        :param ranks: 排名信息列表 , 每条数据类型 :data:`decorationRank`
        :type ranks: List
		
        Example::
        
            {
                ...
                "ranks": [
                    {
                        "drid": 1,
                        "region": {
                            "did": 2,
                            "no": "D002",
                            "name": "设计一分区",
                            "type": "设计大区",
                        },
                        "depte": {
                            "did": 1,
                            "no": "D001",
                            "name": "设计一部",
                            "type": "设计部",
                        },
                        "designer": {
                           "uid": 1,
                           "userName": "白雪",
                           "currentName": "白雪",
                           "duty": "设计师"
                        },
                        "month": 202306,
                        "rank": 21293,
                        "status": 0,
                        "company": 1
                    }
                ],
                ...
            }
			
	.. method:: <I> queryDecorationDepartmentRank
    
        部门装修业绩排名信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param decorationDepartmentRank.type: 类型
        :type decorationDepartmentRank.type: Short
        
        Example::
        
            {
                "decorationDepartmentRank.type": 0
            }

        +--------+
        |Returns:|
        +--------+
		
        :param ranks: 排名信息列表 , 每条数据类型 :data:`decorationDepartmentRank`
        :type ranks: List
		
        Example::
        
            {
                ...
                "ranks": [
                    {
                    
                        "ddrid": 1,
                        "depte": {
                            "did": 1,
                            "no": "D001",
                            "name": "设计一部",
                            "type": "设计部",
                        },
                        "month": 202306,
                        "rank": 21293,
                        "status": 0,
                        "company": 1
                    }
                ],
                ...
            }	
			
	.. method:: <I> queryDecorationRegionRank

        设计分区装修业绩排名信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param decorationRegionRank.type: 类型
        :type decorationRegionRank.type: Short
        
        Example::
        
            {
                "decorationRegionRank.type": 0
            }
		
        +--------+
        |Returns:|
        +--------+
		
        :param ranks: 排名信息列表 , 每条数据类型 :data:`decorationRegionRank`
        :type ranks: List
		
        Example::
        
            {
                ...
                "ranks": [
                    {
                        "drrid": 1,
                        "region": {
                            "did": 2,
                            "no": "D002",
                            "name": "设计一分区",
                            "type": "设计大区",
                        },
                        "month": 202306,
                        "rank": 21293,
                        "status": 0,
                        "company": 1
                    }
                ],
                ...
            }
            
主材业绩排名
================

.. class:: api.report.MaterialRankAction

    .. data:: materialDesignerRank
    
    :param mdrId: ID
    :type mdrId: Integer
    :param designerId: 设计师编号
    :type designerId: String
    :param designerName: 设计师名
    :type designerName: String
    :param createTime: 开始时间
    :type createTime: String
    :param endTime: 结束时间
    :type endTime: String
    :param rank: 计算值
    :type rank: Double
    :param status: 状态 , 包括: 0: 初始 , 1: 失效
    :type status: Short
    
    .. data:: materialDesignerDepartmentRank
    
    :param mddrid: ID
    :type mddrid: Integer
    :param designerDeptId: 设计部编号
    :type designerDeptId: String
    :param designerDeptName: 设计部名
    :type designerDeptName: String
    :param createTime: 开始时间
    :type createTime: String
    :param endTime: 结束时间
    :type endTime: String
    :param rank: 计算值
    :type rank: Double
    :param status: 状态 , 包括: 0: 初始 , 1: 失效
    :type status: Short
    
    .. data:: materialDesignerRegionRank
    
    :param mdrrid: ID
    :type mdrrid: Integer
    :param designerRegionId: 设计分区编号
    :type designerRegionId: String
    :param designerRegionName: 设计分区名
    :type designerRegionName: String
    :param createTime: 开始时间
    :type createTime: String
    :param endTime: 结束时间
    :type endTime: String
    :param rank: 计算值
    :type rank: Double
    :param status: 状态 , 包括: 0: 初始 , 1: 失效
    :type status: Short
         
    .. method:: <I> queryMaterialDesignerRank
    
        设计师主材业绩排名

        +--------+
        |Returns:|
        +--------+
		
        :param ranks: 排名信息列表 , 每条数据类型 :data:`materialDesignerRank`
        :type ranks: List
		
        Example::
        
            {
                ...
                "ranks": [
                    {
                        "mdrId": 1
                        "designerId": "FL-0001",
                        "designerName": "白雪",
                        "createTime": "2017-09-06",
                        "endTime": "2017-09-06",
                        "rank": 21293,
                        "status": 0
                    }
                ],
                ...
            }
			
	.. method:: <I> queryMaterialDesignerDepartmentRank
    
        设计部主材业绩排名

        +--------+
        |Returns:|
        +--------+
		
        :param ranks: 排名信息列表 , 每条数据类型 :data:`materialDesignerDepartmentRank`
        :type ranks: List
		
        Example::
        
            {
                ...
                "ranks": [
                    {
                    
                        "mddrId": 1
                        "designerDeptId": "FL_DD_01",
                        "designerDeptName": "设计一部",
                        "createTime": "2017-09-06",
                        "endTime": "2017-09-06",
                        "rank": 21293,
                        "status": 0
                    }
                ],
                ...
            }
			
	.. method:: <I> queryMaterialDesignerRegionRank
    
        设计分区主材业绩排名

        +--------+
        |Returns:|
        +--------+
		
        :param ranks: 排名信息列表 , 每条数据类型 :data:`materialDesignerRegionRank`
        :type ranks: List
		
        Example::
        
            {
                ...
                "ranks": [
                    {
                        "mdrrId": 1
                        "designerRegionId": "FL_DD_01",
                        "designerRegionName": "设计一分区",
                        "createTime": "2017-09-06",
                        "endTime": "2017-09-06",
                        "rank": 21293,
                        "status": 0
                    }
                ],
                ...
            }
			
	.. method:: <I> materialDesignerRank
    
        设计师主材业绩排名TOP10

        +--------+
        |Returns:|
        +--------+
        
        :param ranks: 排名信息列表 , 每条数据类型 :data:`materialDesignerRank`
        :type ranks: List
		
        Example::
        
            {
                ...
                "ranks": [
                    {
                        "mdrId": 1
                        "designerId": "FL-0001",
                        "designerName": "白雪",
                        "createTime": "2017-09-06",
                        "endTime": "2017-09-06",
                        "rank": 21293,
                        "status": 0
                    }
                ],
                ...
            }
			
	.. method:: <I> materialDesignerDepartmentRank
    
        设计主材业绩排名TOP10

        +--------+
        |Returns:|
        +--------+
        
        :param ranks: 排名信息列表 , 每条数据类型 :data:`materialDesignerDepartmentRank`
        :type ranks: List
		
        Example::
        
            {
                ...
                "ranks": [
                    {
                    
                        "mddrId": 1
                        "designerDeptId": "FL_DD_01",
                        "designerDeptName": "设计一部",
                        "createTime": "2017-09-06",
                        "endTime": "2017-09-06",
                        "rank": 21293,
                        "status": 0
                    }
                ],
                ...
            }
			
	.. method:: <I> materialDesignerRegionRank
    
        设计分区主材业绩排名TOP10

        +--------+
        |Returns:|
        +--------+
		
        :param ranks: 排名信息列表 , 每条数据类型 :data:`materialDesignerRegionRank`
        :type ranks: List
		
        Example::
        
            {
                ...
                "ranks": [
                    {
                        "mdrrId": 1
                        "designerRegionId": "FL_DD_01",
                        "designerRegionName": "设计一分区",
                        "createTime": "2017-09-06",
                        "endTime": "2017-09-06",
                        "rank": 21293,
                        "status": 0
                    }
                ],
                ...
            }
			
主材业绩统计
================

.. class:: api.report.MaterialReportAction

    .. data:: materialDepartmentCount
    
    :param mdcId: ID
    :type mdcId: Integer
    :param materialDeptId: 主材部编号
    :type materialDeptId: String
    :param createTime: 开始时间
    :type createTime: String
    :param total: 统计值
    :type total: Float
    
    .. data:: materialDesignerCount
    
    :param mdcId: ID
    :type mdcId: Integer
    :param designerId: 设计师编号
    :type designerId: String
    :param designerName: 设计师
    :type designerName: String
    :param designerDepartmentId: 设计部编号
    :type designerDepartmentId: String
    :param designerDepartmentName: 设计部名
    :type desingerDepartmentName: String
    :param designerRegionId: 设计分区编号
    :type designerRegionId: String
    :param designerRegionName: 设计分区名
    :type designerRegionName: String
    :param createTime: 开始时间
    :type createTime: String
    :param total: 统计值
    :type total: Float
    
    .. data:: materialDesignerDepartmentCount
    
    :param mddcId: ID
    :type mddcId: Integer
    :param designerDepartmentId: 设计部编号
    :type designerDepartmentId: String
    :param designerDepartmentName: 设计部名
    :type desingerDepartmentName: String
    :param designerRegionId: 设计分区编号
    :type designerRegionId: String
    :param designerRegionName: 设计分区名
    :type designerRegionName: String
    :param createTime: 开始时间
    :type createTime: String
    :param total: 统计值
    :type total: Float
    
    .. data:: materialDesignerRegionCount
    
    :param mdrcId: ID
    :type mdrcId: Integer
    :param designerRegionId: 设计分区编号
    :type designerRegionId: String
    :param designerRegionName: 设计分区名
    :type designerRegionName: String
    :param createTime: 开始时间
    :type createTime: String
    :param total: 统计值
    :type total: Float

    .. method:: <I> materialDepartmentReport
    
        查询全部主材部门业绩统计信息		
        
        +--------+
        |Returns:|
        +--------+
		
        :param ranks: 排名信息列表 , 每条数据类型 :data:`materialDepartmentCount`
        :type ranks: List
		
        Example::
        
            {
                ...
                "materialDepartmentCounts": [
                    {
                        "mdcId": 1,
                        "materialDept": "FL_MD_01",
						"createTime":"2015-03-11",
						"total": 283736
                    }
                ],
                ...
            }
			
	.. method:: <I> designerReport
    
        设计师主材业绩统计信息

        +---------+
        |Requests:|
        +---------+
        
        :param reportType: 报表类型
        :type reportType: Integer
        
        Example::
        
            {
                reportType: 1
            }
        
        +--------+
        |Returns:|
        +--------+
		
        :param designers: 排名信息列表 , 每条数据类型 :data:`materialDesignerCount`
        :type designers: List
		
        Example::
        
            {
                ...
                "designers": [
                    {
                        "mdcId": 1,
                        "designerId": "U_00001",
                        "designerName": "12",
                        "designerDepartmentId": "FL_DD_01",
                        "designerDepartmentName": "大东分公司",
                        "designerRegionId": "FL_DR_01",
                        "designerRegionName": "设计一分区"
						"createTime": "2015-05-25"
						"total": 2360
                    }
                ],
                ...
            }
			
	.. method:: <I> designerDeportmentReport
    
        设计部主材业绩统计信息

        +---------+
        |Requests:|
        +---------+
        
        :param reportType: 报表类型
        :type reportType: Integer
        
        Example::
        
            {
                reportType: 1
            }
        
        +--------+
        |Returns:|
        +--------+
		
        :param designerDepartments: 排名信息列表 , 每条数据类型 :data:`materialDesignerDepartmentCount`
        :type designerDepartments: List
		
        Example::
        
            {
                ...
                "designerDepartments": [
                    {
                        "mddcId": 1,
                        "designerDepartmentId": "FL_DD_01",
                        "designerDepartmentName": "大东分公司",
                        "designerRegionId": "FL_DR_01",
                        "designerRegionName": "设计一分区"
						"createTime": "2015-05-25"
						"total": 2360
                    }
                ],
                ...
            }
			
	.. method:: <I> designerRegionReport
    
        设计分区主材业绩统计信息

        +---------+
        |Requests:|
        +---------+
        
        :param reportType: 报表类型
        :type reportType: Integer	
        
        Example::
        
            {
                reportType: 1
            }        
        
        +--------+
        |Returns:|
        +--------+
		
        :param designerRegions: 排名信息列表 , 每条数据类型 :data:`materialDesignerRegionCount`
        :type designerRegions: List
		
        Example::
        
            {
                ...
                "designerRegions": [
                    {
                        "mdrcId": 1,
                        "designerRegionId": "FL_DR_01",
                        "designerRegionName": "设计一分区"
						"createTime": "2015-05-25"
						"total": 2360
                    }
                ],
                ...
            }

	.. method:: <I> countDesigner
    
        统计设计师主材业绩信息	
        
        +---------+
        |Requests:|
        +---------+
        
        :param reportType: 报表类型
        :type reportType: Integer
        
        Example::
        
            {
                reportType: 1
            }
        
        +--------+
        |Returns:|
        +--------+
		
        :param designers: 排名信息列表 , 每条数据类型 :data:`materialDesignerCount`
        :type designers: List
		
        Example::
        
            {
                ...
                "designers": [
                    {
						"mdcId": 1,
                        "designerId": "U_00001",
                        "designerName": "12",
                        "designerDepartmentId": "FL_DD_01",
                        "designerDepartmentName": "大东分公司",
                        "designerRegionId": "FL_DR_01",
                        "designerRegionName": "设计一分区"
						"createTime": "2015-05-25"
						"total": 2360
					}
                ],
                ...
            }
			
	.. method:: <I> countDesignerDepartment
    
        统计设计部门主材绩信息

        +---------+
        |Requests:|
        +---------+
        
        :param reportType: 报表类型
        :type reportType: Integer
        
        Example::
        
            {
                reportType: 1
            }
        
        +--------+
        |Returns:|
        +--------+
		
        :param designerDepartments: 排名信息列表 , 每条数据类型 :data:`materialDesignerDepartmentCount`
        :type designerDepartments: List
		
        Example::
        
            {
                ...
                "designerDepartments": [
                    {
                        "mddcId": 1,
                        "designerDepartmentId": "FL_DD_01",
                        "designerDepartmentName": "大东分公司",
                        "designerRegionId": "FL_DR_01",
                        "designerRegionName": "设计一分区"
						"createTime": "2015-05-25"
						"total": 2360
                    }
                ],
                ...
            }
			
	.. method:: <I> countDesignerRegion
    
        统计设计分区主材业绩信息

        +---------+
        |Requests:|
        +---------+
        
        :param reportType: 报表类型
        :type reportType: Integer	
        
        Example::
        
            {
                reportType: 1
            }        
        
        +--------+
        |Returns:|
        +--------+
		
        :param designerRegions: 排名信息列表 , 每条数据类型 :data:`materialDesignerRegionCount`
        :type designerRegions: List
		
        Example::
        
            {
                ...
                "designerRegions": [
                    {
                        "mdrcId": 1,
                        "designerRegionId": "FL_DR_01",
                        "designerRegionName": "设计一分区"
						"createTime": "2015-05-25"
						"total": 2360
                    }
                ],
                ...
            }
			
	.. method:: <I> queryRankForPlace
    
        查询设计师排名信息 , 分为装修和主材 , 统计方式为汇总业绩以及排名信息
			       
        +--------+
        |Returns:|
        +--------+
        
        :param decorationRank: 装修业绩
        :type decorationRank: String
        :param decorationPlace: 装修排名
        :type decorationPlace: String
        :param materialRank: 主材业绩
        :type materialRank: String
        :param materialPlace: 主材排名
        :type materialPlace: String
		
        Example::
        
            {
                ...
                
                "decorationPlace": "2"
                "decorationRank": "151249.0"
                "materialPlace": "2"
                "materialRank": "1655621.139974594"
                ...
            }
            
装修工程进度统计
================

.. class:: api.report.DecorationReportAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: decoration7Construction
    
    :param dcid: ID
    :type dcid: Long
    :param company: 公司
    :type company: String
    :param cs0: 未开工
    :type cs0: Integer
    :param cs1: 已开工
    :type cs1: Integer
    :param cs2: 已完工
    :type cs2: Integer
    :param cs3: 砌墙
    :type cs3: Integer
    :param cs4: 铲大白
    :type cs4: Integer
    :param cs5: 放线
    :type cs5: Integer
    :param cs6: 水暖
    :type cs6: Integer
    :param cs7: 力工
    :type cs7: Integer
    :param cs8: 电工
    :type cs8: Integer
    :param cs9: 瓦工
    :type cs9: Integer
    :param cs10: 地面找平
    :type cs10: Integer
    :param cs11: 木工
    :type cs11: Integer
    :param cs12: 油工
    :type cs12: Integer
    :param cs13: 水电验收
    :type cs13: Integer
    :param cs14: 保洁
    :type cs14: Integer
    
    .. method:: <I> queryDecoration7Construction
    
        查询装修工程进度统计信息
        
        
        +--------+
        |Returns:|
        +--------+
        
        :param decoration7Constructions: 装修工程状态信息列表 , 每条数据类型 :data:`decoration7Construction`
        :type decoration7Constructions: String

        Example::
        
            {
                ...
                
                "decoration7Constructions": [
                    {
                        "company": "公司",
                        "cs0": 0,
                        "cs1": 0,
                        "cs2": 0,
                        "cs3": 0,
                        "cs4": 0,
                        "cs5": 0,
                        "cs6": 0,
                        "cs7": 0,
                        "cs8": 0,
                        "cs9": 0,
                        "cs10": 0,
                        "cs11": 0,
                        "cs12": 0,
                        "cs13": 0,
                        "cs14": 0
                    }
                ]
                ...
            }

    .. method:: <I> updateDecoration7Construction

装修业绩统计
================

.. class:: api.report.DecorationReportAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: decoration7Achievement
    
    :param daid: ID
    :type daid: Long
    :param department: 部门, 类型 `department <./department.html#api.communion.DepartmentAction.department>`__
    :type department: Object
    :param year: 年份
    :type year: Integer
    :param month: 月份
    :type month: Integer
    :param cs0: 签单数
    :type cs0: Long
    :param cs1: 设计数
    :type cs1: Long
    :param cs2: 签单额
    :type cs2: Long
    :param cs3: 净业绩
    :type cs3: Long
    :param cs4: 设计额
    :type cs4: Long
    :param cs5: 服务费
    :type cs5: Long
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> queryDecoration7Achievement
    
        查询装修业绩进度统计信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param decoration7Achievements: 装修业绩信息列表 , 每条数据类型 :data:`decoration7Achievement`
        :type decoration7Achievements: List

        Example::
        
            {
                ...
                
                "decoration7Achievements": [
                    {
                        "daid": 1,
                        "department": {
                            "did": 1,
                            "no": "D001",
                            "name": "市场营销一部",
                        },
                        "cs0": 0,
                        "cs1": 0,
                        "cs2": 0,
                        "cs3": 0,
                        "cs4": 0,
                        "cs5": 0
                    }
                ]
                ...
            }

    .. method:: <I> updateDecoration7Achievement

销售业绩统计
================

.. class:: api.report.SalesReportAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: sales7Achievement
    
    :param said: ID
    :type said: Long
    :param department: 部门, 类型 `department <./department.html#api.communion.DepartmentAction.department>`__
    :type department: Object
    :param year: 年份
    :type year: Integer
    :param month: 月份
    :type month: Integer
    :param cs0: 销售单数
    :type cs0: Long
    :param cs1: 定金总额
    :type cs1: Long
    :param cs2: 补款总额
    :type cs2: Long
    :param cs3: 补款数
    :type cs3: Long
    :param cs4: 退货单数
    :type cs4: Long
    :param cs5: 退货总额
    :type cs5: Long
    :param cs6: 结算单数
    :type cs6: Long
    :param cs7: 结算总额
    :type cs7: Long
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> querySales7Achievement
    
        查询销售业绩进度统计信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param sales7Achievements: 销售业绩信息列表 , 每条数据类型 :data:`sales7Achievement`
        :type sales7Achievements: List

        Example::
        
            {
                ...
                
                "sales7Achievements": [
                    {
                        "said": 1,
                        "department": {
                            "did": 1,
                            "no": "D001",
                            "name": "市场营销一部",
                        },
                        "cs0": 0,
                        "cs1": 0,
                        "cs2": 0,
                        "cs3": 0,
                        "cs4": 0,
                        "cs5": 0,
                        "cs6": 0,
                        "cs7": 0
                    }
                ]
                ...
            }
            
工程状态统计
================

.. class:: api.report.ConstructionReportAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: construction7Achievement
    
    :param caid: ID
    :type caid: Long
    :param year: 年份
    :type year: Integer
    :param month: 月份
    :type month: Integer
    :param cs0: 未开工数
    :type cs0: Long
    :param cs1: 开工数
    :type cs1: Long
    :param cs2: 完工数
    :type cs2: Long
    :param cs3: 铲大白
    :type cs3: Integer
    :param cs4: 放线
    :type cs4: Integer
    :param cs5: 水暖
    :type cs5: Integer
    :param cs6: 力工
    :type cs6: Integer
    :param cs7: 电工
    :type cs7: Integer
    :param cs8: 瓦工
    :type cs8: Integer
    :param cs9: 地面找平
    :type cs9: Integer
    :param cs10: 木工
    :type cs10: Integer
    :param cs11: 油工
    :type cs11: Integer
    :param cs12: 水电验收
    :type cs12: Integer
    :param cs13: 保洁
    :type cs13: Integer
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> queryConstruction7Achievement
    
        查询工程状态进度统计信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param construction7Achievements: 工程状态信息列表 , 每条数据类型 :data:`construction7Achievement`
        :type construction7Achievements: List

        Example::
        
            {
                ...
                
                "construction7Achievements": [
                    {
                        "said": 1,
                        "cs0": 0,
                        "cs1": 0,
                        "cs2": 0,
                        "cs3": 0,
                        "cs4": 0,
                        "cs5": 0,
                        "cs6": 0,
                        "cs7": 0,
                        "cs8": 0,
                        "cs9": 0,
                        "cs10": 0,
                        "cs11": 0,
                        "cs12": 0,
                        "cs13": 0
                    }
                ]
                ...
            }

人资状态统计
================

.. class:: api.report.UserReportAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: user7Achievement
    
    在职总数/离职总数/入职人数/离职人数/调职人数/
    
    :param uaid: ID
    :type uaid: Long
    :param year: 年份
    :type year: Integer
    :param month: 月份
    :type month: Integer
    :param cs0: 总数
    :type cs0: Long
    :param cs1: 在职总数
    :type cs1: Long
    :param cs2: 离职总数
    :type cs2: Long
    :param cs3: 入职人数
    :type cs3: Long
    :param cs4: 离职人数
    :type cs4: Long
    :param cs5: 调职人数
    :type cs5: Long
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> queryUser7Achievement
    
        查询人资状态统计信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param user7Achievements: 人资状态信息列表 , 每条数据类型 :data:`user7Achievement`
        :type user7Achievements: List

        Example::
        
            {
                ...
                
                "user7Achievements": [
                    {
                        "uaid": 1,
                        "cs0": 0,
                        "cs1": 0,
                        "cs2": 0,
                        "cs3": 0,
                        "cs4": 0,
                        "cs5": 0
                    }
                ]
                ...
            }

审批状态统计
================

.. class:: api.report.ApprovalReportAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: approval7Achievement
    
    总数/创建数量/未处理数量/通过数量/驳回数量
    
    :param aaid: ID
    :type aaid: Long
    :param year: 年份
    :type year: Integer
    :param month: 月份
    :type month: Integer
    :param type: 类型
    :type type: Short
    :param cs0: 总数
    :type cs0: Long
    :param cs1: 创建数量
    :type cs1: Long
    :param cs2: 未处理数量
    :type cs2: Long
    :param cs3: 通过数量
    :type cs3: Long
    :param cs4: 驳回数量
    :type cs4: Long
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> queryApproval7Achievement
    
        查询审批状态进度统计信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param approval7Achievements: 审批状态信息列表 , 每条数据类型 :data:`approval7Achievement`
        :type approval7Achievements: List

        Example::
        
            {
                ...
                
                "approval7Achievements": [
                    {
                        "said": 1,
                        "type": 0,
                        "cs0": 0,
                        "cs1": 0,
                        "cs2": 0,
                        "cs3": 0,
                        "cs4": 0
                    }
                ]
                ...
            }
            