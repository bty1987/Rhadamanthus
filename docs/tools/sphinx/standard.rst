
.. _standard:

***************
编码规范
***************

Java编码规范
================

.. note::

    目的: 软件整个的生命周期过程中 , 提供代码开发维护人员对代码的可读以及理解过程提供一整套规范进行保证 , 以达到项目整体维护成本以及过程质量的保证 . 

    
**文件名 File Name**

文件后缀名(File Suffixes)

    +-----------------------------+------------------------------------------------------------+
    | 文件别名                    | 文件后缀                                                   |
    +=============================+============================================================+
    | Java源文件                  | \*.java                                                    |
    +-----------------------------+------------------------------------------------------------+
    | Java字节码文件              | \*.class                                                   |
    +-----------------------------+------------------------------------------------------------+
    
常用文件名(Common File Name)

    +----------------------------+-----------------------------------------------------------------+
    | 文件名                     | 用途                                                            |
    +============================+=================================================================+
    | README                     | 目录下所有内容文件的描述信息的文件                              |
    +----------------------------+-----------------------------------------------------------------+

**文件组织 Source File Orgnization**

    文件内容由空行分割而成的段落以及表示的注释信息组成 , 代码文件的内容尽量保证在较少的行数量之内 , 以便阅读 . 
  
**Java 源文件 Java Source Files**

    每个Java源文件都包含一个单一的公共类和接口 , 私有类尽量单独编写 , 不与其他公有类合并 , 保证单个文件中独立 . 具体遵循规则如下 : 
  
    Example::
  
        开头注释
        包和应用语句
        类和借口声明
    
**开头注释 Beginning Comments**

    所有Java文件都应该在文件开始部分进行注释 , 其中内容包括类名称 , 版本信息 , 日期 , 版权声明 , 开发人 , 邮箱 , 说明信息 .
    
    Example::
    
        /*
         * Class Name   : ClassName
         * Version      : 1.0
         * Date         : 2016.01.01
         * Copyright    : Copyright FangLin 2014
         * Author       : Author
         * Email        : xxx@xxx.com
         * Describing   : This module is struts execute handle . 
         */
         
    可以使用代码编辑工具中自带功能进行统一的文件格式进行处理 , 这样在每个文件创建完成之后 , 开头注释将自动完成 , 方便编码过程中开头注释信息编写工作 .
    
**包和引用 Package and Import Statements**

    多数Java源文件中 , 第一个非注释行是包语句行 , 之后是引入语句 , 包语句行和引入语句行利用空行分割 . 
    
    Example::
    
        package com.org.fanglin.core;
        
        import com.org.fanglin.core.Utils;
        
**类和接口声明 Class and Interface Declarations**

    类和接口声明的各个部分的先后顺序和说明信息
    
    +---------------------------------+------------------------------------------------------------------------------+
    | 类/接口声明                     | 说明                                                                         |
    +=================================+==============================================================================+
    | 类/接口文档注释                 | 注释的信息包含 , 如类说明信息 , 版本 , 时间 .                                |
    +---------------------------------+------------------------------------------------------------------------------+
    | 类/接口声明                     |                                                                              |
    +---------------------------------+------------------------------------------------------------------------------+
    | 类的(静态)变量                  | 声明顺序 , public -> protected -> default -> private , 静态在public之后 .    |
    +---------------------------------+------------------------------------------------------------------------------+
    | 实例变量                        | 声明顺序 , public -> protected -> default -> private , 静态在public之后 .    |
    +---------------------------------+------------------------------------------------------------------------------+
    | 构造器                          |                                                                              |
    +---------------------------------+------------------------------------------------------------------------------+
    | 方法                            | 方法按照其功能进行划分 .                                                     |
    +---------------------------------+------------------------------------------------------------------------------+
    
**缩进和排版 Indentation and Typesetting**

    4个空格作为缩进排版的一个单位 , 一个制表符代表4个空格 , 两个可以共同使用 . 
    
