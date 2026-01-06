# market {#market}

# 营销
## 商城

### 轮播

## api.market.SlideAction

        |DataType:|
        #### slide

    - **sid**: 轮播ID
      - 类型: *Long*
    - **gid**: 商品ID
      - 类型: *Long*
    - **img**: 图片路径
      - 类型: *String*
    - **url**: 跳转地址
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1:禁用
      - 类型: *Short*
    
    ### <S> querySlide

        获取轮播信息
        
                |Returns:|
                - **slides**: 轮播信息列表 , 每条数据类型 *slide*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "slides": [
                    {
                        "sid": 1,
                        "gid": 1,
                        "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                        "url": "",
                        "status": 0
                    }
                ],
                ...
            }
            
    ### <S-C> querySlideForShow

        获取显示的轮播信息 , 状态为0(启用)
        
                |Returns:|
                - **slides**: 轮播信息列表 , 每条数据类型 *slide*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "slides": [
                    {
                        "sid": 1,
                        "gid": 1,
                        "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                        "url": "",
                        "status": 0
                    }
                ],
                ...
            }
            
    ### <S> addSlide

        添加轮播信息
        
                |Requests:|
                :param slide.gid: 商品ID
        :type slide.gid: Long
        :param slide.img: 图片路径
        :type slide.img: String
        :param slide.url: 跳转路径
        :type slide.url: String
        
        Example::
        
            {
                "slide.gid": 1,
                "slide.img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                "slide.url": ""
            }
            
    ### <S> updateSlide

        更新轮播信息
        
        判断轮播信息是否存在 , 不存在 , 错误信息 **340002 轮播图不存在**
        
                |Requests:|
                :param slide.sid: 轮播ID
        :type slide.sid: Long
        :param slide.gid: 商品ID
        :type slide.gid: Long
        :param slide.img: 图片路径
        :type slide.img: String
        :param slide.url: 跳转路径
        :type slide.url: String
        
        Example::
        
            {
                "slide.sid": 1,
                "slide.gid": 1,
                "slide.img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                "slide.url": ""
            }
        
    ### <S> updateSlideForStatus

        更新轮播信息状态
        
        判断轮播信息是否存在 , 不存在 , 错误信息 **340002 轮播图不存在**
        
                |Requests:|
                :param slide.sid: 轮播ID
        :type slide.sid: Long
        :param slide.status: 状态
        :type slide.status: Short
        
        Example::
        
            {
                "slide.sid": 1,
                "slide.status": 1
            }

### 品类

## api.market.McategoryAction

        |DataType:|
        #### mcategory

    - **cid**: 品类ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **icon**: 图标样式
      - 类型: *String*
    - **isShow**: 首页显示 , 0: 显示 , 1: 不显示
      - 类型: *Short*
    
    ### <S> pageMcategory

        分页方式获取品类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 品类信息列表 , 每条数据类型 *mcategory*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "name": "家电",
                            "icon": "fl-jiadian",
                            "isShow": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <S-C> queryMcategory

        获取品类信息
        
                |Returns:|
                - **mcategorys**: 品类信息列表 , 每条数据类型 *mcategory*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "mcategorys": [
                    {
                        "cid": 1,
                        "name": "家电",
                        "icon": "fl-jiadian",
                        "isShow": 0
                    }
                ],
                ...
            }
            
    ### <S-C> queryMcategoryForShow

        获取首页显示品类信息
        
                |Returns:|
                - **mcategorys**: 品类信息列表 , 每条数据类型 *mcategory*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "mcategorys": [
                    {
                        "cid": 1,
                        "name": "家电",
                        "icon": "fl-jiadian",
                        "isShow": 0
                    }
                ],
                ...
            }
            
    ### <S> addMcategory

        添加品类信息 , 默认首页不显示
        
                |Requests:|
                :param mcategory.name: 名称
        :type mcategory.name: String
        :param mcategory.icon: 图标样式
        :type mcategory.icon: String
        
        Example::
        
            {
                "mcategory.name": "家电",
                "mcategory.icon": "fl-jiadian"
            }
    
    ### <S> updateMcategory

        更新品类信息
        
        判断品类是否存在 , 不存在 , 错误信息 **340003 品类不存在**
        
                |Requests:|
                :param mcategory.cid: 品类ID
        :type mcategory.cid: Long
        :param mcategory.name: 名称
        :type mcategory.name: String
        :param mcategory.icon: 图标样式
        :type mcategory.icon: String
        
        Example::
        
            {
                "mcategory.cid": 1,
                "mcategory.name": "家电",
                "mcategory.icon": "fl-jiadian"
            }
    
    ### <S> updateMcategoryForShow

        更新品类首页是否可见
        
        判断品类是否存在 , 不存在 , 错误信息 **340003 品类不存在**
        
                |Requests:|
                :param mcategory.cid: 品类ID
        :type mcategory.cid: Long
        :param mcategory.isShow: 是否可见
        :type mcategory.isShow: Short
        
        Example::
        
            {
                "mcategory.cid": 1,
                "mcategory.isShow": 1
            }
            
### 品牌

## api.market.MbrandAction

        |DataType:|
        #### mbrand

    - **bid**: 品类ID
      - 类型: *Long*
    - **mcategory**: 品类 , 类型 [mcategory](./store.html#api.store.McategoryAction.mcategory)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **icon**: Logo图片地址
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    
    ### <S> pageMbrand

        分页方式获取品牌信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 品牌信息列表 , 每条数据类型 *mbrand*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bid": 1,
                            "name": "品牌",
                            "icon": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                            "status": 1,
                            "mcategory": {
                                "cid": 1,
                                "name": "家电"
                            }
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <S-C> queryMbrand

        通过品类ID获取品牌信息
        
                |Requests:|
                :param mbrand.mcategory.cid: 品类ID
        :type mbrand.mcategory.cid: Long
        
        Example::
        
            {
                "mbrand.mcategory.cid": 1
            }
            
                |Returns:|
                - **mbrands**: 品牌信息列表 , 每条数据类型 *mbrand*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "mbrands": [
                    {
                        "bid": 1,
                        "name": "品牌",
                        "icon": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
                    }
                ],
                ...
            }
            
    ### <S> queryMbrandByName

        通过品牌名称获取品牌信息 , 支持模糊匹配, 状态为0(启用)
        
                |Requests:|
                :param mbrand.name: 名称
        :type mbrand.name: String
        
        Example::
        
            {
                "mbrand.name": "品牌"
            }
    
                |Returns:|
                - **mbrands**: 品牌信息列表 , 每条数据类型 *mbrand*
          - 类型: *List*
        - **autoFillKeyValue**: 键值列表 , 每条数据类型 *keyValue* , 键为品牌ID , 值为品牌名
          - 类型: *List*
        - **autoFillList**: 品牌名列表 , 每条数据类型String
          - 类型: *List*
        
        Example::
        
            {
                ...
                "mbrands": [
                    {
                        "bid": 1,
                        "name": "品牌",
                    }
                ],
                "autoFillKeyValue": [
                    {
                        "1": "品牌"
                    }
                ],
                "autoFillList": [
                    "品牌"
                ]
                ...
            }
            
    ### <S> addMbrand

        添加品牌信息 , 默认状态启用
        
                |Requests:|
                :param mbrand.mcategory.cid: 品类ID
        :type mbrand.category.cid: Long
        :param mbrand.name: 名称
        :type mbrand.name: String
        :param mbrand.icon: logo图片路径
        :type mbrand.icon: String
        
        Example::
        
            {
                "mbrand.mcategory.cid": 1,
                "mbrand.name": "品牌",
                "mbrand.icon": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
            }
            
    ### <S> updateMbrand

        更新品牌信息
        
        判断品牌是否存在 , 不存在 , 错误信息 **340004 品牌不存在**
        
                |Requests:|
                :param mbrand.bid: 品牌ID
        :type mbrand.bid: Long
        :param mbrand.mcategory.cid: 品类ID
        :type mbrand.category.cid: Long
        :param mbrand.name: 名称
        :type mbrand.name: String
        :param mbrand.icon: logo图片路径
        :type mbrand.icon: String
        
        Example::
        
            {
                "mbrand.bid": 1,
                "mbrand.mcategory.cid": 1,
                "mbrand.name": "品牌",
                "mbrand.icon": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
            }
            
    ### <S> updateMbrandForStatus

        更新品牌状态
        
        判断品牌是否存在 , 不存在 , 错误信息 **340004 品牌不存在**
        
                |Requests:|
                :param mbrand.bid: 品牌ID
        :type mbrand.bid: Long
        :param mbrand.status: 状态
        :type mbrand.status: Short
        
        Example::
        
            {
                "mbrand.bid": 1,
                "mbrand.status": 1
            }
            
### 商品

