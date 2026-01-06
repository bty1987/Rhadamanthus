# report {#report}

# 报表
## 装修业绩排名

## api.report.DecorationRankAction

        |DataType:|
        #### decorationRank

    - **drid**: ID
      - 类型: *Integer*
    - **designer**: 设计师 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **depte**: 部门 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 分区 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **month**: 月份 , 格式 yyyymm
      - 类型: *Integer*
    - **rank**: 计算值
      - 类型: *Integer*
    - **type**: 类型 , 0: 设计 , 1: 业务
      - 类型: *Short*
    - **status**: 状态 , 包括: 0: 初始 , 1: 失效
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    #### decorationDepartmentRank

    - **ddrid**: ID
      - 类型: *Integer*
    - **depte**: 部门 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 分区 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **month**: 月份 , 格式 yyyymm
      - 类型: *Integer*
    - **rank**: 计算值
      - 类型: *Integer*
    - **type**: 类型 , 0: 设计 , 1: 业务
      - 类型: *Short*
    - **status**: 状态 , 包括: 0: 初始 , 1: 失效
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    #### decorationRegionRank

    - **drrid**: ID
      - 类型: *Integer*
    - **region**: 分区 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **month**: 月份 , 格式 yyyymm
      - 类型: *Integer*
    - **rank**: 计算值
      - 类型: *Integer*
    - **type**: 类型 , 0: 设计 , 1: 业务
      - 类型: *Short*
    - **status**: 状态 , 包括: 0: 初始 , 1: 失效
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    ### <I> queryDecorationRank

        装修业绩排名信息
        
                |Requests:|
                :param decorationRank.type: 类型
        :type decorationRank.type: Short
        
        Example::
        
            {
                "decorationRank.type": 0
            }

                |Returns:|
                - **ranks**: 排名信息列表 , 每条数据类型 *decorationRank*
          - 类型: *List*
		
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
			
	### <I> queryDecorationDepartmentRank

        部门装修业绩排名信息
        
                |Requests:|
                :param decorationDepartmentRank.type: 类型
        :type decorationDepartmentRank.type: Short
        
        Example::
        
            {
                "decorationDepartmentRank.type": 0
            }

                |Returns:|
                - **ranks**: 排名信息列表 , 每条数据类型 *decorationDepartmentRank*
          - 类型: *List*
		
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
			
	### <I> queryDecorationRegionRank

        设计分区装修业绩排名信息
        
                |Requests:|
                :param decorationRegionRank.type: 类型
        :type decorationRegionRank.type: Short
        
        Example::
        
            {
                "decorationRegionRank.type": 0
            }
		
                |Returns:|
                - **ranks**: 排名信息列表 , 每条数据类型 *decorationRegionRank*
          - 类型: *List*
		
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
            
## 主材业绩排名

## api.report.MaterialRankAction

    #### materialDesignerRank

    - **mdrId**: ID
      - 类型: *Integer*
    - **designerId**: 设计师编号
      - 类型: *String*
    - **designerName**: 设计师名
      - 类型: *String*
    - **createTime**: 开始时间
      - 类型: *String*
    - **endTime**: 结束时间
      - 类型: *String*
    - **rank**: 计算值
      - 类型: *Double*
    - **status**: 状态 , 包括: 0: 初始 , 1: 失效
      - 类型: *Short*
    
    #### materialDesignerDepartmentRank

    - **mddrid**: ID
      - 类型: *Integer*
    - **designerDeptId**: 设计部编号
      - 类型: *String*
    - **designerDeptName**: 设计部名
      - 类型: *String*
    - **createTime**: 开始时间
      - 类型: *String*
    - **endTime**: 结束时间
      - 类型: *String*
    - **rank**: 计算值
      - 类型: *Double*
    - **status**: 状态 , 包括: 0: 初始 , 1: 失效
      - 类型: *Short*
    
    #### materialDesignerRegionRank

    - **mdrrid**: ID
      - 类型: *Integer*
    - **designerRegionId**: 设计分区编号
      - 类型: *String*
    - **designerRegionName**: 设计分区名
      - 类型: *String*
    - **createTime**: 开始时间
      - 类型: *String*
    - **endTime**: 结束时间
      - 类型: *String*
    - **rank**: 计算值
      - 类型: *Double*
    - **status**: 状态 , 包括: 0: 初始 , 1: 失效
      - 类型: *Short*
         
    ### <I> queryMaterialDesignerRank

        设计师主材业绩排名

                |Returns:|
                - **ranks**: 排名信息列表 , 每条数据类型 *materialDesignerRank*
          - 类型: *List*
		
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
			
	### <I> queryMaterialDesignerDepartmentRank

        设计部主材业绩排名

                |Returns:|
                - **ranks**: 排名信息列表 , 每条数据类型 *materialDesignerDepartmentRank*
          - 类型: *List*
		
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
			
	### <I> queryMaterialDesignerRegionRank

        设计分区主材业绩排名

                |Returns:|
                - **ranks**: 排名信息列表 , 每条数据类型 *materialDesignerRegionRank*
          - 类型: *List*
		
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
			
	### <I> materialDesignerRank

        设计师主材业绩排名TOP10

                |Returns:|
                - **ranks**: 排名信息列表 , 每条数据类型 *materialDesignerRank*
          - 类型: *List*
		
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
			
	### <I> materialDesignerDepartmentRank

        设计主材业绩排名TOP10

                |Returns:|
                - **ranks**: 排名信息列表 , 每条数据类型 *materialDesignerDepartmentRank*
          - 类型: *List*
		
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
			
	### <I> materialDesignerRegionRank

        设计分区主材业绩排名TOP10

                |Returns:|
                - **ranks**: 排名信息列表 , 每条数据类型 *materialDesignerRegionRank*
          - 类型: *List*
		
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
			