**行长度 Line length**

    代码每行的长度为128字符 , 在保证业务逻辑一致性以及可读性的同时 , 可以不经心换行 , 最长不能超过160字符 . 
    
**换行 Wrappping Lines**

    当一个代码行的字符数超过120个字符规定范围 , 需要将当前剩余代码进行换行 , 采用的一般规则有 : 
    
        逗号或者操作符后面断开 . 
        
        选择高级别的断开 . 
        
        新的一行与断开行同一级别表达式开头对齐 . 
        
    Example::
    
        public void someMethod(String longExpression1, String longExpression2, 
                          String longExpression3, String longExpression4, 
                          String longExpression5)
    
        int longName1 = longName2 * (longName3 + longName4 - longName5) + 
                        4 * longName6;
    
        if((condition1 && condition2) || (condition3 && condition4) || 
            !(condition5 && condition6)){}

    .. warning::
        
        如果条件允许 , 尽量避免同一逻辑代码进行换行 , 能够保证代码阅读的流畅程度 . 

**注释 Comments**

    实现注释 , 使用/\*…\*/和//来对当前需要进行说明的代码进行描述相应信息的注释 . 
    
    文档注释 , 使用/\*\*…\*/进行的注释 , 同时可以利用javadoc工具进行转换为Html文件 . 
    
    实现注释需要在代码必要位置以及业务处理较为复杂的位置进行必要的说明信息 . 此外 , 文件头信息中的针对当前的文件说明需要使用实现注释 . 文档注释必须填写 , 对当前类 , 接口 , 抽象类和方法等部分进行说明以及必要的描述 . 同时还可以包括相应的修改过程以及修改人信息 , 以便后期进行维护等工作 . 
    
    需要注意的是 , 频繁的注释可能反映出代码的低质量 , 当出现这种情况是 , 可能需要重构一下代码使其更加清晰 . 另外 , 过多的注释可能很容易过时 , 维护代码过程可能需要维护大量的注释信息 , 增加工作量 . 
    注释内容不应写在型号或字符 , 避免到处Html文档过程中出现页面显示错乱的情况 . 
    
**变量声明  Variable Declarations** 

    变量的声明一行一个进行声明 , 清晰可读的同时利于写注释信息 , 同时不将不同类型变量的声明在同一行进行声明 . 
    
    Example::
    
        int longName = 1;
        boolean condition1 = true;
        
    声明变量之后 , 变量都有进行默认的赋值 , 必要初始化的话 , 声明变量的同时进行初始化 . 

    变量的声明以及初始化需要在类定义 , 方法定义 , if语句 , for语句等代码块的开始进行 , 避免首次使用再进行变量声明初始化的过程 , 这样不利于代码的可读性 .
    
**类和接口的声明 Class and Interface Declarations**

    类名或接口名与左大括号之间不要有空格 .
     
    右大括号另起一行 , 与相应的声明语句对齐 , 空语句则左右大括号相邻 . 
        
**方法声明 Method Declarations**

    方法声明方式与类和接口的声明方式基本上 , 还有如下规则 :
     
        方法名和其参数列表之前的左括号间不要有空格 .
        
        参数列表中 , 参数之间分隔逗号后加一个空格 .
         
        参数列表右括号与左大括号之间不要有空格 . 
        
**简单语句 Single Statement**

    每行只包含一条语句 , 也就是分号分隔之后不能出现语句 , 但可以利用行尾注释进行说明 . 
    
**复合语句 Compound Statement**

    复合语句是包含在大括号中的语句序列 , 遵循以下规则 :
     
        包含在大括号中的语句序列需要缩进一个层次 . 
    
        左大括号位于复合语句起始行行尾 , 右大括号另起一行并与左大括号对齐 .
        
**返回语句 Return Statement**

    Example::
    
        return myExecute();
        