## api.market.MgoodsAction

        |DataType:|
        #### mgoods

    - **gid**: 商品ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **pinyin**: 拼音
      - 类型: *String*
    - **mbrand**: 品牌 , 类型 [mbrand](./store.html#api.store.MbrandAction.mbrand)
      - 类型: *Object*
    - **barcode**: 条码
      - 类型: *String*
    - **title**: 标题
      - 类型: *String*
    - **defaultImg**: 默认图片路径
      - 类型: *String*
    - **price**: 价格
      - 类型: *Float*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    
    ### <S> pageMgoods

        分页方式获取商品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 商品信息列表 , 每条数据类型 *mgoods*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "gid": 1,
                            "no": "XpKmAXSdXf",
                            "name": "品牌",
                            "barcode": "1283sXp35BsX5B237",
                            "title": "品牌商品标题",
                            "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                            "price": 100,
                            "status": 0,
                            "mbrand": {
                                "bid": 1,
                                "name": "品牌"
                            }
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <S-C> queryMgoods

        分页方式获取商品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 商品信息列表 , 每条数据类型 *mgoods*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "gid": 1,
                            "no": "XpKmAXSdXf",
                            "name": "品牌",
                            "barcode": "1283sXp35BsX5B237",
                            "title": "品牌商品标题",
                            "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                            "price": 100,
                            "status": 0,
                            "mbrand": {
                                "bid": 1,
                                "name": "品牌"
                            }
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <S-C> queryMgoodsByPinyin

        通过拼音获取商品信息 , 支持模糊查询 , 状态为0(启用)
        
                |Requests:|
                :param mgoods.pinyin: 拼音
        :type mgoods.pinyin: String
        
        Example::
        
            {
                "mgoods.pinyin": "品牌"
            }
    
                |Returns:|
                - **mgoodses**: 商品信息列表 , 每条数据类型 *mgoods*
          - 类型: *List*
        - **autoFillKeyValue**: 键值列表 , 每条数据类型 *keyValue* , 键为商品ID , 值为商品名
          - 类型: *List*
        - **autoFillList**: 商品名列表 , 每条数据类型String
          - 类型: *List*
        
        Example::
        
            {
                ...
                "mgoodses": [
                    {
                        "gid": 1,
                        "no": "XpKmAXSdXf",
                        "name": "品牌",
                        "barcode": "1283sXp35BsX5B237",
                        "title": "品牌商品标题",
                        "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                        "price": 100,
                    }
                ],
                "autoFillKeyValue": [
                    {
                        "1": "品牌"
                    }
                ],
                "autoFillList": [
                    "品牌"
                ]
                ...
            }
            
    ### <S> addMgoods

        添加商品信息
        
                |Requests:|
                :param mgoods.mbrand.bid: 品牌ID
        :type mgoods.mbrand.bid: Long
        :param mgoods.no: 编号
        :type mgoods.no: String
        :param mgoods.name: 名称
        :type mgoods.name: String
        :param mgoods.barcode: 条码
        :type mgoods.barcode: String
        :param mgoods.title: 标题
        :type mgoods.title: String
        :param mgoods.price: 价格
        :type mgoods.price: Float
        
        Example::
        
            {
                "mgoods.mbrand.bid": 1,
                "mgoods.no": "XpKmAXSdXf",
                "mgoods.name": "品牌",
                "mgoods.barcode": "条码",
                "mgoods.title": "品牌商品标题",
                "mgoods.price": 100
            }
            
    ### <S> updateMgoods

        更新商品信息
        
        判断商品是否存在 , 不存在 , 错误信息 **340005 商品不存在**
        
                |Requests:|
                :param mgoods.gid: 商品ID
        :type mgoods.gid: Long
        :param mgoods.title: 标题
        :type mgoods.title: String
        :param mgoods.defaultImg: 默认图片路径
        :type mgoods.defaultImg: String
        :param mgoods.price: 价格
        :type mgoods.price: Float
        
        Example::
        
            {
                "mgoods.gid": 1,
                "mgoods.title": "品牌商品标题",
                "mgoods.defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                "mgoods.price": 100
            }
            
    ### <S> updateMgoodsForStatus

        更新商品状态
        
        判断商品是否存在 , 不存在 , 错误信息 **340005 商品不存在**
        
                |Requests:|
                :param mgoods.gid: 商品ID
        :type mgoods.gid: Long
        :param mgoods.status: 状态
        :type mgoods.status: Short
        
        Example::
        
            {
                "mgoods.gid": 1,
                "mgoods.status": 0
            }
            
### 颜色

## api.market.McolorAction

        |DataType:|
        #### mcolor

    - **cid**: 颜色ID
      - 类型: *Long*
    - **gid**: 商品ID
      - 类型: *Long*
    - **color**: 颜色名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*

    
    ### <S> queryMcolorByGid

        通过商品ID获取颜色信息
        
                |Returns:|
                - **mcolors**: 颜色信息列表 , 每条数据类型 *mcolor*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "data": [
                    {
                        "cid": 1,
                        "gid": 1,
                        "color": "白色",
                        "status": 0
                    }
                ],
                ...
            }
            
    ### <S-C> queryMcolor

        通过商品ID获取颜色信息 , 状态为0(启用)
        
                |Returns:|
                - **mcolors**: 颜色信息列表 , 每条数据类型 *mcolor*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "data": [
                    {
                        "cid": 1,
                        "gid": 1,
                        "color": "白色"
                    }
                ],
                ...
            }
            
    ### <S> addMcolor

        添加商品颜色
        
                |Requests:|
                :param mcolor.gid: 商品ID
        :type mcolor.gid: Long
        :param mcolor.color: 颜色名称
        :type mcolor.color: String
        
        Example::
        
            {
                "mcolor.gid": 1,
                "mcolor.color": "白色"
            }
            
    ### <S> updateMcolorForStatus

        更新颜色状态
        
        判断颜色是否存在 , 不存在 , 错误信息 **340006 颜色不存在**
        
                |Requests:|
                :param mcolor.cid: 商品ID
        :type mcolor.cid: Long
        :param mcolor.status: 状态
        :type mcolor.status: Short
        
        Example::
        
            {
                "mcolor.cid": 1,
                "mcolor.status": 0
            }
            
### 规格

## api.market.MformatAction

        |DataType:|
        #### mformat

    - **fid**: 规格ID
      - 类型: *Long*
    - **gid**: 商品ID
      - 类型: *Long*
    - **format**: 规格名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*

    
    ### <S> queryMformatByGid

        通过商品ID获取规格信息
        
                |Returns:|
                - **mformats**: 规格信息列表 , 每条数据类型 *mformat*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "data": [
                    {
                        "fid": 1,
                        "gid": 1,
                        "format": "300*300",
                        "status": 0
                    }
                ],
                ...
            }
            
    ### <S-C> queryMformat

        通过商品ID获取规格信息 , 状态为0(启用)
        
                |Returns:|
                - **mformats**: 规格信息列表 , 每条数据类型 *mformat*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "data": [
                    {
                        "fid": 1,
                        "gid": 1,
                        "format": "300*300"
                    }
                ],
                ...
            }
            
    ### <S> addMformat

        添加规格信息
        
                |Requests:|
                :param mformat.gid: 商品ID
        :type mformat.gid: Long
        :param mformat.format: 规格名称
        :type mformat.format: String
        
        Example::
        
            {
                "mformat.gid": 1,
                "mformat.format": "300*300"
            }
            
    ### <S> updateMformatForStatus

        更新规格状态
        
        判断规格是否存在 , 不存在 , 错误信息 **340007 规格不存在**
        
                |Requests:|
                :param mformat.fid: 商品ID
        :type mformat.fid: Long
        :param mformat.status: 状态
        :type mformat.status: Short
        
        Example::
        
            {
                "mcolor.fid": 1,
                "mcolor.status": 0
            }
            
### 价格

## api.market.MPriceAction

        |DataType:|
        #### mprice

    - **pid**: 价格ID
      - 类型: *Long*
    - **mgoods**: 商品 , 类型 [mgoods](./store.html#api.store.MgoodsAction.mgoods)
      - 类型: *Object*
    - **mcolor**: 颜色 , 类型 [mcolor](./store.html#api.store.McolorAction.mcolor)
      - 类型: *Object*
    - **mformat**: 规格 , 类型 [mformat](./store.html#api.store.MformatAction.mformat)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **price**: 价格
      - 类型: *Float*
    - **img**: 图片路径
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用 , 2: 热点, 3: 推荐
      - 类型: *Short*
    
    ### <S-C> queryMprice

        通过商品ID获取价格信息 , 状态为0(启用),2(热点)以及3(推荐)
        
                |Requests:|
                :param mprice.mgoods.gid: 商品ID
        :type mprice.mgoods.gid: Long
        
        Example::
        
            {
                "mprice.mgoods.gid": 1
            }
        
                |Returns:|
                - **mprices**: 价格信息列表 , 每条数据类型 *mprice*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "mprices": [
                    {
                        "pid": 1,
                        "mgoods": {
                            "gid": 1,
                            "no": "XpKmAXSdXf",
                            "name": "品牌",
                            "barcode": "1283sXp35BsX5B237",
                            "title": "品牌商品标题",
                            "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                            "mbrand": {
                                "bid": 1,
                                "name": "品牌"
                            }
                        },
                        "mcolor": {
                            "cid": 1,
                            "gid": 1,
                            "color": "白色"
                        },
                        "mformat": {
                            "fid": 1,
                            "gid": 1,
                            "format": "300*300"
                        },
                        "name": "特价",
                        "price": 100.00,
                        "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                        "status": 0
                    }
                ],
                ...
            }
    
    ### <S> queryMpriceByGid

        通过商品ID获取价格信息
        
                |Requests:|
                :param mprice.mgoods.gid: 商品ID
        :type mprice.mgoods.gid: Long
        
        Example::
        
            {
                "mprice.mgoods.gid": 1
            }
        
                |Returns:|
                - **mprices**: 价格信息列表 , 每条数据类型 *mprice*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "mprices": [
                    {
                        "pid": 1,
                        "mgoods": {
                            "gid": 1,
                            "no": "XpKmAXSdXf",
                            "name": "品牌",
                            "barcode": "1283sXp35BsX5B237",
                            "title": "品牌商品标题",
                            "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                            "mbrand": {
                                "bid": 1,
                                "name": "品牌"
                            }
                        },
                        "mcolor": {
                            "cid": 1,
                            "gid": 1,
                            "color": "白色"
                        },
                        "mformat": {
                            "fid": 1,
                            "gid": 1,
                            "format": "300*300"
                        },
                        "name": "特价",
                        "price": 100.00,
                        "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                        "status": 0
                    }
                ],
                ...
            }
            
    ### <S-C> queryMpriceByPinyin

        通过商品名称拼音获取价格信息 , 支持模糊查询 , 状态为0(启用),2(热点)以及3(推荐)
        
                |Requests:|
                :param mprice.mgoods.pinyin: 拼音
        :type mprice.mgoods.pinyin: String
        
        Example::
        
            {
                "mprice.mgoods.pinyin": "品牌"
            }
            
                |Returns:|
                - **mprices**: 价格信息列表 , 每条数据类型 *mprice*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "mprices": [
                    {
                        "pid": 1,
                        "mgoods": {
                            "gid": 1,
                            "no": "XpKmAXSdXf",
                            "name": "品牌",
                            "barcode": "1283sXp35BsX5B237",
                            "title": "品牌商品标题",
                            "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                            "mbrand": {
                                "bid": 1,
                                "name": "品牌"
                            }
                        },
                        "mcolor": {
                            "cid": 1,
                            "gid": 1,
                            "color": "白色"
                        },
                        "mformat": {
                            "fid": 1,
                            "gid": 1,
                            "format": "300*300"
                        },
                        "name": "特价",
                        "price": 100.00,
                        "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
                    }
                ],
                ...
            }
            
    ### <S-C> queryMpriceForShow

        获取状态为2(热点)或3(推荐)的价格信息
        
        价格状态只能为2(热点)或3(推荐) , 其他状态不能够获取价格信息
        
                |Requests:|
                :param mprice.status: 状态
        :type mprice.status: Short
        
        Example::
        
            {
                "mprice.status": 2
            }
            
                |Returns:|
                - **mprices**: 价格信息列表 , 每条数据类型 *mprice*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "mprices": [
                    {
                        "pid": 1,
                        "mgoods": {
                            "gid": 1,
                            "no": "XpKmAXSdXf",
                            "name": "品牌",
                            "barcode": "1283sXp35BsX5B237",
                            "title": "品牌商品标题",
                            "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                            "mbrand": {
                                "bid": 1,
                                "name": "品牌"
                            }
                        },
                        "mcolor": {
                            "cid": 1,
                            "gid": 1,
                            "color": "白色"
                        },
                        "mformat": {
                            "fid": 1,
                            "gid": 1,
                            "format": "300*300"
                        },
                        "name": "特价",
                        "price": 100.00,
                        "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
                    }
                ],
                ...
            }
            
    ### <S> addMprice

        添加商品价格信息
        
        商品 , 商品颜色以及商品规格只能对应一个价格 , 价格如果存在 , 错误信息 **340014 商品-颜色-规格对应价格已存在**
        
                |Requests:|
                :param mprice.mgoods.gid: 商品ID
        :type mprice.mgoods.gid: Long
        :param mprice.mcolor.cid: 颜色ID
        :type mprice.mcolor.cid: Long
        :param mprice.mformat.fid: 规格ID
        :type mprice.mformat.fid: Long
        :param mprice.name: 名称
        :type mprice.name: String
        :param mprice.price: 价格
        :type mprice.price: Float
        :param mprice.img: 图片路径
        :type mprice.img: String
        
        Example::
        
            {
                "mprice.mgooids.gid": 1,
                "mprice.mcolor.cid": 1,
                "mprice.mformat.fid": 1,
                "mprice.name": "活动",
                "mprice.price": 100.00,
                "mprice.img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
            }
            
    ### <S> updateMpriceForStatus

        更新商品价格状态
        
                |Requests:|
                :param mprice.pid: 价格ID
        :type mprice.pid: Long
        :param mprice.status: 状态
        :type mprice.status: Short
        
        Example::
        
            {
                "mprice.pid": 1,
                "mprice.status": 0
            }
            