## 主材业绩统计

## api.report.MaterialReportAction

    #### materialDepartmentCount

    - **mdcId**: ID
      - 类型: *Integer*
    - **materialDeptId**: 主材部编号
      - 类型: *String*
    - **createTime**: 开始时间
      - 类型: *String*
    - **total**: 统计值
      - 类型: *Float*
    
    #### materialDesignerCount

    - **mdcId**: ID
      - 类型: *Integer*
    - **designerId**: 设计师编号
      - 类型: *String*
    - **designerName**: 设计师
      - 类型: *String*
    - **designerDepartmentId**: 设计部编号
      - 类型: *String*
    - **designerDepartmentName**: 设计部名
      - 类型: *String*
    - **designerRegionId**: 设计分区编号
      - 类型: *String*
    - **designerRegionName**: 设计分区名
      - 类型: *String*
    - **createTime**: 开始时间
      - 类型: *String*
    - **total**: 统计值
      - 类型: *Float*
    
    #### materialDesignerDepartmentCount

    - **mddcId**: ID
      - 类型: *Integer*
    - **designerDepartmentId**: 设计部编号
      - 类型: *String*
    - **designerDepartmentName**: 设计部名
      - 类型: *String*
    - **designerRegionId**: 设计分区编号
      - 类型: *String*
    - **designerRegionName**: 设计分区名
      - 类型: *String*
    - **createTime**: 开始时间
      - 类型: *String*
    - **total**: 统计值
      - 类型: *Float*
    
    #### materialDesignerRegionCount

    - **mdrcId**: ID
      - 类型: *Integer*
    - **designerRegionId**: 设计分区编号
      - 类型: *String*
    - **designerRegionName**: 设计分区名
      - 类型: *String*
    - **createTime**: 开始时间
      - 类型: *String*
    - **total**: 统计值
      - 类型: *Float*

    ### <I> materialDepartmentReport

        查询全部主材部门业绩统计信息		
        
                |Returns:|
                - **ranks**: 排名信息列表 , 每条数据类型 *materialDepartmentCount*
          - 类型: *List*
		
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
			
	### <I> designerReport

        设计师主材业绩统计信息

                |Requests:|
                - **reportType**: 报表类型
          - 类型: *Integer*
        
        Example::
        
            {
                reportType: 1
            }
        
                |Returns:|
                - **designers**: 排名信息列表 , 每条数据类型 *materialDesignerCount*
          - 类型: *List*
		
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
			
	### <I> designerDeportmentReport

        设计部主材业绩统计信息

                |Requests:|
                - **reportType**: 报表类型
          - 类型: *Integer*
        
        Example::
        
            {
                reportType: 1
            }
        
                |Returns:|
                - **designerDepartments**: 排名信息列表 , 每条数据类型 *materialDesignerDepartmentCount*
          - 类型: *List*
		
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
			
	### <I> designerRegionReport

        设计分区主材业绩统计信息

                |Requests:|
                - **reportType**: 报表类型
          - 类型: *Integer	*
        
        Example::
        
            {
                reportType: 1
            }        
        
                |Returns:|
                - **designerRegions**: 排名信息列表 , 每条数据类型 *materialDesignerRegionCount*
          - 类型: *List*
		
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

	### <I> countDesigner

        统计设计师主材业绩信息	
        
                |Requests:|
                - **reportType**: 报表类型
          - 类型: *Integer*
        
        Example::
        
            {
                reportType: 1
            }
        
                |Returns:|
                - **designers**: 排名信息列表 , 每条数据类型 *materialDesignerCount*
          - 类型: *List*
		
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
			
	### <I> countDesignerDepartment

        统计设计部门主材绩信息

                |Requests:|
                - **reportType**: 报表类型
          - 类型: *Integer*
        
        Example::
        
            {
                reportType: 1
            }
        
                |Returns:|
                - **designerDepartments**: 排名信息列表 , 每条数据类型 *materialDesignerDepartmentCount*
          - 类型: *List*
		
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
			
	### <I> countDesignerRegion

        统计设计分区主材业绩信息

                |Requests:|
                - **reportType**: 报表类型
          - 类型: *Integer	*
        
        Example::
        
            {
                reportType: 1
            }        
        
                |Returns:|
                - **designerRegions**: 排名信息列表 , 每条数据类型 *materialDesignerRegionCount*
          - 类型: *List*
		
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
			
	### <I> queryRankForPlace

        查询设计师排名信息 , 分为装修和主材 , 统计方式为汇总业绩以及排名信息
			       
                |Returns:|
                - **decorationRank**: 装修业绩
          - 类型: *String*
        - **decorationPlace**: 装修排名
          - 类型: *String*
        - **materialRank**: 主材业绩
          - 类型: *String*
        - **materialPlace**: 主材排名
          - 类型: *String*
		
        Example::
        
            {
                ...
                
                "decorationPlace": "2"
                "decorationRank": "151249.0"
                "materialPlace": "2"
                "materialRank": "1655621.139974594"
                ...
            }
            
