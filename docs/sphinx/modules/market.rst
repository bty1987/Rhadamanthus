
.. _market:

***************
营销
***************

商城
==========================

轮播
--------------------------

.. class:: api.market.SlideAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: slide
    
    :param sid: 轮播ID
    :type sid: Long
    :param gid: 商品ID
    :type gid: Long
    :param img: 图片路径
    :type img: String
    :param url: 跳转地址
    :type url: String
    :param status: 状态 , 0: 启用, 1:禁用
    :type status: Short
    
    .. method:: <S> querySlide
    
        获取轮播信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param slides: 轮播信息列表 , 每条数据类型 :data:`slide`
        :type slides: List
        
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
            
    .. method:: <S-C> querySlideForShow
    
        获取显示的轮播信息 , 状态为0(启用)
        
        +--------+
        |Returns:|
        +--------+
        
        :param slides: 轮播信息列表 , 每条数据类型 :data:`slide`
        :type slides: List
        
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
            
    .. method:: <S> addSlide
    
        添加轮播信息
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S> updateSlide
    
        更新轮播信息
        
        判断轮播信息是否存在 , 不存在 , 错误信息 **340002 轮播图不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
        
    .. method:: <S> updateSlideForStatus
    
        更新轮播信息状态
        
        判断轮播信息是否存在 , 不存在 , 错误信息 **340002 轮播图不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param slide.sid: 轮播ID
        :type slide.sid: Long
        :param slide.status: 状态
        :type slide.status: Short
        
        Example::
        
            {
                "slide.sid": 1,
                "slide.status": 1
            }

品类
--------------------------

.. class:: api.market.McategoryAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: mcategory
    
    :param cid: 品类ID
    :type cid: Long
    :param name: 名称
    :type name: String
    :param icon: 图标样式
    :type icon: String
    :param isShow: 首页显示 , 0: 显示 , 1: 不显示
    :type isShow: Short
    
    .. method:: <S> pageMcategory
    
        分页方式获取品类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 品类信息列表 , 每条数据类型 :data:`mcategory`
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
            
    .. method:: <S-C> queryMcategory
    
        获取品类信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param mcategorys: 品类信息列表 , 每条数据类型 :data:`mcategory`
        :type mcategorys: List
        
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
            
    .. method:: <S-C> queryMcategoryForShow
    
        获取首页显示品类信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param mcategorys: 品类信息列表 , 每条数据类型 :data:`mcategory`
        :type mcategorys: List
        
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
            
    .. method:: <S> addMcategory
    
        添加品类信息 , 默认首页不显示
        
        +---------+
        |Requests:|
        +---------+
        
        :param mcategory.name: 名称
        :type mcategory.name: String
        :param mcategory.icon: 图标样式
        :type mcategory.icon: String
        
        Example::
        
            {
                "mcategory.name": "家电",
                "mcategory.icon": "fl-jiadian"
            }
    
    .. method:: <S> updateMcategory
        
        更新品类信息
        
        判断品类是否存在 , 不存在 , 错误信息 **340003 品类不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
    
    .. method:: <S> updateMcategoryForShow
    
        更新品类首页是否可见
        
        判断品类是否存在 , 不存在 , 错误信息 **340003 品类不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param mcategory.cid: 品类ID
        :type mcategory.cid: Long
        :param mcategory.isShow: 是否可见
        :type mcategory.isShow: Short
        
        Example::
        
            {
                "mcategory.cid": 1,
                "mcategory.isShow": 1
            }
            
品牌
--------------------------