### 图片

## api.market.PictureAction

        |DataType:|
        #### picture

    - **pid**: 订单ID
      - 类型: *Long*
    - **gid**: 商品ID
      - 类型: *Long*
    - **img**: 图片路径
      - 类型: *String*
    - **type**: 类型 , 0: 轮播 , 1: 说明
      - 类型: *Short*
    - **sort**: 排序
      - 类型: *Short*

    ### <S> queryPictureByGid

        通过商品ID获取图片信息
        
                |Requests:|
                :param picture.gid: 商品ID
        :type picture.gid: Long
        
        Example::
        
            {
                "picture.gid": 1
            }
            
                |Returns:|
                - **pictures**: 图片信息列表 , 每条数据类型 *picture*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "pictures": [
                    {
                        "pid": 1,
                        "gid": 1,
                        "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                        "type": 0,
                        "sort": 0,
                        "status": 0
                    }
                ],
                ...
            }
            
    ### <S-C> queryPicture

        通过商品ID获取图片信息 , 状态为0(启用)
        
                |Requests:|
                :param picture.gid: 商品ID
        :type picture.gid: Long
        :param picture.type: 类型
        :type picture.type: Short
        
        Example::
        
            {
                "picture.gid": 1,
                "picture.type": 1
            }
            
                |Returns:|
                - **pictures**: 图片信息列表 , 每条数据类型 *picture*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "pictures": [
                    {
                        "pid": 1,
                        "gid": 1,
                        "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                        "type": 0,
                        "sort": 0,
                        "status": 0
                    }
                ],
                ...
            }
            
    ### <S> addPicture

        添加商品图片
        
                |Requests:|
                :param picture.gid: 商品ID
        :type picture.gid: Long
        :param picture.type: 类型
        :type picture.type: Short
        :param imgs[n]: 图片路径 , 每条数据类型 String
        :type imgs[n]: List
        
        Example::
        
            {
                "picture.gid": 1,
                "picture.type": 1,
                "imgs[n]": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
            }
            
    ### <S> updatePictureForSort

        更新图片排序
    
        判断商品图片是否存在 , 不存在 , 错误信息 **340008 图片信息不存在**
        
                |Requests:|
                :param picture.pid: 图片ID
        :type picture.pid: Long
        :param picture.sort: 排序
        :type picture.sort: Short
        
        Example::
        
            {
                "picture.pid": 1,
                "picture.sort": 1
            }
            
    ### <S> deletePicture

        删除图片
        
                |Requests:|
                :param picture.pid: 图片ID
        :type picture.pid: Long
        
        Example::
        
            {
                "picture.pid": 1
            }
            
### 用户

## api.market.MuserAction

        |DataType:|
        #### muser

    - **uid**: 价格ID
      - 类型: *Long*
    - **unionId**: 联合ID
      - 类型: *String*
    - **name**: 姓名
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **gender**: 性别 , 0: 女, 1: 男
      - 类型: *Short*
    - **birthday**: 生日
      - 类型: *String*
    
    ### <S> pageMuser

        分页方式获取用户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 用户信息列表 , 每条数据类型 *muser*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "uid": 1,
                            "unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                            "name": "用户",
                            "phone": "137xxxx2983",
                            "gender": 1,
                            "birthday": "2016-01-01"
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <S-C> queryMuserByUnionId

        通过联合ID获取用户信息
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        Example::
        
            {
                "muser.unionId": 1,
                "muser.status": 0
            }
            
                |Returns:|
                - **muser**: 用户信息 , 类型 *muser*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "muser": [
                    {
                        "uid": 1,
                        "unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                        "name": "用户",
                        "phone": "137xxxx2983",
                        "gender": 1,
                        "birthday": "2016-01-01"
                    }
                ],
                ...
            }
            
    ### <S-C> saveMuser

        添加或更新用户信息
        
        通过联合ID判断当前有无用户信息 , 存在更新 , 不存在创建
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        :param muser.name: 名称
        :type muser.name: String
        :param muser.phone: 电话
        :type muser.phone: String
        :param muser.gender: 性别
        :type muser.gender: Short
        :param muser.birthday: 生日
        :type muser.birthday: Date
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "muser.name": "用户",
                "muser.phone": "137xxxx2983",
                "muser.gender": 1,
                "muser.birthday": "2016-01-01"
            }

    ### <S-C> updateMuser

        更新用户信息
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        :param muser.name: 名称
        :type muser.name: String
        :param muser.phone: 电话
        :type muser.phone: String
        :param muser.gender: 性别
        :type muser.gender: Short
        :param muser.birthday: 生日
        :type muser.birthday: Date
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "muser.name": "用户",
                "muser.phone": "137xxxx2983",
                "muser.gender": 1,
                "muser.birthday": "2016-01-01"
            }
        
### 地址

## api.market.AddressAction

        |DataType:|
        #### address

    - **aid**: 地址ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Long*
    - **name**: 姓名
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **province**: 省份
      - 类型: *String*
    - **city**: 城市
      - 类型: *String*
    - **proper**: 城区
      - 类型: *String*
    - **address**: 地址
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 默认 , 2: 禁用
      - 类型: *Short*
    
    ### <S> queryAddressByUid

        通过用户ID获取地址信息
        
                |Requests:|
                :param address.uid: 用户ID
        :type address.uid: Long
        
        Example::
        
            {
                "address.uid": 1
            }
            
                |Returns:|
                - **addresses**: 地址信息列表 , 类型 *address*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "addresses":[
                    {
                        "aid": 1,
                        "uid": 1,
                        "name": "品牌",
                        "phone": "138xxxx7263",
                        "province": "辽宁",
                        "city": "沈阳",
                        "proper": "铁西",
                        "address": "兴华街30号",
                        "status": 0
                    },
                ]
                ...
            }
    
    ### <S-C> queryAddress

        通过用户联合ID获取地址信息 , 状态为0(启用)
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__"
            }
            
                |Returns:|
                - **addresses**: 地址信息列表 , 类型 *address*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "addresses":[
                    {
                        "aid": 1,
                        "name": "品牌",
                        "phone": "138xxxx7263",
                        "province": "辽宁",
                        "city": "沈阳",
                        "proper": "铁西",
                        "address": "兴华街30号",
                        "status": 0
                    },
                ]
                ...
            }
            
    ### <S-C> addAddress

        添加地址信息
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        :param address.name: 姓名
        :type address.name: String
        :param address.province: 省份
        :type address.province: String
        :param address.city: 城市
        :type address.city: String
        :param address.proper: 城区
        :type address.proper: String
        :param address.address: 地址
        :type address.address: String
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__"
                "address.name": "品牌",
                "address.province": "辽宁",
                "address.city": "沈阳",
                "address.proper": "铁西",
                "address.address": "兴华街30号"
            }
            
    ### <S-C> updateAddress

        更新地址信息
        
        判断地址是否存在 , 不存在 , 错误信息 **340010 地址不存在**
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断地址是否归属当前操作用户 , 不归属 , 错误信息 **340001 无操作权限**
        
        判断当前地址是否为操作用户归属地址
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        :param address.aid: 地址ID
        :type address.aid: Long
        :param address.name: 姓名
        :type address.name: String
        :param address.province: 省份
        :type address.province: String
        :param address.city: 城市
        :type address.city: String
        :param address.proper: 城区
        :type address.proper: String
        :param address.address: 地址
        :type address.address: String
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "address.aid": 1,
                "address.name": "品牌",
                "address.province": "辽宁",
                "address.city": "沈阳",
                "address.proper": "铁西",
                "address.address": "兴华街30号"
            }
            
    ### <S> updateAddressByAid

        更新地址信息
        
        判断地址是否存在 , 不存在 , 错误信息 **340010 地址不存在**
        
                |Requests:|
                :param address.aid: 地址ID
        :type address.aid: Long
        :param address.name: 姓名
        :type address.name: String
        :param address.province: 省份
        :type address.province: String
        :param address.city: 城市
        :type address.city: String
        :param address.proper: 城区
        :type address.proper: String
        :param address.address: 地址
        :type address.address: String
        
        Example::
        
            {
                "address.aid": 1,
                "address.name": "品牌",
                "address.province": "辽宁",
                "address.city": "沈阳",
                "address.proper": "铁西",
                "address.address": "兴华街30号"
            }
            
    ### <S-C> updateAddressForStatus

        更新地址状态
        
        判断地址是否存在 , 不存在 , 错误信息 **340010 地址不存在**
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断地址是否归属当前操作用户 , 不归属 , 错误信息 **340001 无操作权限**
        
        如更新状态为1(默认) , 需要控制当前默认地址数量为1个
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        :param address.aid: 地址ID
        :type address.aid: Long
        :param address.status: 状态
        :type address.status: Short
        
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "address.aid": 1,
                "address.status": 1
            }