**if, if-else, if else-if else**

    if和if else与条件语句左括号之间不要空格 . 
    
    条件语句右括号以及else和左大括号之间不要空格 . 
    
    else if和else与前条件的右大括号 , 当前条件的左大括号以及条件在同一行 . 
    
    最后条件部分的右大括号另起一行 , 与if对齐 . 
    
    if-else语句需要利用大括号进行代码块的标识 , 即使是当行代码也需要大括号括起 .
    
    Example::
    
        if(condition1){
            System.out.println(condition1);
        }else if(condition2){
            System.out.println(condition2);
        }else{
            System.out.println(condition3);
        }
        
**for语句 For Statement**

    for语句遵循的规则与之前各个规则描述基本相同 , for之后与各个部分不要空格 . 另 , for语句三部分利用分号分隔 , 同时分号后带空格 . 
    
    for语句中的三个部分中 , 初始化部分中 , 定义的变量过多的话 , 避免在for语句中进行声 . 
    
    Example::
    
        for (initialization; condition; update) {
            statements;
        }
        
**while语句 While Statement**

    while语句遵循的规则与之前各个规则描述基本相同 , while , 条件 , 大括号之间不要空格 , 右大括号与while对齐 . 
    
    Example::
    
        while(condition){
            statements;
        }
        
**do-while语句 Do-while Statement**

    do-while语句遵循的规则与之前的各个部分规则描述基本相同 , 主要部分不用空格分隔 , 右大括号与do对齐 .
    
    Example::
    
        do{
            statements;
        }while(condition);
        
**switch语句 Switch Statement**

    switch语句遵循的规则与之前的各个模块规则描述基本相同 , 主要部分不使用空格分隔
    
    case语句和default语句缩进 . 
    
    case子句在缩进的基础上进行缩进 .

    break和continue至于需要另起一行编写 .
    
    Example::
    
        switch(condition){
            case condition1:
                System.out.println(condition1);
                break;
            case condition2:
                System.out.println(condition2);
                break;
            default:
                System.out.println(defaults);
        }
        
**try-catch语句 Try-catch Statement**

    try-catch语句遵循的规则与之前的各个模块规则描述基本相同 , 主要部分不使用空格分隔 . 
    
    Example::
    
        try{
            statements1;
        }catch(Exception e){
            statements2;
        }finally{
            statements3;
        }
        
**空行 Blank Lines**

    空行将逻辑相关的代码和内容进行分隔 , 增加代码的可读性 . 
    
    使用两行进行分隔的情况 :
    
        源文件的两个片段之间 .
         
        类声明或者接口声明之间 . 
        
    目前 , 使用两行进行分隔的情况出现较少 , 原因是单个文件避免出现多个接口声明或者类声明 . 
    
    使用一行进行分隔的情况 : 
    
        方法声明之间 . 
        
        方法变量声明和方法声明之间 . 
        
        块注释或单行注释之前 . 
        
        方法内 , 不同逻辑段之间 . 
        
**空格 Blank Space**

    参数列表中逗号的后面 . 
    
    二元运算符 , 除了引用符(.)之外 , 利用空格将运算符和操作数分开 . 
    
    For语句中中三部分中的分号后 . 
    
    类型强转后利用空格分隔 . 
    
**包名 Package Name**

    包名以及前缀全部由小写字符组成 . 
    
    本公司 , 所有包的前缀规定为com.fanglin.*
    
**类名 Class Name**

    类名由名字组成 , 驼峰式命名规范 , 一个或者多个单词组成 , 单词的首字母大写 . 

    类名简介而具有特点 , 能够简介的描述定义的类 , 避免使用缩写词 .
    
    Example::
    
        public class Handle{}
        
**接口 Interface**

    接口名定义方式与类名定义方式相同 , 或者在类名的基础上增加接口名称 . 
    
    Example::
    
        interface interfaceInc{}
        