.. class:: api.market.MbrandAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: mbrand
    
    :param bid: 品类ID
    :type bid: Long
    :param mcategory: 品类 , 类型 `mcategory <./store.html#api.store.McategoryAction.mcategory>`__
    :type mcategory: Object
    :param name: 名称
    :type name: String
    :param icon: Logo图片地址
    :type icon: String
    :param status: 状态 , 0: 启用, 1: 禁用
    :type status: Short
    
    .. method:: <S> pageMbrand
    
        分页方式获取品牌信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 品牌信息列表 , 每条数据类型 :data:`mbrand`
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
            
    .. method:: <S-C> queryMbrand
    
        通过品类ID获取品牌信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param mbrand.mcategory.cid: 品类ID
        :type mbrand.mcategory.cid: Long
        
        Example::
        
            {
                "mbrand.mcategory.cid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param mbrands: 品牌信息列表 , 每条数据类型 :data:`mbrand`
        :type mbrands: List
        
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
            
    .. method:: <S> queryMbrandByName
    
        通过品牌名称获取品牌信息 , 支持模糊匹配, 状态为0(启用)
        
        +---------+
        |Requests:|
        +---------+
        
        :param mbrand.name: 名称
        :type mbrand.name: String
        
        Example::
        
            {
                "mbrand.name": "品牌"
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param mbrands: 品牌信息列表 , 每条数据类型 :data:`mbrand`
        :type mbrands: List
        :param autoFillKeyValue: 键值列表 , 每条数据类型 :data:`keyValue` , 键为品牌ID , 值为品牌名
        :type autoFillKeyValue: List
        :param autoFillList: 品牌名列表 , 每条数据类型String
        :type autoFillList: List
        
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
            
    .. method:: <S> addMbrand
    
        添加品牌信息 , 默认状态启用
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S> updateMbrand
    
        更新品牌信息
        
        判断品牌是否存在 , 不存在 , 错误信息 **340004 品牌不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S> updateMbrandForStatus
    
        更新品牌状态
        
        判断品牌是否存在 , 不存在 , 错误信息 **340004 品牌不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param mbrand.bid: 品牌ID
        :type mbrand.bid: Long
        :param mbrand.status: 状态
        :type mbrand.status: Short
        
        Example::
        
            {
                "mbrand.bid": 1,
                "mbrand.status": 1
            }
            
商品
--------------------------

.. class:: api.market.MgoodsAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: mgoods
    
    :param gid: 商品ID
    :type gid: Long
    :param no: 编号
    :type no: String
    :param name: 名称
    :type name: String
    :param pinyin: 拼音
    :type pinyin: String
    :param mbrand: 品牌 , 类型 `mbrand <./store.html#api.store.MbrandAction.mbrand>`__
    :type mbrand: Object
    :param barcode: 条码
    :type barcode: String
    :param title: 标题
    :type title: String
    :param defaultImg: 默认图片路径
    :type defaultImg: String
    :param price: 价格
    :type price: Float
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <S> pageMgoods
    
        分页方式获取商品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 商品信息列表 , 每条数据类型 :data:`mgoods`
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
            
    .. method:: <S-C> queryMgoods
    
        分页方式获取商品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 商品信息列表 , 每条数据类型 :data:`mgoods`
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
            
    .. method:: <S-C> queryMgoodsByPinyin
    
        通过拼音获取商品信息 , 支持模糊查询 , 状态为0(启用)
        
        +---------+
        |Requests:|
        +---------+
        
        :param mgoods.pinyin: 拼音
        :type mgoods.pinyin: String
        
        Example::
        
            {
                "mgoods.pinyin": "品牌"
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param mgoodses: 商品信息列表 , 每条数据类型 :data:`mgoods`
        :type mgoodses: List
        :param autoFillKeyValue: 键值列表 , 每条数据类型 :data:`keyValue` , 键为商品ID , 值为商品名
        :type autoFillKeyValue: List
        :param autoFillList: 商品名列表 , 每条数据类型String
        :type autoFillList: List
        
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
            
    .. method:: <S> addMgoods
    
        添加商品信息
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S> updateMgoods
    
        更新商品信息
        
        判断商品是否存在 , 不存在 , 错误信息 **340005 商品不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S> updateMgoodsForStatus
    
        更新商品状态
        
        判断商品是否存在 , 不存在 , 错误信息 **340005 商品不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param mgoods.gid: 商品ID
        :type mgoods.gid: Long
        :param mgoods.status: 状态
        :type mgoods.status: Short
        
        Example::
        
            {
                "mgoods.gid": 1,
                "mgoods.status": 0
            }
            
颜色
--------------------------

.. class:: api.market.McolorAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: mcolor
    
    :param cid: 颜色ID
    :type cid: Long
    :param gid: 商品ID
    :type gid: Long
    :param color: 颜色名称
    :type color: String
    :param status: 状态 , 0: 启用, 1: 禁用
    :type status: Short

    
    .. method:: <S> queryMcolorByGid
    
        通过商品ID获取颜色信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param mcolors: 颜色信息列表 , 每条数据类型 :data:`mcolor`
        :type mcolors: List
        
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
            
    .. method:: <S-C> queryMcolor
    
        通过商品ID获取颜色信息 , 状态为0(启用)
        
        +--------+
        |Returns:|
        +--------+
        
        :param mcolors: 颜色信息列表 , 每条数据类型 :data:`mcolor`
        :type mcolors: List
        
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
            
    .. method:: <S> addMcolor
    
        添加商品颜色
        
        +---------+
        |Requests:|
        +---------+
        
        :param mcolor.gid: 商品ID
        :type mcolor.gid: Long
        :param mcolor.color: 颜色名称
        :type mcolor.color: String
        
        Example::
        
            {
                "mcolor.gid": 1,
                "mcolor.color": "白色"
            }
            
    .. method:: <S> updateMcolorForStatus
    
        更新颜色状态
        
        判断颜色是否存在 , 不存在 , 错误信息 **340006 颜色不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param mcolor.cid: 商品ID
        :type mcolor.cid: Long
        :param mcolor.status: 状态
        :type mcolor.status: Short
        
        Example::
        
            {
                "mcolor.cid": 1,
                "mcolor.status": 0
            }
            
规格
--------------------------

.. class:: api.market.MformatAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: mformat
    
    :param fid: 规格ID
    :type fid: Long
    :param gid: 商品ID
    :type gid: Long
    :param format: 规格名称
    :type format: String
    :param status: 状态 , 0: 启用, 1: 禁用
    :type status: Short

    
    .. method:: <S> queryMformatByGid
    
        通过商品ID获取规格信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param mformats: 规格信息列表 , 每条数据类型 :data:`mformat`
        :type mformats: List
        
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
            
    .. method:: <S-C> queryMformat
    
        通过商品ID获取规格信息 , 状态为0(启用)
        
        +--------+
        |Returns:|
        +--------+
        
        :param mformats: 规格信息列表 , 每条数据类型 :data:`mformat`
        :type mformats: List
        
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
            
    .. method:: <S> addMformat
    
        添加规格信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param mformat.gid: 商品ID
        :type mformat.gid: Long
        :param mformat.format: 规格名称
        :type mformat.format: String
        
        Example::
        
            {
                "mformat.gid": 1,
                "mformat.format": "300*300"
            }
            
    .. method:: <S> updateMformatForStatus
    
        更新规格状态
        
        判断规格是否存在 , 不存在 , 错误信息 **340007 规格不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param mformat.fid: 商品ID
        :type mformat.fid: Long
        :param mformat.status: 状态
        :type mformat.status: Short
        
        Example::
        
            {
                "mcolor.fid": 1,
                "mcolor.status": 0
            }
            
价格
--------------------------

.. class:: api.market.MPriceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: mprice
    
    :param pid: 价格ID
    :type pid: Long
    :param mgoods: 商品 , 类型 `mgoods <./store.html#api.store.MgoodsAction.mgoods>`__
    :type mgoods: Object
    :param mcolor: 颜色 , 类型 `mcolor <./store.html#api.store.McolorAction.mcolor>`__
    :type mcolor: Object
    :param mformat: 规格 , 类型 `mformat <./store.html#api.store.MformatAction.mformat>`__
    :type mformat: Object
    :param name: 名称
    :type name: String
    :param price: 价格
    :type price: Float
    :param img: 图片路径
    :type img: String
    :param status: 状态 , 0: 启用, 1: 禁用 , 2: 热点, 3: 推荐
    :type status: Short
    
    .. method:: <S-C> queryMprice
    
        通过商品ID获取价格信息 , 状态为0(启用),2(热点)以及3(推荐)
        
        +---------+
        |Requests:|
        +---------+
        
        :param mprice.mgoods.gid: 商品ID
        :type mprice.mgoods.gid: Long
        
        Example::
        
            {
                "mprice.mgoods.gid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param mprices: 价格信息列表 , 每条数据类型 :data:`mprice`
        :type mprices: List
        
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
    
    .. method:: <S> queryMpriceByGid
    
        通过商品ID获取价格信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param mprice.mgoods.gid: 商品ID
        :type mprice.mgoods.gid: Long
        
        Example::
        
            {
                "mprice.mgoods.gid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param mprices: 价格信息列表 , 每条数据类型 :data:`mprice`
        :type mprices: List
        
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
            
    .. method:: <S-C> queryMpriceByPinyin
    
        通过商品名称拼音获取价格信息 , 支持模糊查询 , 状态为0(启用),2(热点)以及3(推荐)
        
        +---------+
        |Requests:|
        +---------+
        
        :param mprice.mgoods.pinyin: 拼音
        :type mprice.mgoods.pinyin: String
        
        Example::
        
            {
                "mprice.mgoods.pinyin": "品牌"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param mprices: 价格信息列表 , 每条数据类型 :data:`mprice`
        :type mprices: List
        
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
            
    .. method:: <S-C> queryMpriceForShow
    
        获取状态为2(热点)或3(推荐)的价格信息
        
        价格状态只能为2(热点)或3(推荐) , 其他状态不能够获取价格信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param mprice.status: 状态
        :type mprice.status: Short
        
        Example::
        
            {
                "mprice.status": 2
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param mprices: 价格信息列表 , 每条数据类型 :data:`mprice`
        :type mprices: List
        
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
            
    .. method:: <S> addMprice
    
        添加商品价格信息
        
        商品 , 商品颜色以及商品规格只能对应一个价格 , 价格如果存在 , 错误信息 **340014 商品-颜色-规格对应价格已存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S> updateMpriceForStatus

        更新商品价格状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param mprice.pid: 价格ID
        :type mprice.pid: Long
        :param mprice.status: 状态
        :type mprice.status: Short
        
        Example::
        
            {
                "mprice.pid": 1,
                "mprice.status": 0
            }
            
图片
--------------------------

.. class:: api.market.PictureAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: picture
    
    :param pid: 订单ID
    :type pid: Long
    :param gid: 商品ID
    :type gid: Long
    :param img: 图片路径
    :type img: String
    :param type: 类型 , 0: 轮播 , 1: 说明
    :type type: Short
    :param sort: 排序
    :type sort: Short

    .. method:: <S> queryPictureByGid
    
        通过商品ID获取图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param picture.gid: 商品ID
        :type picture.gid: Long
        
        Example::
        
            {
                "picture.gid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param pictures: 图片信息列表 , 每条数据类型 :data:`picture`
        :type pictures: List
        
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
            
    .. method:: <S-C> queryPicture
    
        通过商品ID获取图片信息 , 状态为0(启用)
        
        +---------+
        |Requests:|
        +---------+
        
        :param picture.gid: 商品ID
        :type picture.gid: Long
        :param picture.type: 类型
        :type picture.type: Short
        
        Example::
        
            {
                "picture.gid": 1,
                "picture.type": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param pictures: 图片信息列表 , 每条数据类型 :data:`picture`
        :type pictures: List
        
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
            
    .. method:: <S> addPicture
    
        添加商品图片
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S> updatePictureForSort
    
        更新图片排序
    
        判断商品图片是否存在 , 不存在 , 错误信息 **340008 图片信息不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param picture.pid: 图片ID
        :type picture.pid: Long
        :param picture.sort: 排序
        :type picture.sort: Short
        
        Example::
        
            {
                "picture.pid": 1,
                "picture.sort": 1
            }
            
    .. method:: <S> deletePicture
    
        删除图片
        
        +---------+
        |Requests:|
        +---------+
        
        :param picture.pid: 图片ID
        :type picture.pid: Long
        
        Example::
        
            {
                "picture.pid": 1
            }
            
用户
--------------------------

.. class:: api.market.MuserAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: muser
    
    :param uid: 价格ID
    :type uid: Long
    :param unionId: 联合ID
    :type unionId: String
    :param name: 姓名
    :type name: String
    :param phone: 电话
    :type phone: String
    :param gender: 性别 , 0: 女, 1: 男
    :type gender: Short
    :param birthday: 生日
    :type birthday: String
    
    .. method:: <S> pageMuser
    
        分页方式获取用户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 用户信息列表 , 每条数据类型 :data:`muser`
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
            
    .. method:: <S-C> queryMuserByUnionId
    
        通过联合ID获取用户信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        Example::
        
            {
                "muser.unionId": 1,
                "muser.status": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param muser: 用户信息 , 类型 :data:`muser`
        :type muser: Object
        
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
            
    .. method:: <S-C> saveMuser
    
        添加或更新用户信息
        
        通过联合ID判断当前有无用户信息 , 存在更新 , 不存在创建
        
        +---------+
        |Requests:|
        +---------+
        
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

    .. method:: <S-C> updateMuser
    
        更新用户信息
        
        +---------+
        |Requests:|
        +---------+
        
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
        
地址
--------------------------

.. class:: api.market.AddressAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: address
    
    :param aid: 地址ID
    :type aid: Long
    :param uid: 用户ID
    :type uid: Long
    :param name: 姓名
    :type name: String
    :param phone: 电话
    :type phone: String
    :param province: 省份
    :type province: String
    :param city: 城市
    :type city: String
    :param proper: 城区
    :type proper: String
    :param address: 地址
    :type address: String
    :param status: 状态 , 0: 启用, 1: 默认 , 2: 禁用
    :type status: Short
    
    .. method:: <S> queryAddressByUid
    
        通过用户ID获取地址信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param address.uid: 用户ID
        :type address.uid: Long
        
        Example::
        
            {
                "address.uid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param addresses: 地址信息列表 , 类型 :data:`address`
        :type addresses: List
        
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
    
    .. method:: <S-C> queryAddress
    
        通过用户联合ID获取地址信息 , 状态为0(启用)
        
        +---------+
        |Requests:|
        +---------+
        
        :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param addresses: 地址信息列表 , 类型 :data:`address`
        :type addresses: List
        
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
            
    .. method:: <S-C> addAddress
    
        添加地址信息
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S-C> updateAddress
    
        更新地址信息
        
        判断地址是否存在 , 不存在 , 错误信息 **340010 地址不存在**
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断地址是否归属当前操作用户 , 不归属 , 错误信息 **340001 无操作权限**
        
        判断当前地址是否为操作用户归属地址
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S> updateAddressByAid
    
        更新地址信息
        
        判断地址是否存在 , 不存在 , 错误信息 **340010 地址不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S-C> updateAddressForStatus
    
        更新地址状态
        
        判断地址是否存在 , 不存在 , 错误信息 **340010 地址不存在**
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断地址是否归属当前操作用户 , 不归属 , 错误信息 **340001 无操作权限**
        
        如更新状态为1(默认) , 需要控制当前默认地址数量为1个
        
        +---------+
        |Requests:|
        +---------+
        
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

购物车
--------------------------

.. class:: api.market.CartAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: cart
    
    :param cid: 购物车ID
    :type cid: Long
    :param uid: 用户ID
    :type uid: Long
    :param mprice: 商品价格 , 类型 `mprice <./store.html#api.store.MpriceAction.mprice>`__
    :type mprice: Object
    :param num: 数量
    :type num: Float
    
    .. method:: <S-C> pageCart
    
        分页方式获取购物车信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过联合ID获取归属的购物车信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 购物车信息列表 , 每条数据类型 :data:`cart`
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
    
    .. method:: <S-C> queryCartByUnionId
    
        通过联合ID获取购物车信息
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param muser.unionId: 联合ID
        :type muser.unionId: String
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param carts: 购物车信息列表 , 类型 :data:`cart`
        :type carts: List
        
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
            
    .. method:: <S-C> addCart
    
        添加购物车商品价格
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S-C> updateCart
    
        更新购物车商品价格数量
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断购物车商品价格是否存在 , 不存在 , 错误信息 **340011 购物车商品不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S-C> clearCart
    
        清空购物车
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
            
订单
--------------------------

.. class:: api.market.MorderAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: morder
    
    :param oid: 订单ID
    :type oid: Long
    :param no: 编号
    :type no: String
    :param muser: 用户 , 类型 `muser <./store.html#api.store.MuserAction.muser>`__
    :type muser: Object
    :param address: 地址 , 类型 `address <./store.html#api.store.AddressAction.address>`__
    :type address: Object
    :param total: 总额
    :type total: Float
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param payTime: 付款时间
    :type payTime: Timestamp
    :param status: 状态 , 0: 待付款 , 1: 待发货 , 2: 已发货 , 3: 待评价 , 4: 退货/售后 , 5: 删除
    :type status: Short
    :param items: 订单项列表 , 额米条数据类型 :data:`morderItem`
    :type items: List
    
    .. data:: morderItem
    
    :param oiid: 订单项ID
    :type oiid: Long
    :param oid: 订单ID
    :type oid: Long
    :param mprice: 商品价格 , 类型 `mprice <./store.html#api.store.MpriceAction.mprice>`__
    :type mprice: Object
    :param num: 数量
    :type num: Float

    .. method:: <S> pageMorder
    
        分页方式获取订单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 订单列表 , 每条数据类型 :data:`morder`
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
            
    .. method:: <S-C> queryMorderByUnionId
    
        通过联合ID获取归属用户的订单信息
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param morder.muser.unionId: 联合ID
        :type morder.muser.unionId: String
        :param morder.status: 状态
        :type morder.status: Short
        
        Example::
        
            {
                "muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param morders: 订单列表 , 每条数据类型 :data:`morder`
        :type morders: List
        
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
            
    .. method:: <S> queryMorderItemByOid
    
        通过订单ID获取订单项
        
        +---------+
        |Requests:|
        +---------+
        
        :param morder.oid: 订单ID
        :type morder.oid: Long
        
        Example::
        
            {
                "morder.oid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param morderItems: 订单项列表 , 每条数据类型 :data:`morderItem`
        :type morderItems: List
        
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
            
    .. method:: <S-C> addMorder
    
        添加订单
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        添加方式分为两种 , 直接通过商品对应的价格添加订单 , 另外是他通过购物车商品对应价格添加订单
        
        通过购物车商品对应价格添加订单之后 , 删除购物车对应的商品价格
        
        两种添加方式不能同时进行
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S-C> updateMorder
    
        .. warning::
        
            保留意见 , 提供用户使用的按照更新状态功能拆分 , 或在添加评价同时更新订单状态
    
        更新订单状态 , 可更新状态为1(待发货), 2(已发货), 3(待评价)
        
        状态更新控制 , 0(待付款)->1(待发货) , 1(待发货)->2(已发货) , 2(已发货)->3(待评价)
        
        判断订单是否存在 , 不存在 , 错误信息 **340012 订单不存在**
        
        更新状态不符合控制规则 ,  错误信息 **340013 订单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param morder.oid: 订单ID
        :type morder.oid: Long
        :param morder.status: 状态
        :type morder.status: Short
        
        Example::
        
            {
                "morder.oid": 1,
                "morder.status": 1
            }
            
    .. method:: <S> updateMorderForStatus
    
        更新订单状态 , 可更新状态为1(待发货), 2(已发货), 3(待评价)
        
        状态更新控制 , 0(待付款)->1(待发货) , 1(待发货)->2(已发货) , 2(已发货)->3(待评价)
        
        判断订单是否存在 , 不存在 , 错误信息 **340012 订单不存在**
        
        更新状态不符合控制规则 ,  错误信息 **340013 订单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param morder.oid: 订单ID
        :type morder.oid: Long
        :param morder.status: 状态
        :type morder.status: Short
        
        Example::
        
            {
                "morder.oid": 1,
                "morder.status": 1
            }
            
    .. method:: <S-C> deleteMorder
    
        删除订单 , 订单状态为0(待付款)可删除
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断订单是否归属当前操作用户 , 不归属 , 错误信息 **340001 无操作权限**
        
        判断订单状态是否为0(待付款) , 其他状态不可操作 , 错误信息 **340013 订单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param morder.muser.unionId: 联合ID
        :type morder.muser.unionId: String
        :param morder.oid: 订单ID
        :type morder.oid: Long
        
        Example::
        
            {
                "morder.muser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__",
                "morder.oid": 1
            }
            
评价
--------------------------

.. class:: api.market.EvaluateAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: evaluate
    
    :param eid: 评价ID
    :type eid: Long
    :param oid: 订单ID
    :type oid: Long
    :param gid: 商品ID
    :type gid: Long
    :param pid: 价格ID
    :type pid: Long
    :param unionId: 联合ID
    :type unionId: String
    :param name: 用户名
    :type name: String
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param score: 评分 , 1: 好评 , 2: 中评 , 3: 差评
    :type score: Short
    :param comment: 说明
    :type comment: String
    :param discribeRate: 商品评分 , 范围1-5
    :type discribeRate: Short
    :param logisticsRate: 物流评分 , 范围1-5
    :type logisticsRate: Short
    :param serviceRate: 服务评分 , 范围1-5
    :type serviceRate: Short
    :param imgs: 图片路径 , 多张图片路径拼接
    :type imgs: String
    
    .. method:: <S-C> pageEvaluate
    
        分页方式获取评价信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 评价列表 , 每条数据类型 :data:`evaluate`
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
            
    .. method:: <S-C> addEvaluate
    
        添加评价信息
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断订单是否存在 , 不存在 , 错误信息 **340012, 订单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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

款项
--------------------------

.. class:: api.market.MpaymentAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: mpayment
    
    :param mpid: 款项ID
    :type mpid: Long
    :param morder: 订单 , 类型 `morder <./store.html#api.store.MorderAction.morder>`__
    :type morder: Object
    :param totalPrice: 总价
    :type totalPrice: Float
    :param type: 类型 , 0: 微信
    :type type: Short
    :param status: 状态 , 0: 未付 , 1: 已付 , 2: 取消
    :type status: Short

    .. method:: <S-C> addMpayment
    
        添加款项信息
        
        判断用户是否存在 , 不存在 , 错误信息 **340009 用户不存在**
        
        判断订单是否存在 , 不存在 , 错误信息 **340012, 订单不存在**
        
        判断订单是否归属当前操作用户 , 不归属 , 错误信息 **340001 无操作权限**
        
        提供线上成功付款之后 , 生成订单对应的款项信息 , 款项状态为1(已付)
        
        更新订单状态为1(待发货)
        
        +---------+
        |Requests:|
        +---------+
        
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
            
优惠券
--------------------------

.. class:: api.market.Coupon

    +---------+
    |DataType:|
    +---------+
    
    .. data:: coupon
    
    :param cid: 券ID
    :type cid: Long
    :param mgoods: 商品 , 类型 `mgoods <./store.html#api.store.MgoodsAction.mgoods>`__
    :type mgoods: Object
    :param title: 标题
    :type title: String
    :param value: 金额
    :type value: Float
    :param type: 类型 , 0: 减免 , 1: 折扣
    :type type: Short
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    
    .. method:: <S> pageCoupon
    
        分页方式获取优惠券 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 优惠券列表 , 每条数据类型 :data:`coupon`
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
            
    .. method:: <S> queryCouponByCid
    
        通过优惠券ID获取优惠券信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param coupon.cid: 券ID
        :type coupon.cid: Long
        
        Example::
        
            {
                "coupon.cid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param coupon: 优惠券信息 , 类型 :data:`coupon`
        :type coupon: Object
        
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
    
    .. method:: <S> addCoupon
    
        创建优惠券
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S> updateCoupon
    
        更新优惠券
        
        判断优惠券是否存在 , 不存在 , 错误信息 **340017 券不存在**
        
        +---------+
        |Requests:|
        +---------+
        
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
            
    .. method:: <S> updateCouponForStatus
    
        更新优惠券状态
        
        判断优惠券是否存在 , 不存在 , 错误信息 **340017 券不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param coupon.cid: 券ID
        :type coupon.cid: Long
        :param coupon.status: 状态
        :type coupon.status: Short
        
        Example::
        
            {
                "coupon.cid": 1,
                "coupon.status": 0
            }
    
    .. data:: muserCoupon
    
    :param ucid: ID
    :type ucid: Long
    :param coupon: 优惠券 , 类型 `coupon <./store.html#api.store.CouponAction.coupon>`__
    :type coupon: Object
    :param unionId: 联合ID
    :type unionId: String
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    
    .. method:: <S-C> pageMuserCoupon
    
        分页方式获取联合ID对应的优惠券信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 优惠券列表 , 每条数据类型 :data:`muserCoupon`
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
            
    .. method:: <S-C> queryMuserCouponByUnionId
    
        通过联合ID获取归属的优惠券信息 , 优惠券状态为0(有效)
        
        +---------+
        |Requests:|
        +---------+
        
        :param muserCoupon.unionId: 联合ID
        :type muserCoupon.unionId: String
        
        Example::
        
            {
                "muserCoupon.unionId": "JF2IMDFIU2J-23J23I2J318785J45I6HHJ"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param muserCoupon: 优惠券信息 , 类型 :data:`coupon`
        :type muserCoupon: Object
        
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
            
    .. method:: <S-C> addMuserCoupon
    
        添加关联的优惠券信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param muserCoupon.unionId: 联合ID
        :type muserCoupon.unionId: String
        :param muserCoupon.coupon.cid: 券ID
        :type muserCoupon.coupon.cid: Long
        
        Example::
        
            {
                "muserCoupon.unionId": "JF2IMDFIU2J-23J23I2J318785J45I6HHJ",
                "muserCoupon.coupon.cid": 1
            }

站点
==========================

名片
--------------------------

.. class:: api.market.CardAction

    +---------+
    |DataType:|
    +---------+

    .. data:: cardPhoto

    :param cpid: 图片ID
    :type cpid: Long
    :param caid: 名片ID
    :type caid: Long
    :param url: 路径
    :type url: String

    .. data:: card

    :param caid: 名片ID
    :type caid: Long
    :param cuser: 用户
    :type cuser: Object
    :param userPhoto: 头像
    :type userPhoto: String
    :param userName: 姓名
    :type userName: String
    :param phone: 电话
    :type phone: String
    :param wechat: 微信
    :type wechat: String
    :param industry: 行业
    :type industry: String
    :param profession: 职业
    :type profession: String
    :param address: 地址
    :type address: String
    :param info: 简介
    :type info: String

    .. method:: <I> pageCard

        分页方式获取名片信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 名片信息列表 , 每条数据类型 :data:`card`
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

    .. method:: <I-C> queryCardPhotoByCaid
	
        通过名片Id获取名片图片
		
        +---------+
        |Requests:|
        +---------+

        :param cardPhoto.caid: 名片Id
        :type cardPhoto.caid: Long

        Example::

            {
                "cardPhoto.caid": 1
            }
		
        +--------+
        |Returns:|
        +--------+

        :param cardPhotos: 图片信息列表 , 每条数据类型 :data:`cardPhoto`
        :type cardPhotos: List

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

    .. method:: <I-C> queryCardByCuid
	
        通过用户id获取名片信息
		
        +---------+
        |Requests:|
        +---------+
		
        :param card.cuser.cuid: 用户ID
        :type card.cuser.cuid: Long
		
        Example::
        
            {
                "card.cuser.cuid": 1
            }
		
        +--------+
        |Returns:|
        +--------+
		
        :param card: 名片信息列表 , 每条数据类型 :data:`card`
        :type card: Object
		
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
			
    .. method:: <I> deleteCard
	
        删除名片
		
        +---------+
        |Requests:|
        +---------+
		
        :param card.caid: 图片ID
        :type card.caid: Long
		
        Example::

            {
                "card.caid":1
            }

    .. method:: <I-C> addCard
	
        添加名片信息

        +---------+
        |Requests:|
        +---------+

        :param card.name: 姓名
        :type card.name: String
        :param card.phone: 电话
        :type card.phone: String

        Example::

            {
                "card.name": "李磊",
                "card.phone": "13322331144"
            }
		
    .. method:: <I-C> updateCard
	
        更新名片信息

        +---------+
        |Requests:|
        +---------+

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
		
    .. method:: <I-C> addCardPhoto
	
        添加名片图片

        +---------+
        |Requests:|
        +---------+

        :param cardPhotos[n].path: 图片路径
        :type cardPhotos[n].path: List

        Example::

            {
                "cardPhotos[0].path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
            }

    .. method:: <I-C> deleteCardPhoto
	
        删除名片图片

        +---------+
        |Requests:|
        +---------+

        :param cardPhoto.cpid: 图片ID
        :type cardPhoto.cpid: Long

        Example::

            {
                "cardPhoto.cpid":1
            }

案例
--------------------------

.. class:: api.market.EcaseAction

    +---------+
    |DataType:|
    +---------+
	
    .. data:: ecase
	
    :param cid: 案例ID
    :type cid: Long
    :param cityId: 城市ID
    :type cityId: Long
    :param villageName: 楼盘名称
    :type villageName: String
    :param designer: 设计师
    :type designer: Object
    :param supervisor: 监理
    :type supervisor: Object
    :param style: 风格
    :type style: String
    :param type: 类型 , 0: 效果图 , 1: 施工图
    :type type: Short
    :param houseType: 户型
    :type houseType: String
    :param area: 面积
    :type area: Float
    :param cycle: 施工周期
    :type cycle: Short
    :param defaultUrl: 默认图片
    :type defaultUrl: String
    :param status: 状态 , 0: 不显示 , 1: 显示
    :type status: Short
    :param comment: 说明
    :type comment: String
	
    .. data:: cuser
	
    :param cuid: 用户ID
    :type cuid: Long
    :param unionId: 联合ID
    :type unionId: String
	
    .. method:: <I-C> pageEcase

        分页方式获取案例信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
		
        +--------+
        |Returns:|
        +--------+
		
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 案例信息列表 , 每条数据类型 :data:`ecase`
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
            
    .. method:: <I> addEcase

        增加案例信息

        +---------+
        |Requests:|
        +---------+

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
		
    .. method:: <I> updateEcase
	
        修改案例信息

        +---------+
        |Requests:|
        +---------+

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

    .. method:: <I> updateEcaseForStatus
	
        更改案例状态

        +---------+
        |Requests:|
        +---------+

        :param ecase.cid: 案例ID
        :type ecase.cid: Long
        :param ecase.status: 状态
        :type ecase.status: Short

        Example::

            {
                "ecase.cid": 11,
                "ecase.status":1
            }
            
    .. method:: <I-C> queryEcase
    
        分页方式获取案例信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
		
        +--------+
        |Returns:|
        +--------+
		
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 案例信息列表 , 每条数据类型 :data:`ecase`
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

    .. method:: <I-C> queryEcaseByCid
	
        通过案例Id查询案例

        +---------+
        |Requests:|
        +---------+

        :param ecase.cid: 名片ID
        :type ecase.cid: Long

        Example::

            {
                "ecase.cid": 11
            }

        +--------+
        |Returns:|
        +--------+

        :param ecase: 案例信息列表 , 每条数据类型 :data:`ecase`
        :type ecase: Object

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
		
    .. method:: <I-C> queryEcaseByTypeAndStatus
	
        通过城市Id获取案例信息
		
        +---------+
        |Requests:|
        +---------+
		
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
		
        +--------+
        |Returns:|
        +--------+
		
        :param cases: 案例信息列表 , 每条数据类型 :data:`ecase`
        :type cases: List
		
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
            
    .. method:: <I-C> deleteEcase
    
        删除案例
        
        +---------+
        |Requests:|
        +---------+
		
        :param ecase.ecid: 案例ID
        :type ecase.ecid: Long
		
        Example::
		
            {
                "ecase.ecid": 1
            }

城市
--------------------------

.. class:: api.market.EcityAction

    +---------+
    |DataType:|
    +---------+
	
    .. data:: ecity

    :param ecid: 城市ID
    :type ecid: Long
    :param city: 城市名称
    :type city: String
    :param pinyin: 城市名称拼音
    :type pinyin: String
    :param x: 经度
    :type x: Double
    :param y: 纬度
    :type y: Double
	
    .. method:: <I> pageEcity
	
        分页方式获取城市信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        +--------+
        |Returns:|
        +--------+

        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 城市信息列表 , 每条数据类型 :data:`city`
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
	
    .. method:: <I> queryEcity
	
        查询城市信息

        +--------+
        |Returns:|
        +--------+

        :param ecitys: 城市信息列表 , 每条数据类型 :data:`ecity`
        :type ecitys: List

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

    .. method:: <I> queryEcityByPinYin
	
        通过拼音查询城市

        +---------+
        |Requests:|
        +---------+

        :param ecity.pinyin: 拼音
        :type ecity.pinyin: String

        Example::

            {
                "ecity.pinyin": "沈阳"
            }

        +--------+
        |Returns:|
        +--------+

        :param ecitys: 城市信息列表 , 每条数据类型 :data:`ecity`
        :type ecitys: List

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

    .. method:: <I> addEcity
	
        增加城市信息

        +---------+
        |Requests:|
        +---------+

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
            
    .. method:: <I> updateEcity
	
        更新城市信息

        +---------+
        |Requests:|
        +---------+

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
			
    .. method:: <I-C> queryEcityByXandY
	
        通过经纬度查询城市信息

        +---------+
        |Requests:|
        +---------+

        :param ecity.x: 经度
        :type ecity.x: Double
        :param ecity.y: 纬度
        :type ecity.y: Double

        Example::

            {
                "ecity.x": 123.25, 
                "ecity.y": 41.48
            }

        +--------+
        |Returns:|
        +--------+

        :param ecity: 城市信息列表 , 每条数据类型 :data:`ecity`
        :type ecity: Object

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

客户
--------------------------

.. class:: api.market.EcustomerAction

    +---------+
    |DataType:|
    +---------+
	
    .. data:: ecustomer

    :param ecid: 客户ID
    :type ecid: Long
    :param cityId: 城市ID
    :type cityId: Long
    :param name: 姓名
    :type name: String
    :param phone: 电话
    :type phone: String
    :param villageName: 楼盘名称
    :type villageName: String
    :param area: 面积
    :type area: Float
	
    .. method:: <I> pageEcustomer
	
        分页方式获取客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
		
        +--------+
        |Returns:|
        +--------+
		
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 客户信息列表 , 每条数据类型 :data:`customer`
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

    .. method:: <I-C> addEcustomer
	
        添加客户信息

        错误信息 **330010 报名失败,验证码错误**

        +---------+
        |Requests:|
        +---------+

        :param ecustomer.name: 姓名
        :type ecustomer.name: String
        :param ecustomer.phone: 电话
        :type ecustomer.phone: String
        :param ecustomer.villageName: 楼盘名称
        :type ecustomer.villageName: String
        :param securityCode: 验证码
        :type securityCode: String
        :param verifyCode: 校验码
        :type verifyCode: String

        Example::

            {
                "ecustomer.name": "沈阳", 
                "ecustomer.phone": "13333333333",
                "ecustomer.villageName": "万达广场一期",
                "securityCode":"123456",
                "verifyCode":"123456",
            }

    .. method:: <I-C> queryCuserByUnionId
	
        通过联合Id获取人员

        +---------+
        |Requests:|
        +---------+

        :param cuser.unionId: 联合ID
        :type cuser.unionId: String

        Example::

            {
                "cuser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__"
            }

        +--------+
        |Returns:|
        +--------+

        :param cuser: 用户信息 , 每条数据类型 :data:`cuser`
        :type cuser: Object

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

    .. method:: <I-C> addCuser
	
        添加或更新用户信息

        通过联合ID判断当前有无用户信息 , 存在更新 , 不存在创建

        +---------+
        |Requests:|
        +---------+

        :param cuser.unionId: 联合ID
        :type cuser.unionId: String

        Example::

            {
                "cuser.unionId": "LKSJF_KDJFJ2J1KJ3H12K__"
            }
		
人员
--------------------------

.. class:: api.market.EpersonAction

    +---------+
    |DataType:|
    +---------+
	
    .. data:: eperson

    :param euid: 人员ID
    :type euid: Long
    :param cityId: 城市ID
    :type cityId: Long
    :param name: 姓名
    :type name: String
    :param pinyin: 拼音
    :type pinyin: String
    :param phone: 电话
    :type phone: String
    :param experience: 经验
    :type experience: Short
    :param type: 类型
    :type type: Short
    :param imgUrl: 路径
    :type imgUrl: String
    :param info: 说明
    :type info: String
	
    .. method:: <I> pageEperson
	
        分页方式获取人员信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        +--------+
        |Returns:|
        +--------+

        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 人员信息列表 , 每条数据类型 :data:`eperson`
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
            
    .. method:: <I-C> queryEperson
	
        分页方式获取人员信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        +--------+
        |Returns:|
        +--------+

        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 人员信息列表 , 每条数据类型 :data:`eperson`
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

    .. method:: <I> addEperson
	
        增加人员信息

        +---------+
        |Requests:|
        +---------+

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

    .. method:: <I> updateEperson
	
        更改人员信息

        判断人员是否存在,不存在,错误信息 **340009 用户不存在**

        +---------+
        |Requests:|
        +---------+

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

    .. method:: <I-C> queryEpersonByEuid
	
        通过人员Id获取人员信息

        +---------+
        |Requests:|
        +---------+

        :param eperson.euid: 人员ID
        :type eperson.euid: Long

        Example::

            {
                "eperson.euid": 41
            }

        +--------+
        |Returns:|
        +--------+

        :param eperson: 人员信息列表 , 每条数据类型 :data:`eperson`
        :type eperson: Object

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

    .. method:: <I> queryEpersonByPinYin
	
        通过拼音查询人员

        +---------+
        |Requests:|
        +---------+

        :param eperson.pinyin: 拼音
        :type eperson.pinyin: String

        Example::

            {
                "eperson.pinyin": "李磊"
            }

        +--------+
        |Returns:|
        +--------+

        :param epersons: 人员信息列表 , 每条数据类型 :data:`eperson`
        :type epersons: List

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

图片
--------------------------

.. class:: api.market.EpictureAction

    +---------+
    |DataType:|
    +---------+
	
    .. data:: epicture

    :param epid: 图片ID
    :type epid: Long
    :param cid: 案例ID
    :type cid: Long
    :param url: 路径
    :type url: String
    
    .. method:: <I-C> queryEpicture
	
        分页方式获取图片信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        +--------+
        |Returns:|
        +--------+

        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 人员信息列表 , 每条数据类型 :data:`epicture`
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
	
    .. method:: <I-C> queryEpictureByCid
	
        查询图片信息

        +--------+
        |Returns:|
        +--------+

        :param epictures: 图片信息列表 , 每条数据类型 :data:`epicture`
        :type epictures: List

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

    .. method:: <I> addEpicture
	
        添加图片信息

        +---------+
        |Requests:|
        +---------+

        :param epicture.cid: 案例ID
        :type epicture.cid: Long
        :param epicture.url: 图片路径
        :type epicture.url: String

        Example::

            {
                "epicture.cid": 63,
                "epicture.url": group1/M00/1E/49/wKgFZlxuPvSAOVjtAAAcQrjUdt4377.jpg
            }

    .. method:: <I> deleteEpicture
	
        删除图片

        +---------+
        |Requests:|
        +---------+

        :param epicture.epid: 图片ID
        :type epicture.epid: Long

        Example::

            {
                "epicture.epid": 63
            }

通知
--------------------------

.. class:: api.market.MarketScopeAction

    +---------+
    |DataType:|
    +---------+
	
    .. data:: cnotice

    :param cnid: 通知ID
    :type cnid: Long
    :param suid: 发送人ID
    :type suid: Long
    :param ruid: 接收人ID
    :type ruid: Long
    :param name: 姓名
    :type name: String
    :param phone: 电话
    :type phone: String
    :param status: 状态, 0: 未读 , 1: 已读
    :type status: Short
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param comment: 说明
    :type comment: String
	
    .. method:: <I-C> queryCnoticeBySender
	
        查询通知信息,类型是发起人的

        +---------+
        |Requests:|
        +---------+

        :param cnotice.uid: 用户ID
        :type cnotice.uid: Long

        Example::

            {
                "cnotice.uid": 63
            }

        +--------+
        |Returns:|
        +--------+

        :param cnotices: 通知信息列表 , 每条数据类型 :data:`cnotice`
        :type cnotices: List

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
		
    .. method:: <I-C> countCnoticeByReceiver
	
        查询通知数量,发起人(0)的通知数量 

        接收人(1)的通知数量

        +---------+
        |Requests:|
        +---------+

        :param cnotice.uid: 用户ID
        :type cnotice.uid: Long

        Example::

            {
                "cnotice.uid": 63
            }

        +--------+
        |Returns:|
        +--------+

        :param cnoticeCount: 数量信息列表 , 每条数据类型 :data:`cnotice`
        :type cnoticeCount: Object

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

    .. method:: <I-C> addCnotice
	
        添加通知信息

        +---------+
        |Requests:|
        +---------+

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
	
    .. method:: <I-C> deleteCnotice
	
        删除通知信息

        +---------+
        |Requests:|
        +---------+

        :param cnotice.cnid: 通知ID
        :type cnotice.cnid: Long

        Example::

            {
                "cnotice.cnid": 1
            }
	
    .. method:: <I-C> updateCnoticeStatusByCnid
	
        更新通知信息状态(1) 已读

        +---------+
        |Requests:|
        +---------+

        :param cnotice.cnid: 通知ID
        :type cnotice.cnid: Long
        :param cnotice.status: 通知ID
        :type cnotice.status: Short

        Example::

            {
                "cnotice.cnid": 1,
                "cnotice.status":1
            }