### 购物车

## api.market.CartAction

        |DataType:|
        #### cart

    - **cid**: 购物车ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Long*
    - **mprice**: 商品价格 , 类型 [mprice](./store.html#api.store.MpriceAction.mprice)
      - 类型: *Object*
    - **num**: 数量
      - 类型: *Float*
    
    ### <S-C> pageCart

        分页方式获取购物车信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过联合ID获取归属的购物车信息
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 购物车信息列表 , 每条数据类型 *cart*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "mprice": {
                                "pid": 1,
                                "mgoods": {
                                    "gid": 1,
                                    "no": "XpKmAXSdXf",
                                    "name": "品牌",
                                    "barcode": "1283sXp35BsX5B237",
                                    "title": "品牌商品标题",
                                    "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                                    "mbrand": {
                                        "bid": 1,
                                        "name": "品牌"
                                    }
                                },
                                "mcolor": {
                                    "cid": 1,
                                    "gid": 1,
                                    "color": "白色"
                                },
                                "mformat": {
                                    "fid": 1,
                                    "gid": 1,
                                    "format": "300*300"
                                },
                                "name": "特价",
                                "price": 100.00,
                                "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
                            },
                            "num": 1.0
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <S-C> queryCartByUnionId

        通过联合ID获取购物车信息
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
            }
            
                |Returns:|
                - **carts**: 购物车信息列表 , 类型 *cart*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "carts":[
                    {
                        "cid": 1,
                        "mprice": {
                            "pid": 1,
                            "mgoods": {
                                "gid": 1,
                                "no": "XpKmAXSdXf",
                                "name": "品牌",
                                "barcode": "1283sXp35BsX5B237",
                                "title": "品牌商品标题",
                                "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                                "mbrand": {
                                    "bid": 1,
                                    "name": "品牌"
                                }
                            },
                            "mcolor": {
                                "cid": 1,
                                "gid": 1,
                                "color": "白色"
                            },
                            "mformat": {
                                "fid": 1,
                                "gid": 1,
                                "format": "300*300"
                            },
                            "name": "特价",
                            "price": 100.00,
                            "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
                        },
                        "num": 1.0
                    },
                ]
                ...
            }
            
    ### <S-C> addCart

        添加购物车商品价格
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        :param cart.mprice.pid: 价格ID
        :type cart.mprice.pid: Long
        :param cart.num: 数量
        :type cart.num: Float
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "cart.mprice.pid": 1,
                "cart.num": 1.0
            }
            
    ### <S-C> updateCart

        更新购物车商品价格数量
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断购物车商品价格是否存在 , 不存在 , 错误信息 **340011 购物车商品不存在**
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        :param cart.cid: 购物车ID
        :type cart.cid: Long
        :param cart.num: 数量
        :type cart.num: Float
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "cart.mprice.pid": 1,
                "cart.num": 1.0
            }
            
    ### <S-C> clearCart

        清空购物车
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        :param cids[n]: 购物车ID列表 , 每条数据类型 Long
        :type cids[n]: List
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "cids[0]": 1,
                "cids[1]": 2
            }
            
### 订单

## api.market.MorderAction

        |DataType:|
        #### morder

    - **oid**: 订单ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **muser**: 用户 , 类型 [muser](./store.html#api.store.MuserAction.muser)
      - 类型: *Object*
    - **address**: 地址 , 类型 [address](./store.html#api.store.AddressAction.address)
      - 类型: *Object*
    - **total**: 总额
      - 类型: *Float*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **payTime**: 付款时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 待付款 , 1: 待发货 , 2: 已发货 , 3: 待评价 , 4: 退货/售后 , 5: 删除
      - 类型: *Short*
    - **items**: 订单项列表 , 额米条数据类型 *morderItem*
      - 类型: *List*
    
    #### morderItem

    - **oiid**: 订单项ID
      - 类型: *Long*
    - **oid**: 订单ID
      - 类型: *Long*
    - **mprice**: 商品价格 , 类型 [mprice](./store.html#api.store.MpriceAction.mprice)
      - 类型: *Object*
    - **num**: 数量
      - 类型: *Float*

    ### <S> pageMorder

        分页方式获取订单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 订单列表 , 每条数据类型 *morder*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "oid": 1,
                            "no": "S1801010001",
                            "muser": {
                                "uid": 1,
                                "unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                                "name": "用户",
                                "phone": "137xxxx2983",
                                "gender": 1,
                                "birthday": "2016-01-01"
                            },
                            "address": {
                                "aid": 1,
                                "name": "品牌",
                                "phone": "138xxxx7263",
                                "province": "辽宁",
                                "city": "沈阳",
                                "proper": "铁西",
                                "address": "兴华街30号",
                            },
                            "total": 100.00,
                            "createTime": "2018-01-01 00:00:00",
                            "payTime": null,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <S-C> queryMorderByUnionId

        通过联合ID获取归属用户的订单信息
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
                |Requests:|
                :param morder.muser.unionId: 联合ID
        :type morder.muser.unionId: String
        :param morder.status: 状态
        :type morder.status: Short
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__"
            }
            
                |Returns:|
                - **morders**: 订单列表 , 每条数据类型 *morder*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "morders": [
                    {
                        "oid": 1,
                        "no": "S1801010001",
                        "address": {
                            "aid": 1,
                            "name": "品牌",
                            "phone": "138xxxx7263",
                            "province": "辽宁",
                            "city": "沈阳",
                            "proper": "铁西",
                            "address": "兴华街30号",
                        },
                        "total": 100.00,
                        "createTime": "2018-01-01 00:00:00",
                        "payTime": null,
                        "status": 0,
                        "items": [
                            {
                                "oiid": 1,
                                "oid": 1,
                                "mprice": {
                                    "pid": 1,
                                    "mgoods": {
                                        "gid": 1,
                                        "no": "XpKmAXSdXf",
                                        "name": "品牌",
                                        "barcode": "1283sXp35BsX5B237",
                                        "title": "品牌商品标题",
                                        "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                                        "mbrand": {
                                            "bid": 1,
                                            "name": "品牌"
                                        }
                                    },
                                    "mcolor": {
                                        "cid": 1,
                                        "gid": 1,
                                        "color": "白色"
                                    },
                                    "mformat": {
                                        "fid": 1,
                                        "gid": 1,
                                        "format": "300*300"
                                    },
                                    "name": "特价",
                                    "price": 100.00,
                                    "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
                                },
                                "num": 1
                            }
                        ]
                    }
                ],
                ...
            }
            
    ### <S> queryMorderItemByOid

        通过订单ID获取订单项
        
                |Requests:|
                :param morder.oid: 订单ID
        :type morder.oid: Long
        
        Example::
        
            {
                "morder.oid": 1
            }
            
                |Returns:|
                - **morderItems**: 订单项列表 , 每条数据类型 *morderItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "morderItems": [
                    {
                        "oiid": 1,
                        "oid": 1,
                        "mprice": {
                            "pid": 1,
                            "mgoods": {
                                "gid": 1,
                                "no": "XpKmAXSdXf",
                                "name": "品牌",
                                "barcode": "1283sXp35BsX5B237",
                                "title": "品牌商品标题",
                                "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                                "mbrand": {
                                    "bid": 1,
                                    "name": "品牌"
                                }
                            },
                            "mcolor": {
                                "cid": 1,
                                "gid": 1,
                                "color": "白色"
                            },
                            "mformat": {
                                "fid": 1,
                                "gid": 1,
                                "format": "300*300"
                            },
                            "name": "特价",
                            "price": 100.00,
                            "img": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
                        },
                        "num": 1
                    }
                ]
                ...
            }
            
    ### <S-C> addMorder

        添加订单
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        添加方式分为两种 , 直接通过商品对应的价格添加订单 , 另外是他通过购物车商品对应价格添加订单
        
        通过购物车商品对应价格添加订单之后 , 删除购物车对应的商品价格
        
        两种添加方式不能同时进行
        
                |Requests:|
                :param morder.muser.unionId: 联合ID
        :type morder.muser.unionId: String
        :param morder.address.aid: 地址ID
        :type morder.address.aid: Long
        :param morderItem[n].mprice.pid: 价格ID
        :type morderItem[n].mprice.pid: Long
        :param morderItem[n].num: 数量
        :type morderItem[n].num: Float
        
        :param cids[n]: 购物车ID
        :type cids[n]: Long
        
        Example::
        
            {
                "morder.muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "morder.address.aid": 1,
                "morderItem[0].mprice.pid": 0,
                "morderItem[0].num": 10
            }
            
        OR::
            
            {
                "morder.muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "morder.address.aid": 1,
                "cids[0]": 1
            }
            
    ### <S-C> updateMorder

        .. warning::
        
            保留意见 , 提供用户使用的按照更新状态功能拆分 , 或在添加评价同时更新订单状态
    
        更新订单状态 , 可更新状态为1(待发货), 2(已发货), 3(待评价)
        
        状态更新控制 , 0(待付款)->1(待发货) , 1(待发货)->2(已发货) , 2(已发货)->3(待评价)
        
        判断订单是否存在 , 不存在 , 错误信息 **340012 订单不存在**
        
        更新状态不符合控制规则 ,  错误信息 **340013 订单状态不可操作**
        
                |Requests:|
                :param morder.oid: 订单ID
        :type morder.oid: Long
        :param morder.status: 状态
        :type morder.status: Short
        
        Example::
        
            {
                "morder.oid": 1,
                "morder.status": 1
            }
            
    ### <S> updateMorderForStatus

        更新订单状态 , 可更新状态为1(待发货), 2(已发货), 3(待评价)
        
        状态更新控制 , 0(待付款)->1(待发货) , 1(待发货)->2(已发货) , 2(已发货)->3(待评价)
        
        判断订单是否存在 , 不存在 , 错误信息 **340012 订单不存在**
        
        更新状态不符合控制规则 ,  错误信息 **340013 订单状态不可操作**
        
                |Requests:|
                :param morder.oid: 订单ID
        :type morder.oid: Long
        :param morder.status: 状态
        :type morder.status: Short
        
        Example::
        
            {
                "morder.oid": 1,
                "morder.status": 1
            }
            
    ### <S-C> deleteMorder

        删除订单 , 订单状态为0(待付款)可删除
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断订单是否归属当前操作用户 , 不归属 , 错误信息 **340001 无操作权限**
        
        判断订单状态是否为0(待付款) , 其他状态不可操作 , 错误信息 **340013 订单状态不可操作**
        
                |Requests:|
                :param morder.muser.unionId: 联合ID
        :type morder.muser.unionId: String
        :param morder.oid: 订单ID
        :type morder.oid: Long
        
        Example::
        
            {
                "morder.muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "morder.oid": 1
            }
            