**方法名 Method Name**

    方法名由动名词组成 , 驼峰式命名规范 , 一个或者多个单词组成 , 第一个单词的首字母小写 , 其他单词字母大写 . 
    
    Example::
    
        public int someMethod(String longExpression1){}
        
**变量名 Variable Name**

    变量名的定义规则与方法名的定义规则类似 , 不同是由名词组成 , 避免一个字母进行定义 , 除了临时变量 . 
    
    尽量不使用下划线和美元符号开头 , 尽管合法 .
    
    Example::
    
        int longName2 = 1;
        int longName3 = 1;
        
**变量 Constants**

    定义规则与变量名相似 , 不同在于 , 名称所有字符全部大写 , 同时不同单词之间利用下划线进行分隔 . 
    
    Example::
    
        public static final int MIN_WIDTH = 4;
        
**访问控制 Providing Access**

    通过封装的方式来控制访问 , 比如类变量和实例 , 需要私有定义 , 需要利用setten和getten来提供获取的方式 . 
    
**引用类变量和方法 Referring to Class Variables and Methods**

    避免使用对象访问一个雷的静态变量和静态方法 , 应该直接使用类名直接引用 . 
    
    Example::
    
        AClass.classMethod();
        
**变量赋值 Variable Assignments**

    避免一个语句给多个变量赋相同的值 . 
    
    Example::
    
        fooBar.fChar = barFoo.lchar = ‘c’;
        
    不使用内嵌赋值运算符师徒提高效率 . 
    
    Example::
    
        d = (a = b +c) + r;
        
**圆括号 Parenthese**

    在含有多种运算符的表达式中使用括号来变换运算符的优先级 . 
    

HTML编码规范
================

**文档类型 Document Type**

    文档使用HTML5进行申明 , <!DOCTYPE html>
    
**可选标签 Optional Tag**

    使用能通过标准规范验证的HTML代码 . 
    
    不推荐::
    
        <title>Test</title>
        <article>This is only a test.
            
    推荐::
    
        <!DOCTYPE html>
        <meta charset="utf-8">
        <title>Test</title>
        <article>This is only a test.</article>
        
**脚本加载 Script Loading**

    主页面(例main.html)中将<script>标签加到body结束之前 , 并带上async属性 , 同时需要考虑js脚本之间的关联关系 . 
    
    子页面 , 会利用jquery中的load方式进行加载 , 直接将<script>标签或者加载脚本过程放到页面尾部 . 
    
**缩进 Indentation**

    缩进的单位为四个空格 . 
    
**语义化 Semantic**

    根据元素(有时被错误地称作"标签")其被创造出来时的初始意义来使用它 . 打个比方 , 用 heading 元素来定义头部标题 , p 元素来定义文字段落 , 用 a 元素来定义链接锚点 . 

    有根据有目的地使用 HTML 元素 , 对于可访问性 , 代码重用 , 代码效率来说意义重大 . 
    
**关注点分离 Separation Concern**

    
    不使用超过一到两张样式表(i.e. main.css, vendor.css)
    
    不使用超过一到两个脚本
    
    不使用行内样式(<style>.no-good {}</style>)
    
    不在元素上使用 style 属性(<hr style="border-top: 5px solid black">)
    
    不使用行内脚本(<script>alert('no good')</script>)
    
    不使用表象元素(i.e. <b>, <u>, <center>, <font>, <b>)
    
    不使用表象 class 名(i.e. red, left, center)
    
**引号 Quotes**

    使用双引号("") 而不是单引号('')
    
    不推荐::
    
        <div class='news-article'></div>
            
    推荐::
    
        <div class="news-article"></div>
    
**Type属性 Type Attribute**

    标签已经说明本义 , 无需要type进行重复说明
    
    不推荐::
    
        <link rel="stylesheet" href="main.css" type="text/css">
        <script src="main.js" type="text/javascript"></script>
            
    推荐::
    
        <link rel="stylesheet" href="main.css">
        <script src="main.js"></script>
        
Javascript编码规范
================