## 装修工程进度统计

## api.report.DecorationReportAction

        |DataType:|
        #### decoration7Construction

    - **dcid**: ID
      - 类型: *Long*
    - **company**: 公司
      - 类型: *String*
    - **cs0**: 未开工
      - 类型: *Integer*
    - **cs1**: 已开工
      - 类型: *Integer*
    - **cs2**: 已完工
      - 类型: *Integer*
    - **cs3**: 砌墙
      - 类型: *Integer*
    - **cs4**: 铲大白
      - 类型: *Integer*
    - **cs5**: 放线
      - 类型: *Integer*
    - **cs6**: 水暖
      - 类型: *Integer*
    - **cs7**: 力工
      - 类型: *Integer*
    - **cs8**: 电工
      - 类型: *Integer*
    - **cs9**: 瓦工
      - 类型: *Integer*
    - **cs10**: 地面找平
      - 类型: *Integer*
    - **cs11**: 木工
      - 类型: *Integer*
    - **cs12**: 油工
      - 类型: *Integer*
    - **cs13**: 水电验收
      - 类型: *Integer*
    - **cs14**: 保洁
      - 类型: *Integer*
    
    ### <I> queryDecoration7Construction

        查询装修工程进度统计信息
        
        
                |Returns:|
                - **decoration7Constructions**: 装修工程状态信息列表 , 每条数据类型 *decoration7Construction*
          - 类型: *String*

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

    ### <I> updateDecoration7Construction

## 装修业绩统计

## api.report.DecorationReportAction

        |DataType:|
        #### decoration7Achievement

    - **daid**: ID
      - 类型: *Long*
    - **department**: 部门, 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **year**: 年份
      - 类型: *Integer*
    - **month**: 月份
      - 类型: *Integer*
    - **cs0**: 签单数
      - 类型: *Long*
    - **cs1**: 设计数
      - 类型: *Long*
    - **cs2**: 签单额
      - 类型: *Long*
    - **cs3**: 净业绩
      - 类型: *Long*
    - **cs4**: 设计额
      - 类型: *Long*
    - **cs5**: 服务费
      - 类型: *Long*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> queryDecoration7Achievement

        查询装修业绩进度统计信息
        
                |Returns:|
                - **decoration7Achievements**: 装修业绩信息列表 , 每条数据类型 *decoration7Achievement*
          - 类型: *List*

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

    ### <I> updateDecoration7Achievement