### 评价

## api.market.EvaluateAction

        |DataType:|
        #### evaluate

    - **eid**: 评价ID
      - 类型: *Long*
    - **oid**: 订单ID
      - 类型: *Long*
    - **gid**: 商品ID
      - 类型: *Long*
    - **pid**: 价格ID
      - 类型: *Long*
    - **unionId**: 联合ID
      - 类型: *String*
    - **name**: 用户名
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **score**: 评分 , 1: 好评 , 2: 中评 , 3: 差评
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    - **discribeRate**: 商品评分 , 范围1-5
      - 类型: *Short*
    - **logisticsRate**: 物流评分 , 范围1-5
      - 类型: *Short*
    - **serviceRate**: 服务评分 , 范围1-5
      - 类型: *Short*
    - **imgs**: 图片路径 , 多张图片路径拼接
      - 类型: *String*
    
    ### <S-C> pageEvaluate

        分页方式获取评价信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 评价列表 , 每条数据类型 *evaluate*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "eid": 1,
                            "oid": 1,
                            "gid": 1,
                            "pid": 1,
                            "unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                            "name": "用户名",
                            "createTime": "2016-01-01 00:00:00",
                            "score": 1,
                            "comment": "说明",
                            "discribeRate": 5,
                            "logisticsRate": 5,
                            "serviceRate": 5,
                            "imgs": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg,wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <S-C> addEvaluate

        添加评价信息
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断订单是否存在 , 不存在 , 错误信息 **340012, 订单不存在**
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        :param morder.oid: 订单ID
        :type morder.oid: Long
        :param evaluate[n].pid: 价格ID
        :type evaluate[n].pid: Long
        :param evaluate[n].score: 评分
        :type evaluate[n].score: Short
        :param evaluate[n].comment: 说明
        :type evaluate[n].comment: String
        :param evaluate[n].discribeRate: 商品评价
        :type evaluate[n].discribeRate: Short
        :param evaluate[n].logisticsRate: 物流评价
        :type evaluate[n].logisticsRate: Short
        :param evaluate[n].serviceRate: 服务评价
        :type evaluate[n].serviceRate: Short
        :param evaluate[n].imgs: 图片路径
        :type evaluate[n].imgs: String
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "morder.oid": 1,
                "evaluate[0].pid": 1,
                "evaluate[0].score": 1,
                "evaluate[0].comment": "说明",
                "evaluate[0].discribeRate": "说明",
                "evaluate[0].logisticsRate": "说明",
                "evaluate[0].serviceRate": "说明",
                "evaluate[0].imgs": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg,wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
            }

### 款项

## api.market.MpaymentAction

        |DataType:|
        #### mpayment

    - **mpid**: 款项ID
      - 类型: *Long*
    - **morder**: 订单 , 类型 [morder](./store.html#api.store.MorderAction.morder)
      - 类型: *Object*
    - **totalPrice**: 总价
      - 类型: *Float*
    - **type**: 类型 , 0: 微信
      - 类型: *Short*
    - **status**: 状态 , 0: 未付 , 1: 已付 , 2: 取消
      - 类型: *Short*

    ### <S-C> addMpayment

        添加款项信息
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断订单是否存在 , 不存在 , 错误信息 **340012, 订单不存在**
        
        判断订单是否归属当前操作用户 , 不归属 , 错误信息 **340001 无操作权限**
        
        提供线上成功付款之后 , 生成订单对应的款项信息 , 款项状态为1(已付)
        
        更新订单状态为1(待发货)
        
                |Requests:|
                :param muser.unionId: 联合ID
        :type muser.unionId: String
        :param morder.oid: 订单ID
        :type morder.oid: Long
        :param mpayment.type: 类型
        :type mpayment.type: Short
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "morder.oid": 1,
                "mpayment.type": 0
            }
            
### 优惠券

