
%   API参数通用说明
> **Note**: 文档将说明API参数的校验规则 , 传递规则以及部分注意事项 , 意在明确什么样的参数是合法的 , 避免歧义以及降低开发成本 .  

*   API定义中的 **基础** 数据类型对应Java语言中的数据类型 , 其中包括Integer , Short , Float/Double , String , List , Map . 
    另外有其他对象类型 , 具体参见不同API的 **DataType** 部分 .

*   API中如果定义为int型 , 且有范围限制 , 比如：有变量a , 它的范围是：1-255 , 那么赋值 a: 1 , a: "1" , 均 **可以** 生效 , 
    API首先需要保证正确的值类型和取值范围内的赋值 , 处理成功 , 取值范围以外 , 如果通过简单的类型转换 , 可以变换成取值范围内的值 , 
    API可以 **选择性** 给予支持 , 像上面的例子 , 就是"1"可以简单的转换为1 , 反之 , 如果有变量限制值为str型 , 比如：有变量a , 那么赋值 a: "1" , a: 1 , 均 **可以** 生效 ,  因为1可以简单的转换为 "1" . 

*   参数内容部合法的异常处理 , 比如：当参数类型和长度合法 , 但是内容不合法时 , 参数a , str型 , 长度：1-63 , 但是a在赋值时 , 包含非法值 "a": "?{}123" , 此时会出现系统级异常 , 不能正确进行识别 , 需要开发者进行正确性检查 . 
  
*   在不恰当的位置使用中文 , 或者特殊符号等 , 被浏览器 , 测试工具 , apache等限制 , 认为非法地址而阻断的 , 不是服务支持的缺陷 . 
  
*   一些在取值范围以外的 , 特殊的参数赋值 , 比如：-1 , None , ""等 , API可以认为 , 这些赋值的意思是 , "不修改该参数" , 而做忽略处理 , 不提示 **Invalid request**  .

*   列表参数传递 , 注意需要在参数名称后面加上索引表示 , 利用[]进行引用 , 由0开始 , 中间不能出现中断 , 需要连续进行 . 

    Example::

        {
            ...
            "names[0]": "name0",
            "names[1]": "name1",
            ...
        }

*   分页处理 , 系统对于分页进行统一处理 , 利用API接口以及传递参数双重方式完成 , 即使传递正确参数 , 但是API接口不支持将不能完成分页动作 . 
    需要注意的是 , 传递参数的键值需要以完整字符串的方式进行传递 , 比如paging.page , 应该为 **"paging.page"**整体字符串的方式进行传递 . 

    ### <I> page

                |Requests:|
                :param paging.page: 分页偏移量 . 
        :type paging.page: int
        :param paging.rows: 单页数量 . 
        :type paging.rows: int
        
        Example::
        
            {
                paging.page: 1,
                paging.rows: 10
            }

                |Returns:|
                - **paging**: 分页结果 . 
          - 类型: *object*
        :param paging.data: 数据结果 , 具体查询信息返回的结果集 . 
        :type paging.data: List
        :param paging.page: 分页偏移量
        :type paging.page: int
        :param paging.rows: 单页数量
        :type paging.rows: int
        :param paging.totalPage: 总页数
        :type paging.totalPage: int
        :param paging.totalRecords: 总数
        :type paging.totalRecords: int
        
        Example::
            
            {
                ...
                "paging":{
                    "data":[
                        ...
                    ],
                    "page":1,
                    "rows":10,
                    "totalPage":10,
                    "totalRecords":100
                },
                ...
            }

*   查询条件 , 系统对于数据处理条件进行统一获取 , 以结果集的方式进行赋值 , 同时利用每条信息进行条件处理动作 . 
    需要注意的是 , 传递参数的键值需要以完整字符串的方式进行传递 , 比如filter.data , 应该为"filter.data"整体字符串的方式进行传递 . 
    filters类型为列表 , 接收过程需要通过说明索引表示来完成列表的构建 , 故需要在filters后增加索引信息 . 
    条件可以根据查询的信息中包含字段进行 , 但并不是全字段都支持作为条件进行查询

    ### <I> filter

                |Requests:|
                - **filters**: 查询条件对象列表
          - 类型: *List*
        
        :param filters[n]: 查询条件对象
        :type filters[n]: object
        :param filters[n].field: 查询字段名称
        :type filters[n].field: String
        :param filters[n].data: 查询信息
        :type filters[n].data: String
        :param filters[n].op: 查询操作 , 比如等于 eq , 模糊 cn , 大于 gt , 小于lt等
        :type filters[n].op: String
        
        Example::
        
            {
                filters[0].field: orderId,
                filters[0].data: 1501010001,
                filters[0].op:eq
            }

> **Note**: 总结 , API应该尽可能读懂用户的输入值 , 当参数值的类型不符时 , 可以选择用Integer , Short , Float/Double , String等进行转换转换 , 转换失败 , 则认为是非法请求 . 
    另外 , 在用户输入参数不合法时 , 会导致系统级错误 , 即服务不能正确处理 , 导致不能API不能执行成功  .