## 销售业绩统计

## api.report.SalesReportAction

        |DataType:|
        #### sales7Achievement

    - **said**: ID
      - 类型: *Long*
    - **department**: 部门, 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **year**: 年份
      - 类型: *Integer*
    - **month**: 月份
      - 类型: *Integer*
    - **cs0**: 销售单数
      - 类型: *Long*
    - **cs1**: 定金总额
      - 类型: *Long*
    - **cs2**: 补款总额
      - 类型: *Long*
    - **cs3**: 补款数
      - 类型: *Long*
    - **cs4**: 退货单数
      - 类型: *Long*
    - **cs5**: 退货总额
      - 类型: *Long*
    - **cs6**: 结算单数
      - 类型: *Long*
    - **cs7**: 结算总额
      - 类型: *Long*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> querySales7Achievement

        查询销售业绩进度统计信息
        
                |Returns:|
                - **sales7Achievements**: 销售业绩信息列表 , 每条数据类型 *sales7Achievement*
          - 类型: *List*

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
            
## 工程状态统计

## api.report.ConstructionReportAction

        |DataType:|
        #### construction7Achievement

    - **caid**: ID
      - 类型: *Long*
    - **year**: 年份
      - 类型: *Integer*
    - **month**: 月份
      - 类型: *Integer*
    - **cs0**: 未开工数
      - 类型: *Long*
    - **cs1**: 开工数
      - 类型: *Long*
    - **cs2**: 完工数
      - 类型: *Long*
    - **cs3**: 铲大白
      - 类型: *Integer*
    - **cs4**: 放线
      - 类型: *Integer*
    - **cs5**: 水暖
      - 类型: *Integer*
    - **cs6**: 力工
      - 类型: *Integer*
    - **cs7**: 电工
      - 类型: *Integer*
    - **cs8**: 瓦工
      - 类型: *Integer*
    - **cs9**: 地面找平
      - 类型: *Integer*
    - **cs10**: 木工
      - 类型: *Integer*
    - **cs11**: 油工
      - 类型: *Integer*
    - **cs12**: 水电验收
      - 类型: *Integer*
    - **cs13**: 保洁
      - 类型: *Integer*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> queryConstruction7Achievement

        查询工程状态进度统计信息
        
                |Returns:|
                - **construction7Achievements**: 工程状态信息列表 , 每条数据类型 *construction7Achievement*
          - 类型: *List*

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

## 人资状态统计

## api.report.UserReportAction

        |DataType:|
        #### user7Achievement

    在职总数/离职总数/入职人数/离职人数/调职人数/
    
    - **uaid**: ID
      - 类型: *Long*
    - **year**: 年份
      - 类型: *Integer*
    - **month**: 月份
      - 类型: *Integer*
    - **cs0**: 总数
      - 类型: *Long*
    - **cs1**: 在职总数
      - 类型: *Long*
    - **cs2**: 离职总数
      - 类型: *Long*
    - **cs3**: 入职人数
      - 类型: *Long*
    - **cs4**: 离职人数
      - 类型: *Long*
    - **cs5**: 调职人数
      - 类型: *Long*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> queryUser7Achievement

        查询人资状态统计信息
        
                |Returns:|
                - **user7Achievements**: 人资状态信息列表 , 每条数据类型 *user7Achievement*
          - 类型: *List*

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

## 审批状态统计

## api.report.ApprovalReportAction

        |DataType:|
        #### approval7Achievement

    总数/创建数量/未处理数量/通过数量/驳回数量
    
    - **aaid**: ID
      - 类型: *Long*
    - **year**: 年份
      - 类型: *Integer*
    - **month**: 月份
      - 类型: *Integer*
    - **type**: 类型
      - 类型: *Short*
    - **cs0**: 总数
      - 类型: *Long*
    - **cs1**: 创建数量
      - 类型: *Long*
    - **cs2**: 未处理数量
      - 类型: *Long*
    - **cs3**: 通过数量
      - 类型: *Long*
    - **cs4**: 驳回数量
      - 类型: *Long*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> queryApproval7Achievement

        查询审批状态进度统计信息
        
                |Returns:|
                - **approval7Achievements**: 审批状态信息列表 , 每条数据类型 *approval7Achievement*
          - 类型: *List*

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