## api.market.Coupon

        |DataType:|
        #### coupon

    - **cid**: 券ID
      - 类型: *Long*
    - **mgoods**: 商品 , 类型 [mgoods](./store.html#api.store.MgoodsAction.mgoods)
      - 类型: *Object*
    - **title**: 标题
      - 类型: *String*
    - **value**: 金额
      - 类型: *Float*
    - **type**: 类型 , 0: 减免 , 1: 折扣
      - 类型: *Short*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    
    ### <S> pageCoupon

        分页方式获取优惠券 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 优惠券列表 , 每条数据类型 *coupon*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "mgoods": {
                                "gid": 1,
                                "no": "XpKmAXSdXf",
                                "name": "品牌",
                                "barcode": "1283sXp35BsX5B237",
                                "title": "品牌商品标题",
                                "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                            },
                            "title": "优惠券说明信息",
                            "value": 100,
                            "type": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <S> queryCouponByCid

        通过优惠券ID获取优惠券信息
        
                |Requests:|
                :param coupon.cid: 券ID
        :type coupon.cid: Long
        
        Example::
        
            {
                "coupon.cid": 1
            }
            
                |Returns:|
                - **coupon**: 优惠券信息 , 类型 *coupon*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "coupon": {
                    "cid": 1,
                    "mgoods": {
                        "gid": 1,
                        "no": "XpKmAXSdXf",
                        "name": "品牌",
                        "barcode": "1283sXp35BsX5B237",
                        "title": "品牌商品标题",
                        "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                    },
                    "title": "优惠券说明信息",
                    "value": 100,
                    "type": 0,
                    "status": 0
                }
                ...
            }
    
    ### <S> addCoupon

        创建优惠券
        
                |Requests:|
                :param coupon.mgoods.gid: 商品ID
        :type coupon.mgoods.gid: Long
        :param coupon.title: 标题
        :type coupon.title: String
        :param coupon.value: 券值
        :type coupon.value: Float
        :param coupon.type: 类型
        :type coupon.type: Short
        
        Example::
        
            {
                "coupon.mgoods.gid": 1,
                "coupon.title": "优惠券说明信息",
                "coupon.value": 100,
                "coupon.type": 0
            }
            
    ### <S> updateCoupon

        更新优惠券
        
        判断优惠券是否存在 , 不存在 , 错误信息 **340017 券不存在**
        
                |Requests:|
                :param coupon.cid: 券ID
        :type coupon.cid: Long
        :param coupon.mgoods.gid: 商品ID
        :type coupon.mgoods.gid: Long
        :param coupon.title: 标题
        :type coupon.title: String
        :param coupon.value: 券值
        :type coupon.value: Float
        :param coupon.type: 类型
        :type coupon.type: Short
        
        Example::
        
            {
                "coupon.cid": 1,
                "coupon.mgoods.gid": 1,
                "coupon.title": "优惠券说明信息",
                "coupon.value": 100,
                "coupon.type": 0
            }
            
    ### <S> updateCouponForStatus

        更新优惠券状态
        
        判断优惠券是否存在 , 不存在 , 错误信息 **340017 券不存在**
        
                |Requests:|
                :param coupon.cid: 券ID
        :type coupon.cid: Long
        :param coupon.status: 状态
        :type coupon.status: Short
        
        Example::
        
            {
                "coupon.cid": 1,
                "coupon.status": 0
            }
    
    #### muserCoupon

    - **ucid**: ID
      - 类型: *Long*
    - **coupon**: 优惠券 , 类型 [coupon](./store.html#api.store.CouponAction.coupon)
      - 类型: *Object*
    - **unionId**: 联合ID
      - 类型: *String*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    
    ### <S-C> pageMuserCoupon

        分页方式获取联合ID对应的优惠券信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 优惠券列表 , 每条数据类型 *muserCoupon*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "ucid": 1,
                            "coupon": {
                                "cid": 1,
                                "mgoods": {
                                    "gid": 1,
                                    "no": "XpKmAXSdXf",
                                    "name": "品牌",
                                    "barcode": "1283sXp35BsX5B237",
                                    "title": "品牌商品标题",
                                    "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                                },
                                "title": "优惠券说明信息",
                                "value": 100,
                                "type": 0,
                                "status": 0
                            },
                            "unionId": "JF2IMDFIU2J-23J23I2J318785J45I6HHJ"
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <S-C> queryMuserCouponByUnionId

        通过联合ID获取归属的优惠券信息 , 优惠券状态为0(有效)
        
                |Requests:|
                :param muserCoupon.unionId: 联合ID
        :type muserCoupon.unionId: String
        
        Example::
        
            {
                "muserCoupon.unionId": "JF2IMDFIU2J-23J23I2J318785J45I6HHJ"
            }
            
                |Returns:|
                - **muserCoupon**: 优惠券信息 , 类型 *coupon*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "muserCoupon": {
                    "ucid": 1,
                    "coupon": {
                        "cid": 1,
                        "mgoods": {
                            "gid": 1,
                            "no": "XpKmAXSdXf",
                            "name": "品牌",
                            "barcode": "1283sXp35BsX5B237",
                            "title": "品牌商品标题",
                            "defaultImg": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg",
                        },
                        "title": "优惠券说明信息",
                        "value": 100,
                        "type": 0,
                        "status": 0
                    },
                    "unionId": "JF2IMDFIU2J-23J23I2J318785J45I6HHJ"
                }
                ...
            }
            
    ### <S-C> addMuserCoupon

        添加关联的优惠券信息
        
                |Requests:|
                :param muserCoupon.unionId: 联合ID
        :type muserCoupon.unionId: String
        :param muserCoupon.coupon.cid: 券ID
        :type muserCoupon.coupon.cid: Long
        
        Example::
        
            {
                "muserCoupon.unionId": "JF2IMDFIU2J-23J23I2J318785J45I6HHJ",
                "muserCoupon.coupon.cid": 1
            }

## 站点

### 名片

## api.market.CardAction

        |DataType:|
        #### cardPhoto

    - **cpid**: 图片ID
      - 类型: *Long*
    - **caid**: 名片ID
      - 类型: *Long*
    - **url**: 路径
      - 类型: *String*

    #### card

    - **caid**: 名片ID
      - 类型: *Long*
    - **cuser**: 用户
      - 类型: *Object*
    - **userPhoto**: 头像
      - 类型: *String*
    - **userName**: 姓名
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **wechat**: 微信
      - 类型: *String*
    - **industry**: 行业
      - 类型: *String*
    - **profession**: 职业
      - 类型: *String*
    - **address**: 地址
      - 类型: *String*
    - **info**: 简介
      - 类型: *String*

    ### <I> pageCard

        分页方式获取名片信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 名片信息列表 , 每条数据类型 *card*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    "data": [
                        {
                            "address": "辽宁省沈阳",
                            "caid": 1,
                            "cuser": {
                                        "cuid": 1,
                                        "unionId":"osRqw_b6cAUY1n2YT4AIHlWYYzM"
                                    }
                            "industry": "软件开发",
                            "info": "啦啦啦",
                            "phone": "13555829460",
                            "profession": "工程师",
                            "userName": "杨大萌",
                            "userPhoto": "group1/M00/19/F0/wKgFZ1vtGOyAIxpAAACSUCN2Ebs818.jpg",
                            "wechat": "13555824960"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I-C> queryCardPhotoByCaid

        通过名片Id获取名片图片
		
                |Requests:|
                :param cardPhoto.caid: 名片Id
        :type cardPhoto.caid: Long

        Example::

            {
                "cardPhoto.caid": 1
            }
		
                |Returns:|
                - **cardPhotos**: 图片信息列表 , 每条数据类型 *cardPhoto*
          - 类型: *List*

        Example::

            {
                ...
                "cardPhotos": [
                    {
                        "cpid": 1,
                        "caid": 1,
                        "url": "wKgFZlsXpKmAXp5BAAD-XSdXfWk559.jpg"
                    }
                ],
                ...
            }

    ### <I-C> queryCardByCuid

        通过用户id获取名片信息
		
                |Requests:|
                :param card.cuser.cuid: 用户ID
        :type card.cuser.cuid: Long
		
        Example::
        
            {
                "card.cuser.cuid": 1
            }
		
                |Returns:|
                - **card**: 名片信息列表 , 每条数据类型 *card*
          - 类型: *Object*
		
        Example::
        
            {
                ...
                "card": [
                    {
                        "address": "辽宁省沈阳",
                        "caid": 1,
                        "cuser": {
                                    "cuid": 1,
                                    "unionId":"osRqw_b6cAUY1n2YT4AIHlWYYzM"
                                 }
                        "industry": "软件开发",
                        "info": "啦啦啦",
                        "phone": "13555829460",
                        "profession": "工程师",
                        "userName": "杨大萌",
                        "userPhoto": "group1/M00/19/F0/wKgFZ1vtGOyAIxpAAACSUCN2Ebs818.jpg",
                        "wechat": "13555824960"
                    }
                ],
                ...
            }
			
    ### <I> deleteCard

        删除名片
		
                |Requests:|
                :param card.caid: 图片ID
        :type card.caid: Long
		
        Example::

            {
                "card.caid":1
            }

    ### <I-C> addCard

        添加名片信息

                |Requests:|
                :param card.name: 姓名
        :type card.name: String
        :param card.phone: 电话
        :type card.phone: String

        Example::

            {
                "card.name": "李磊",
                "card.phone": "13322331144"
            }
		
    ### <I-C> updateCard

        更新名片信息

                |Requests:|
                :param card.caid: 名片ID
        :type card.caid: Long
        :param card.name: 姓名
        :type card.name: String
        :param card.phone: 电话
        :type card.phone: String

        Example::

            {
                "card.caid":1,
                "card.name": "李磊",
                "card.phone": "13322331144"
            }
		
    ### <I-C> addCardPhoto

        添加名片图片

                |Requests:|
                :param cardPhotos[n].path: 图片路径
        :type cardPhotos[n].path: List

        Example::

            {
                "cardPhotos[0].path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
            }

    ### <I-C> deleteCardPhoto

        删除名片图片

                |Requests:|
                :param cardPhoto.cpid: 图片ID
        :type cardPhoto.cpid: Long

        Example::

            {
                "cardPhoto.cpid":1
            }

### 案例

## api.market.EcaseAction

        |DataType:|
        #### ecase

    - **cid**: 案例ID
      - 类型: *Long*
    - **cityId**: 城市ID
      - 类型: *Long*
    - **villageName**: 楼盘名称
      - 类型: *String*
    - **designer**: 设计师
      - 类型: *Object*
    - **supervisor**: 监理
      - 类型: *Object*
    - **style**: 风格
      - 类型: *String*
    - **type**: 类型 , 0: 效果图 , 1: 施工图
      - 类型: *Short*
    - **houseType**: 户型
      - 类型: *String*
    - **area**: 面积
      - 类型: *Float*
    - **cycle**: 施工周期
      - 类型: *Short*
    - **defaultUrl**: 默认图片
      - 类型: *String*
    - **status**: 状态 , 0: 不显示 , 1: 显示
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
	
    #### cuser

    - **cuid**: 用户ID
      - 类型: *Long*
    - **unionId**: 联合ID
      - 类型: *String*
	
    ### <I-C> pageEcase

        分页方式获取案例信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
		
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 案例信息列表 , 每条数据类型 *ecase*
        :type paging.data: List
		
        Example::
        
            {
                ...
                "paging": {
                    "data": [
                        {
                            "area": 124,
                            "cid": 1,
                            "cityId": 3,
                            "cycle": 2,
                            "comment": "这还是一个测试12",
                            "defaultUrl": "group1/M00/14/FD/wKgFZ1uHQFqAIluRAAKa-OdpucA910.jpg",
                            "houseType": "三室两厅",
                            "status": 0,
                            "style": "欧式简装"
                            "supervisor": {
                                "cuid": 1,
                                "unionId":"osRqw_b6cAUY1n2YT4AIHlWYYzM"
                            }
                            "industry": "软件开发",
                            "info": "啦啦啦",
                            "phone": "13555829460",
                            "profession": "工程师",
                            "userName": "杨大萌",
                            "userPhoto": "group1/M00/19/F0/wKgFZ1vtGOyAIxpAAACSUCN2Ebs818.jpg",
                            "wechat": "13555824960"
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> addEcase

        增加案例信息

                |Requests:|
                :param ecase.cityId: 城市ID
        :type ecase.cityId: Long
        :param ecase.villageName: 楼盘名称
        :type ecase.villageName: String
        :param ecase.designer.euid: 设计师ID
        :type ecase.designer.euid: Long
        :param ecase.supervisor.euid: 监理ID
        :type ecase.supervisor.euid: String
        :param ecase.style: 风格
        :type ecase.style: String
        :param ecase.type: 类型
        :type ecase.type: Short
        :param ecase.houseType: 户型
        :type ecase.houseType: String
        :param ecase.area: 面积
        :type ecase.area: Float
        :param ecase.cycle: 施工周期
        :type ecase.cycle: Short
        :param ecase.comment: 说明
        :type ecase.comment: String

        Example::

            {
                "ecase.cityId": 11,
                "ecase.villageName": "锦衣月",
                "ecase.designer.euid": 31,
                "ecase.supervisor.euid": 35,
                "ecase.style": "江月",
                "ecase.type": 0,
                "ecase.houseType": "三室两厅",
                "ecase.area": 155,
                "ecase.cycle": 0,
                "ecase.comment": "测试"
            }
		
    ### <I> updateEcase

        修改案例信息

                |Requests:|
                :param ecase.cityId: 城市ID
        :type ecase.cityId: Long
        :param ecase.villageName: 楼盘名称
        :type ecase.villageName: String
        :param ecase.designer.euid: 设计师ID
        :type ecase.designer.euid: Long
        :param ecase.supervisor.euid: 监理ID
        :type ecase.supervisor.euid: String
        :param ecase.style: 风格
        :type ecase.style: String
        :param ecase.type: 类型
        :type ecase.type: Short
        :param ecase.houseType: 户型
        :type ecase.houseType: String
        :param ecase.area: 面积
        :type ecase.area: Float
        :param ecase.cycle: 施工周期
        :type ecase.cycle: Short
        :param ecase.comment: 说明
        :type ecase.comment: String
        :param ecase.cid: 案例Id
        :type ecase.cid: Long

        Example::

            {
                "ecase.cityId": 11,
                "ecase.villageName": "锦衣月",
                "ecase.designer.euid": 31,
                "ecase.supervisor.euid": 35,
                "ecase.style": "江月",
                "ecase.type": 0,
                "ecase.houseType": "三室两厅",
                "ecase.area": 155,
                "ecase.cycle": 0,
                "ecase.comment": "测试",
                "ecase.cid":141
            }

    ### <I> updateEcaseForStatus

        更改案例状态

                |Requests:|
                :param ecase.cid: 案例ID
        :type ecase.cid: Long
        :param ecase.status: 状态
        :type ecase.status: Short

        Example::

            {
                "ecase.cid": 11,
                "ecase.status":1
            }
            
    ### <I-C> queryEcase

        分页方式获取案例信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
		
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 案例信息列表 , 每条数据类型 *ecase*
        :type paging.data: List
		
        Example::
        
            {
                ...
                "paging": {
                    "data": [
                        {
                            "area": 124,
                            "cid": 1,
                            "cityId": 3,
                            "cycle": 2,
                            "comment": "这还是一个测试12",
                            "defaultUrl": "group1/M00/14/FD/wKgFZ1uHQFqAIluRAAKa-OdpucA910.jpg",
                            "houseType": "三室两厅",
                            "status": 0,
                            "style": "欧式简装"
                            "supervisor": {
                                "cuid": 1,
                                "unionId":"osRqw_b6cAUY1n2YT4AIHlWYYzM"
                            }
                            "industry": "软件开发",
                            "info": "啦啦啦",
                            "phone": "13555829460",
                            "profession": "工程师",
                            "userName": "杨大萌",
                            "userPhoto": "group1/M00/19/F0/wKgFZ1vtGOyAIxpAAACSUCN2Ebs818.jpg",
                            "wechat": "13555824960"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I-C> queryEcaseByCid

        通过案例Id查询案例

                |Requests:|
                :param ecase.cid: 名片ID
        :type ecase.cid: Long

        Example::

            {
                "ecase.cid": 11
            }

                |Returns:|
                - **ecase**: 案例信息列表 , 每条数据类型 *ecase*
          - 类型: *Object*

        Example::

            {
                ...
                "ecase": [
                    {
                        "area": 124,
                        "cid": 1,
                        "cityId": 3,
                        "cycle": 2,
                        "comment": "这还是一个测试12",
                        "defaultUrl": "group1/M00/14/FD/wKgFZ1uHQFqAIluRAAKa-OdpucA910.jpg",
                        "houseType": "三室两厅",
                        "status": 0,
                        "style": "欧式简装"
                        "supervisor": {
                            "cuid": 1,
                            "unionId":"osRqw_b6cAUY1n2YT4AIHlWYYzM"
                        }
                        "industry": "软件开发",
                        "info": "啦啦啦",
                        "phone": "13555829460",
                        "profession": "工程师",
                        "userName": "杨大萌",
                        "userPhoto": "group1/M00/19/F0/wKgFZ1vtGOyAIxpAAACSUCN2Ebs818.jpg",
                        "wechat": "13555824960"
                    }
                ],
                ...
            }
		
    ### <I-C> queryEcaseByTypeAndStatus

        通过城市Id获取案例信息
		
                |Requests:|
                :param ecase.cityId: 案例ID
        :type ecase.cityId: Long
        :param ecase.status: 状态
        :type ecase.status: Short
        :param ecase.type: 类型
        :type ecase.type: Short
		
        Example::
		
            {
                "ecase.cityId": 11,
                "ecase.status": 1,
                "ecase.type": 0,
            }
		
                |Returns:|
                - **cases**: 案例信息列表 , 每条数据类型 *ecase*
          - 类型: *List*
		
        Example::
        
            {
                ...
                "ecase": [
                    {
                        "area": 124,
                        "cid": 1,
                        "cityId": 3,
                        "cycle": 2,
                        "comment": "这还是一个测试12",
                        "defaultUrl": "group1/M00/14/FD/wKgFZ1uHQFqAIluRAAKa-OdpucA910.jpg",
                        "houseType": "三室两厅",
                        "status": 0,
                        "style": "欧式简装"
                        "supervisor": {
                            "cuid": 1,
                            "unionId":"osRqw_b6cAUY1n2YT4AIHlWYYzM"
                        }
                        "industry": "软件开发",
                        "info": "啦啦啦",
                        "phone": "13555829460",
                        "profession": "工程师",
                        "userName": "杨大萌",
                        "userPhoto": "group1/M00/19/F0/wKgFZ1vtGOyAIxpAAACSUCN2Ebs818.jpg",
                        "wechat": "13555824960"
                    }
                ],
                ...
            }
            
    ### <I-C> deleteEcase

        删除案例
        
                |Requests:|
                :param ecase.ecid: 案例ID
        :type ecase.ecid: Long
		
        Example::
		
            {
                "ecase.ecid": 1
            }

### 城市

## api.market.EcityAction

        |DataType:|
        #### ecity

    - **ecid**: 城市ID
      - 类型: *Long*
    - **city**: 城市名称
      - 类型: *String*
    - **pinyin**: 城市名称拼音
      - 类型: *String*
    - **x**: 经度
      - 类型: *Double*
    - **y**: 纬度
      - 类型: *Double*
	
    ### <I> pageEcity

        分页方式获取城市信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 城市信息列表 , 每条数据类型 *city*
        :type paging.data: List

        Example::

            {
                ...
                "paging": {
                    "data": [
                        {
                            "city": "沈阳", 
                            "ecid": 1, 
                            "pinyin": "shenyang", 
                            "x": 123.25, 
                            "y": 41.48
                        }
                    ],
                    ...
                },
                ...
            }
	
    ### <I> queryEcity

        查询城市信息

                |Returns:|
                - **ecitys**: 城市信息列表 , 每条数据类型 *ecity*
          - 类型: *List*

        Example::

            {
                ...
                "ecitys": [
                    {
                        "city": "沈阳", 
                        "ecid": 1, 
                        "pinyin": "shenyang", 
                        "x": 123.25, 
                        "y": 41.48
                    }
                ],
                ...
            }

    ### <I> queryEcityByPinYin

        通过拼音查询城市

                |Requests:|
                :param ecity.pinyin: 拼音
        :type ecity.pinyin: String

        Example::

            {
                "ecity.pinyin": "沈阳"
            }

                |Returns:|
                - **ecitys**: 城市信息列表 , 每条数据类型 *ecity*
          - 类型: *List*

        Example::

            {
                ...
                "ecitys": [
                    {
                        "city": "沈阳", 
                        "ecid": 1, 
                        "pinyin": "shenyang", 
                        "x": 123.25, 
                        "y": 41.48
                    }
                ],
                ...
            }

    ### <I> addEcity

        增加城市信息

                |Requests:|
                :param ecity.city: 城市
        :type ecity.city: String
        :param ecity.x: 经度
        :type ecity.x: Double
        :param ecity.y: 纬度
        :type ecity.y: Double

        Example::

            {
                "ecity.city": "沈阳", 
                "ecity.x": 123.25, 
                "ecity.y": 41.48
            }
            
    ### <I> updateEcity

        更新城市信息

                |Requests:|
                :param ecity.ecid: 城市ID
        :type ecity.ecid: Long
        :param ecity.city: 城市
        :type ecity.city: String
        :param ecity.x: 经度
        :type ecity.x: Double
        :param ecity.y: 纬度
        :type ecity.y: Double

        Example::

            {
                "ecity.ecid": 1,
                "ecity.city": "沈阳", 
                "ecity.x": 123.25, 
                "ecity.y": 41.48
            }
			
    ### <I-C> queryEcityByXandY

        通过经纬度查询城市信息

                |Requests:|
                :param ecity.x: 经度
        :type ecity.x: Double
        :param ecity.y: 纬度
        :type ecity.y: Double

        Example::

            {
                "ecity.x": 123.25, 
                "ecity.y": 41.48
            }

                |Returns:|
                - **ecity**: 城市信息列表 , 每条数据类型 *ecity*
          - 类型: *Object*

        Example::

            {
                ...
                "ecity": [
                    {
                        "city": "沈阳", 
                        "ecid": 1, 
                        "pinyin": "shenyang", 
                        "x": 123.25, 
                        "y": 41.48
                    }
                ],
                ...
            }

### 客户

## api.market.EcustomerAction

        |DataType:|
        #### ecustomer

    - **ecid**: 客户ID
      - 类型: *Long*
    - **cityId**: 城市ID
      - 类型: *Long*
    - **name**: 姓名
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **villageName**: 楼盘名称
      - 类型: *String*
    - **area**: 面积
      - 类型: *Float*
	
    ### <I> pageEcustomer

        分页方式获取客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
		
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客户信息列表 , 每条数据类型 *customer*
        :type paging.data: List
		
        Example::
        
            {
                ...
                "paging": {
                    "data": [
                        {
                            "area": 88,
                            "cityId": 1, 
                            "ecid": 1, 
                            "name": "李英俊", 
                            "phone": "13545654564", 
                            "villageName": "千缘爱在城"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I-C> addEcustomer

        添加客户信息

        错误信息 **330010 报名失败,验证码错误**

                |Requests:|
                :param ecustomer.name: 姓名
        :type ecustomer.name: String
        :param ecustomer.phone: 电话
        :type ecustomer.phone: String
        :param ecustomer.villageName: 楼盘名称
        :type ecustomer.villageName: String
        - **securityCode**: 验证码
          - 类型: *String*
        - **verifyCode**: 校验码
          - 类型: *String*

        Example::

            {
                "ecustomer.name": "沈阳", 
                "ecustomer.phone": "13333333333",
                "ecustomer.villageName": "万达广场一期",
                "securityCode":"123456",
                "verifyCode":"123456",
            }

    ### <I-C> queryCuserByUnionId

        通过联合Id获取人员

                |Requests:|
                :param cuser.unionId: 联合ID
        :type cuser.unionId: String

        Example::

            {
                "cuser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__"
            }

                |Returns:|
                - **cuser**: 用户信息 , 每条数据类型 *cuser*
          - 类型: *Object*

        Example::

            {
                ...
                "cuser": [
                    {
                        "area": 88,
                        "cityId": 1, 
                        "ecid": 1, 
                        "name": "李英俊", 
                        "phone": "13545654564", 
                        "villageName": "千缘爱在城"
                    }
                ],
                ...
            }

    ### <I-C> addCuser

        添加或更新用户信息

        通过联合ID判断当前有无用户信息 , 存在更新 , 不存在创建

                |Requests:|
                :param cuser.unionId: 联合ID
        :type cuser.unionId: String

        Example::

            {
                "cuser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__"
            }
		
### 人员

## api.market.EpersonAction

        |DataType:|
        #### eperson

    - **euid**: 人员ID
      - 类型: *Long*
    - **cityId**: 城市ID
      - 类型: *Long*
    - **name**: 姓名
      - 类型: *String*
    - **pinyin**: 拼音
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **experience**: 经验
      - 类型: *Short*
    - **type**: 类型
      - 类型: *Short*
    - **imgUrl**: 路径
      - 类型: *String*
    - **info**: 说明
      - 类型: *String*
	
    ### <I> pageEperson

        分页方式获取人员信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 人员信息列表 , 每条数据类型 *eperson*
        :type paging.data: List

        Example::

            {
                ...
                "paging": {
                    "data": [
                        {
                            "cityId": 1
                            "euid": 1
                            "experience": 4
                            "imgUrl": "group1/M00/16/C8/wKgFZ1ux32qAWleHAADyGmp0TMU797.jpg"
                            "info": "暂无"
                            "name": "乔治"
                            "phone": "13344556677"
                            "pinyin": "qiaozhi"
                            "type": 1
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I-C> queryEperson

        分页方式获取人员信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 人员信息列表 , 每条数据类型 *eperson*
        :type paging.data: List

        Example::

            {
                ...
                "paging": {
                    "data": [
                        {
                            "cityId": 1
                            "euid": 1
                            "experience": 4
                            "imgUrl": "group1/M00/16/C8/wKgFZ1ux32qAWleHAADyGmp0TMU797.jpg"
                            "info": "暂无"
                            "name": "乔治"
                            "phone": "13344556677"
                            "pinyin": "qiaozhi"
                            "type": 1
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> addEperson

        增加人员信息

                |Requests:|
                :param eperson.cityId: 城市ID
        :type eperson.cityId: Long
        :param eperson.name: 姓名
        :type eperson.name: String
        :param eperson.phone: 电话
        :type eperson.phone: String
        :param eperson.experience: 经验
        :type eperson.experience: Short
        :param eperson.type: 类型
        :type eperson.type: Short
        :param eperson.info: 简介
        :type eperson.info: String
        :param eperson.imgUrl: 头像
        :type eperson.imgUrl: String

        Example::

            {
                "eperson.cityId": 1,
                "eperson.name": "金立",
                "eperson.phone": "13312123333",
                "eperson.experience": 5,
                "eperson.type": 0,
                "eperson.info": "测试",
                "eperson.imgUrl": "group1/M00/1E/49/wKgFZlxuNquADD-hAAAcQrjUdt4012.jpg"
            }

    ### <I> updateEperson

        更改人员信息

        判断人员是否存在,不存在,错误信息 **340009 用户不存在**

                |Requests:|
                :param eperson.cityId: 城市ID
        :type eperson.cityId: Long
        :param eperson.euid: 人员ID
        :type eperson.euid: Long
        :param eperson.name: 姓名
        :type eperson.name: String
        :param eperson.phone: 电话
        :type eperson.phone: String
        :param eperson.experience: 经验
        :type eperson.experience: Short
        :param eperson.type: 类型
        :type eperson.type: Short
        :param eperson.info: 简介
        :type eperson.info: String
        :param eperson.imgUrl: 头像
        :type eperson.imgUrl: String

        Example::

            {
                "eperson.cityId": 1,
                "eperson.euid": 41,
                "eperson.name": "金立",
                "eperson.phone": "13312123333",
                "eperson.experience": 5,
                "eperson.type": 0,
                "eperson.info": "测试",
                "eperson.imgUrl": "group1/M00/1E/49/wKgFZlxuNquADD-hAAAcQrjUdt4012.jpg"
            }

    ### <I-C> queryEpersonByEuid

        通过人员Id获取人员信息

                |Requests:|
                :param eperson.euid: 人员ID
        :type eperson.euid: Long

        Example::

            {
                "eperson.euid": 41
            }

                |Returns:|
                - **eperson**: 人员信息列表 , 每条数据类型 *eperson*
          - 类型: *Object*

        Example::

            {
                ...
                "eperson": [
                    {
                        "cityId": 1
                        "euid": 1
                        "experience": 4
                        "imgUrl": "group1/M00/16/C8/wKgFZ1ux32qAWleHAADyGmp0TMU797.jpg"
                        "info": "暂无"
                        "name": "乔治"
                        "phone": "13344556677"
                        "pinyin": "qiaozhi"
                        "type": 1
                    }
                ],
                ...
            }

    ### <I> queryEpersonByPinYin

        通过拼音查询人员

                |Requests:|
                :param eperson.pinyin: 拼音
        :type eperson.pinyin: String

        Example::

            {
                "eperson.pinyin": "李磊"
            }

                |Returns:|
                - **epersons**: 人员信息列表 , 每条数据类型 *eperson*
          - 类型: *List*

        Example::

            {
                ...
                "epersons": [
                    {
                        "cityId": 1
                        "euid": 1
                        "experience": 4
                        "imgUrl": "group1/M00/16/C8/wKgFZ1ux32qAWleHAADyGmp0TMU797.jpg"
                        "info": "暂无"
                        "name": "乔治"
                        "phone": "13344556677"
                        "pinyin": "qiaozhi"
                        "type": 1
                    }
                ],
                ...
            }

### 图片

## api.market.EpictureAction

        |DataType:|
        #### epicture

    - **epid**: 图片ID
      - 类型: *Long*
    - **cid**: 案例ID
      - 类型: *Long*
    - **url**: 路径
      - 类型: *String*
    
    ### <I-C> queryEpicture

        分页方式获取图片信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 人员信息列表 , 每条数据类型 *epicture*
        :type paging.data: List

        Example::

            {
                ...
                "paging": {
                    "data": [
                        {
                            "epid": 11, 
                            "cid": 2, 
                            "url": "group1/M00/14/FD/wKgFZ1uHQFqAAvSvAALUaaqkcNk633.jpg"
                        }
                    ],
                    ...
                },
                ...
            }
	
    ### <I-C> queryEpictureByCid

        查询图片信息

                |Returns:|
                - **epictures**: 图片信息列表 , 每条数据类型 *epicture*
          - 类型: *List*

        Example::

            {
                ...
                "epictures":[
                    {
                        "epid": 11, 
                        "cid": 2, 
                        "url": "group1/M00/14/FD/wKgFZ1uHQFqAAvSvAALUaaqkcNk633.jpg"
                    }
                ],
                ...
            }

    ### <I> addEpicture

        添加图片信息

                |Requests:|
                :param epicture.cid: 案例ID
        :type epicture.cid: Long
        :param epicture.url: 图片路径
        :type epicture.url: String

        Example::

            {
                "epicture.cid": 63,
                "epicture.url": group1/M00/1E/49/wKgFZlxuPvSAOVjtAAAcQrjUdt4377.jpg
            }

    ### <I> deleteEpicture

        删除图片

                |Requests:|
                :param epicture.epid: 图片ID
        :type epicture.epid: Long

        Example::

            {
                "epicture.epid": 63
            }

### 通知

## api.market.MarketScopeAction

        |DataType:|
        #### cnotice

    - **cnid**: 通知ID
      - 类型: *Long*
    - **suid**: 发送人ID
      - 类型: *Long*
    - **ruid**: 接收人ID
      - 类型: *Long*
    - **name**: 姓名
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **status**: 状态, 0: 未读 , 1: 已读
      - 类型: *Short*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **comment**: 说明
      - 类型: *String*
	
    ### <I-C> queryCnoticeBySender

        查询通知信息,类型是发起人的

                |Requests:|
                :param cnotice.uid: 用户ID
        :type cnotice.uid: Long

        Example::

            {
                "cnotice.uid": 63
            }

                |Returns:|
                - **cnotices**: 通知信息列表 , 每条数据类型 *cnotice*
          - 类型: *List*

        Example::

            {
                ...
                "cnotices":[
                    {
                        "cnid": 2, 
                        "name": "李雷", 
                        "phone": "13311221111",
                        "comment":"测试赛"
                    }
                ],
                ...
            }
		
    ### <I-C> countCnoticeByReceiver

        查询通知数量,发起人(0)的通知数量 

        接收人(1)的通知数量

                |Requests:|
                :param cnotice.uid: 用户ID
        :type cnotice.uid: Long

        Example::

            {
                "cnotice.uid": 63
            }

                |Returns:|
                - **cnoticeCount**: 数量信息列表 , 每条数据类型 *cnotice*
          - 类型: *Object*

        Example::

            {
                ...
                "cnoticeCount":[
                    {
                        "cnoticeCount": 2
                    }
                ],
                ...
            }

    ### <I-C> addCnotice

        添加通知信息

                |Requests:|
                :param cnotice.uid: 联合ID
        :type cnotice.uid: String
        :param cnotice.name: 姓名
        :type cnotice.name: String
        :param cnotice.phone: 电话
        :type cnotice.phone: String
        :param cnotice.comment: 说明
        :type cnotice.comment: String

        Example::

            {
                "cnotice.uid": "sadsafdsakhjaoskjf-dfsa", 
                "cnotice.name": "万达",
                "ecustomer.phone": "13333333333",
                "cnotice.comment":"123456"
            }
	
    ### <I-C> deleteCnotice

        删除通知信息

                |Requests:|
                :param cnotice.cnid: 通知ID
        :type cnotice.cnid: Long

        Example::

            {
                "cnotice.cnid": 1
            }
	
    ### <I-C> updateCnoticeStatusByCnid

        更新通知信息状态(1) 已读

                |Requests:|
                :param cnotice.cnid: 通知ID
        :type cnotice.cnid: Long
        :param cnotice.status: 通知ID
        :type cnotice.status: Short

        Example::

            {
                "cnotice.cnid": 1,
                "cnotice.status":1
            }
