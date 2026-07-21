#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
增量代码同步工具

基于"变更清单"在 Athena 多模块仓与 Rhadamanthus 工作区之间双向同步被改动的文件,
避免 FileCollect.py 的全量递归拷贝。本文件完全自包含,不依赖 FileCollect.py,
映射表 infos[] 与根路径在本文件内独立声明(与 FileCollect.py 保持手动同步)。

━━━ 清单文件格式(TSV,来自 git 提交日志) ━━━
    列0  文件相对路径(正斜杠)
    列1  扩展名(忽略)
    列2  状态  Modified / Added / Deleted / Renamed
    列3  新增行数(忽略)
    列4  删除行数(忽略)

示例:
    99.Foreground/ds/building.json           .json    Modified    3    210
    WebContent/js/com/version.js             .js      Modified    1    1
    src/com/fanglin/decoration/Foo.java      .java    Added        10    0
    src/com/fanglin/old/Bar.java             .java    Deleted       0    12

━━━ 方向判定(由列0路径前缀决定,单向避免覆盖) ━━━
    99.Foreground/...            → A→R (merge)
    WebContent/...               → R→A (issue)
    src/com/fanglin/...          → R→A (issue,后台代码在workspace维护,只回写Athena)

━━━ 清单列数 ━━━
    状态列自动识别:扫描每行各列,取第一个匹配 Modified/Added/Deleted/Renamed
    等关键字的列作为状态,路径始终取列0。兼容 4/5/6 列各种 git 日志导出格式。

━━━ 用法 ━━━
    python scripts/tool_marge_project_code.py                      # 读默认 scripts/changelist.txt
    python scripts/tool_marge_project_code.py --file list.txt      # 指定清单
    python scripts/tool_marge_project_code.py --file list.txt --dry-run   # 只打印计划不落盘
    python scripts/tool_marge_project_code.py merge --file list.txt       # 仅处理 A→R 行
    python scripts/tool_marge_project_code.py issue --file list.txt       # 仅处理 R→A 行

退出码: 0 正常 / 1 清单不存在或为空
"""

import os
import sys
import argparse

# ============================================================================
# 根路径配置(与 FileCollect.py 保持一致,如机器变更请两处同步)
# ============================================================================

path = "E:\\Ali\\Athena\\"
workspace = "E:\\Workspaces\\Rhadamanthus\\"
testenv = "E:\\Svn\\TI\\"

# ============================================================================
# 模块映射表(与 FileCollect.py 的 infos 完全一致)
#   source  : Athena 多模块仓内的源子目录(相对 path)
#   target  : Athena 仓内的前台聚合目标子目录(相对 path)
#   workspace: Rhadamanthus 工作区内对应的子目录(相对 workspace);后台模块为 None
#   files   : (可选) 文件名白名单,仅对共享目录(condition/api/utils)生效。
#             共享目录被多个模块重复声明指向同一 workspace 路径,
#             issue(R→A) 方向若不做过滤,一个模块的文件会被回写到所有声明
#             该共享目录的模块(产生垃圾文件)。声明 files 后,issue 方向
#             仅当当前文件名 ∈ files 才回写到该模块的 source 目录;
#             未声明 files 的映射保持原行为(向后兼容)。
#             公共文件(common.js/ds.js/log.js 等)不在任何业务模块的 files 内,
#             由顶层直连映射(99.Foreground/js/api 等)统一回写到聚合层。
# ============================================================================

infos = [
    {"source": "01.Decoration\\Foreground\\js\\decoration\\", "target": "99.Foreground\\js\\decoration\\", "workspace": "WebContent\\js\\decoration\\"},
    {"source": "01.Decoration\\Foreground\\views\\decoration\\", "target": "99.Foreground\\views\\decoration\\", "workspace": "WebContent\\views\\decoration\\"},
    {"source": "01.Decoration\\Foreground\\js\\contract\\", "target": "99.Foreground\\js\\contract", "workspace": "WebContent\\js\\contract\\"},
    {"source": "01.Decoration\\Foreground\\views\\contract\\", "target": "99.Foreground\\views\\contract\\", "workspace": "WebContent\\views\\contract\\"},
    {"source": "01.Decoration\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api", "files": ["decoration.js", "contract.js"]},
    {"source": "01.Decoration\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["decoration.js"]},
    {"source": "01.Decoration\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils", "workspace": "WebContent\\js\\utils\\", "files": ["decorationUtils.js", "decorationPageUtils.js"]},
    {"source": "01.Decoration\\Background\\decoration\\", "target": "src\\com\\fanglin\\decoration\\"},

    {"source": "02.Material\\Foreground\\js\\material\\", "target": "99.Foreground\\js\\material\\", "workspace": "WebContent\\js\\material\\"},
    {"source": "02.Material\\Foreground\\views\\material\\", "target": "99.Foreground\\views\\material\\", "workspace": "WebContent\\views\\material\\"},
    {"source": "02.Material\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils", "workspace": "WebContent\\js\\utils\\", "files": ["materialUtils.js"]},
    {"source": "02.Material\\Background\\material\\", "target": "src\\com\\fanglin\\material\\"},

    {"source": "03.Quotation\\Foreground\\js\\quotation\\", "target": "99.Foreground\\js\\quotation\\", "workspace": "WebContent\\js\\quotation\\"},
    {"source": "03.Quotation\\Foreground\\views\\quotation\\", "target": "99.Foreground\\views\\quotation\\", "workspace": "WebContent\\views\\quotation\\"},
    {"source": "03.Quotation\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api", "files": ["quotation.js"]},
    {"source": "03.Quotation\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["quotation.js"]},
    {"source": "03.Quotation\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils\\", "workspace": "WebContent\\js\\utils\\", "files": ["quotationUtils.js"]},
    {"source": "03.Quotation\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["quotation.json"]},
    {"source": "03.Quotation\\Background\\quotation\\", "target": "src\\com\\fanglin\\quotation\\"},

    {"source": "04.Construction\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["construction.js"]},
    {"source": "04.Construction\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["construction.js"]},
    {"source": "04.Construction\\Foreground\\js\\construction\\", "target": "99.Foreground\\js\\construction\\", "workspace": "WebContent\\js\\construction\\"},
    {"source": "04.Construction\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["construction.json"]},
    {"source": "04.Construction\\Foreground\\views\\", "target": "99.Foreground\\views\\construction\\", "workspace": "WebContent\\views\\construction\\"},
    {"source": "04.Construction\\Background\\construction\\", "target": "src\\com\\fanglin\\construction\\"},

    {"source": "05.Information\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["information.js"]},
    {"source": "05.Information\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["information.js"]},
    {"source": "05.Information\\Foreground\\js\\information\\", "target": "99.Foreground\\js\\information\\", "workspace": "WebContent\\js\\information\\"},
    {"source": "05.Information\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["information.json"]},
    {"source": "05.Information\\Foreground\\views", "target": "99.Foreground\\views\\information", "workspace": "WebContent\\views\\information"},
    {"source": "05.Information\\Background\\", "target": "src\\com\\fanglin\\information\\"},

    {"source": "07.Data\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["data.js"]},
    {"source": "07.Data\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition", "workspace": "WebContent\\js\\condition\\", "files": ["data.js"]},
    {"source": "07.Data\\Foreground\\js\\data", "target": "99.Foreground\\js\\data\\", "workspace": "WebContent\\js\\data\\"},
    {"source": "07.Data\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["data.json"]},
    {"source": "07.Data\\Foreground\\views\\", "target": "99.Foreground\\views\\data", "workspace": "WebContent\\views\\data\\"},
    {"source": "07.Data\\Background\\data\\", "target": "src\\com\\fanglin\\data\\"},

    {"source": "08.Inventory\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["inventory.js"]},
    {"source": "08.Inventory\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["inventory.js"]},
    {"source": "08.Inventory\\Foreground\\js\\manifest\\", "target": "99.Foreground\\js\\manifest\\", "workspace": "WebContent\\js\\manifest\\"},
    {"source": "08.Inventory\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["manifest.json"]},
    {"source": "08.Inventory\\Foreground\\views\\manifest\\", "target": "99.Foreground\\views\\manifest\\", "workspace": "WebContent\\views\\manifest\\"},
    {"source": "08.Inventory\\Background\\", "target": "src\\com\\fanglin\\inventory\\"},

    {"source": "09.Approval\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["approval.js"]},
    {"source": "09.Approval\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["approval.js"]},
    {"source": "09.Approval\\Foreground\\js\\approval\\", "target": "99.Foreground\\js\\approval\\", "workspace": "WebContent\\js\\approval\\"},
    {"source": "09.Approval\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils\\", "workspace": "WebContent\\js\\utils\\", "files": ["approvalUtils.js"]},
    {"source": "09.Approval\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["approval.json"]},
    {"source": "09.Approval\\Foreground\\views\\", "target": "99.Foreground\\views\\approval\\", "workspace": "WebContent\\views\\approval\\"},
    {"source": "09.Approval\\Background\\", "target": "src\\com\\fanglin\\approval\\"},

    {"source": "10.Salary\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["salary.js"]},
    {"source": "10.Salary\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["salary.js"]},
    {"source": "10.Salary\\Foreground\\js\\salary\\", "target": "99.Foreground\\js\\salary\\", "workspace": "WebContent\\js\\salary\\"},
    {"source": "10.Salary\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["salary.json"]},
    {"source": "10.Salary\\Foreground\\views\\", "target": "99.Foreground\\views\\salary\\", "workspace": "WebContent\\views\\salary\\"},
    {"source": "10.Salary\\Background\\salary\\", "target": "src\\com\\fanglin\\salary\\"},

    {"source": "11.Payment\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["payment.js"]},
    {"source": "11.Payment\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["payment.js"]},
    {"source": "11.Payment\\Foreground\\js\\payment\\", "target": "99.Foreground\\js\\payment\\", "workspace": "WebContent\\js\\payment\\"},
    {"source": "11.Payment\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils", "workspace": "WebContent\\js\\utils\\", "files": ["paymentUtils.js"]},
    {"source": "11.Payment\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["payment.json"]},
    {"source": "11.Payment\\Foreground\\views\\payment\\", "target": "99.Foreground\\views\\payment\\", "workspace": "WebContent\\views\\payment\\"},
    {"source": "11.Payment\\Background\\payment\\", "target": "src\\com\\fanglin\\payment\\"},

    {"source": "12.Personnel\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["personel.js"]},
    {"source": "12.Personnel\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["personel.js"]},
    {"source": "12.Personnel\\Foreground\\js\\personel\\", "target": "99.Foreground\\js\\personel\\", "workspace": "WebContent\\js\\personel\\"},
    {"source": "12.Personnel\\Foreground\\js\\contract\\", "target": "99.Foreground\\js\\contract", "workspace": "WebContent\\js\\contract\\", "files": ["contract.js"]},
    {"source": "12.Personnel\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils\\", "workspace": "WebContent\\js\\utils\\", "files": ["userUtils.js"]},
    {"source": "12.Personnel\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["personel.json"]},
    {"source": "12.Personnel\\Foreground\\views\\personel\\", "target": "99.Foreground\\views\\personnel", "workspace": "WebContent\\views\\personnel"},
    {"source": "12.Personnel\\Foreground\\views\\contract\\", "target": "99.Foreground\\views\\contract\\", "workspace": "WebContent\\views\\contract\\"},
    {"source": "12.Personnel\\Background\\personel\\", "target": "src\\com\\fanglin\\personel\\"},

    {"source": "13.Finance\\Background\\finance", "target": "src\\com\\fanglin\\finance\\"},

    {"source": "14.DingDing\\Background\\", "target": "src\\com\\fanglin\\dingding\\"},

    {"source": "15.Right\\Background\\", "target": "src\\com\\fanglin\\right\\"},

    {"source": "16.Production\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["production.js"]},
    {"source": "16.Production\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["production.js"]},
    {"source": "16.Production\\Foreground\\js\\production\\", "target": "99.Foreground\\js\\production\\", "workspace": "WebContent\\js\\production\\"},
    {"source": "16.Production\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils", "workspace": "WebContent\\js\\utils", "files": ["productionUtils.js", "productionPageUtils.js"]},
    {"source": "16.Production\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["production.json"]},
    {"source": "16.Production\\Foreground\\views\\", "target": "99.Foreground\\views\\production\\", "workspace": "WebContent\\views\\production\\"},
    {"source": "16.Production\\Background\\", "target": "src\\com\\fanglin\\production\\"},

    {"source": "17.Import\\Background\\", "target": "src\\com\\fanglin\\imports\\"},

    {"source": "18.Export\\Background\\", "target": "src\\com\\fanglin\\exports\\"},

    {"source": "19.System\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["system.js"]},
    {"source": "19.System\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["system.js"]},
    {"source": "19.System\\Foreground\\js\\system\\", "target": "99.Foreground\\js\\system\\", "workspace": "WebContent\\js\\system\\"},
    {"source": "19.System\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["system.json"]},
    {"source": "19.System\\Foreground\\views\\", "target": "99.Foreground\\views\\system", "workspace": "WebContent\\views\\system\\"},
    {"source": "19.System\\Background\\", "target": "src\\com\\fanglin\\system\\"},

    {"source": "20.Building\\Foreground\\js\\building\\", "target": "99.Foreground\\js\\building", "workspace": "WebContent\\js\\building\\"},
    {"source": "20.Building\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api", "workspace": "WebContent\\js\\api\\", "files": ["building.js"]},
    {"source": "20.Building\\Foreground\\js\\condition", "target": "99.Foreground\\js\\condition", "workspace": "WebContent\\js\\condition\\", "files": ["building.js"]},
    {"source": "20.Building\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["building.json"]},
    {"source": "20.Building\\Foreground\\views\\building", "target": "99.Foreground\\views\\building", "workspace": "WebContent\\views\\building"},
    {"source": "20.Building\\Background\\building", "target": "src\\com\\fanglin\\building\\"},

    {"source": "21.Sales\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["sales.js"]},
    {"source": "21.Sales\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["sales.js"]},
    {"source": "21.Sales\\Foreground\\js\\sales\\", "target": "99.Foreground\\js\\sales\\", "workspace": "WebContent\\js\\sales\\"},
    {"source": "21.Sales\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils\\", "workspace": "WebContent\\js\\utils\\", "files": ["salesUtils.js", "salesPageUtils.js"]},
    {"source": "21.Sales\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["sales.json"]},
    {"source": "21.Sales\\Foreground\\views\\sales\\", "target": "99.Foreground\\views\\sales", "workspace": "WebContent\\views\\sales\\"},
    {"source": "21.Sales\\Background\\", "target": "src\\com\\fanglin\\sales\\"},

    {"source": "22.Report\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["report.js"]},
    {"source": "22.Report\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["report.js"]},
    {"source": "22.Report\\Foreground\\js\\report\\", "target": "99.Foreground\\js\\report\\", "workspace": "WebContent\\js\\report\\"},
    {"source": "22.Report\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["report.json"]},
    {"source": "22.Report\\Foreground\\views\\", "target": "99.Foreground\\views\\report\\", "workspace": "WebContent\\views\\report\\"},
    {"source": "22.Report\\Background\\", "target": "src\\com\\fanglin\\report\\"},

    {"source": "23.Communion\\Background\\communion\\", "target": "src\\com\\fanglin\\communion\\"},

    {"source": "24.Store\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["store.js"]},
    {"source": "24.Store\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["store.js"]},
    {"source": "24.Store\\Foreground\\js\\store\\", "target": "99.Foreground\\js\\store\\", "workspace": "WebContent\\js\\store\\"},
    {"source": "24.Store\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["store.json"]},
    {"source": "24.Store\\Foreground\\views\\store\\", "target": "99.Foreground\\views\\store\\", "workspace": "WebContent\\views\\store\\"},
    {"source": "24.Store\\Background\\store\\", "target": "src\\com\\fanglin\\store\\"},

    {"source": "25.Customer\\Foreground\\js\\customer\\", "target": "99.Foreground\\js\\customer\\", "workspace": "WebContent\\js\\customer\\"},
    {"source": "25.Customer\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["customer.js"]},
    {"source": "25.Customer\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["customer.js"]},
    {"source": "25.Customer\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["customer.json"]},
    {"source": "25.Customer\\Foreground\\views\\customer\\", "target": "99.Foreground\\views\\customer\\", "workspace": "WebContent\\views\\customer\\"},
    {"source": "25.Customer\\Background\\", "target": "src\\com\\fanglin\\customer\\"},

    {"source": "26.Market\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["market.js"]},
    {"source": "26.Market\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["market.js"]},
    {"source": "26.Market\\Foreground\\js\\market", "target": "99.Foreground\\js\\market", "workspace": "WebContent\\js\\market"},
    {"source": "26.Market\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["market.json"]},
    {"source": "26.Market\\Foreground\\views\\market", "target": "99.Foreground\\views\\market", "workspace": "WebContent\\views\\market"},
    {"source": "26.Market\\Background\\market", "target": "src\\com\\fanglin\\market\\"},

    {"source": "27.Balance\\Foreground\\js\\balance\\", "target": "99.Foreground\\js\\balance\\", "workspace": "WebContent\\js\\balance\\"},
    {"source": "27.Balance\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["balance.js"]},
    {"source": "27.Balance\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["balance.js"]},
    {"source": "27.Balance\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\", "files": ["balance.json"]},
    {"source": "27.Balance\\Foreground\\views\\balance\\", "target": "99.Foreground\\views\\balance\\", "workspace": "WebContent\\views\\balance\\"},
    {"source": "27.Balance\\Background\\balance\\", "target": "src\\com\\fanglin\\balance\\"},

    {"source": "28.Fadada\\Background\\fadada\\", "target": "src\\com\\fanglin\\fadada\\"},
    {"source": "29.Yinsheng\\Background\\yspay\\", "target": "src\\com\\fanglin\\yspay\\"},
    {"source": "30.Kingdee\\Background\\kingdee\\", "target": "src\\com\\fanglin\\kingdee\\"},
    {"source": "31.Postar\\Background\\", "target": "src\\com\\fanglin\\postar\\"},
    {"source": "32.Wechat\\Background\\", "target": "src\\com\\fanglin\\wechat\\"},
    {"source": "33.Seiya\\Background\\", "target": "src\\com\\fanglin\\seiya\\"},
    {"source": "34.Aliyun\\Background\\", "target": "src\\com\\fanglin\\aliyun\\"},
    {"source": "35.Elecsign\\Background\\", "target": "src\\com\\fanglin\\elecsign\\"},
    
    {"source": "36.Log\\Foreground\\js\\log\\", "target": "99.Foreground\\js\\log\\", "workspace": "WebContent\\js\\log\\"},
    {"source": "36.Log\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\", "files": ["log.js"]},
    {"source": "36.Log\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\", "files": ["log.js"]},
    {"source": "36.Log\\Foreground\\views\\log\\", "target": "99.Foreground\\views\\log\\", "workspace": "WebContent\\views\\log\\"},
    {"source": "36.Log\\Background\\log\\", "target": "src\\com\\fanglin\\log\\"},

    {"source": "99.Foreground\\js\\api\\", "target": "WebContent\\js\\api\\"},
    {"source": "99.Foreground\\js\\com\\", "target": "WebContent\\js\\com\\"},
    {"source": "99.Foreground\\js\\condition\\", "target": "WebContent\\js\\condition\\"},
    {"source": "99.Foreground\\js\\i18n\\", "target": "WebContent\\js\\i18n\\"},
    {"source": "99.Foreground\\js\\utils\\", "target": "WebContent\\js\\utils\\"},
    {"source": "99.Foreground\\ds", "target": "WebContent\\ds"},

    {"source": "97.Database", "target": "dbs\\"},
]

# ============================================================================
# 默认清单路径(不入库,见 .gitignore)
# ============================================================================

DEFAULT_CHANGELIST = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                  "changelist.txt")

# Athena 聚合目录前缀(A→R 方向的清单路径前缀)
ATHENA_AGG_PREFIX = "99.Foreground/"

# ============================================================================
# 清单解析
# ============================================================================

def parse_changelist(list_path):
    """
    解析 TSV 清单,返回 [(relpath, action), ...]

    action: 'C' (copy, Added/Modified/Renamed) | 'D' (delete)

    状态列自动识别:扫描每行各列,取第一个匹配状态关键字的列作为状态,
    路径始终取 cols[0]。兼容 4/5/6 列各种来源的 git 日志导出格式。

    跳过空行、表头、无状态列的异常行。路径分隔符统一为正斜杠。
    """
    # 状态关键字集合(小写匹配)
    status_keywords = {
        "deleted": "D",
        "delete": "D",
        "removed": "D",
        "remove": "D",
        "modified": "C",
        "modify": "C",
        "added": "C",
        "add": "C",
        "renamed": "C",
        "rename": "C",
        "updated": "C",
        "update": "C",
        "changed": "C",
        "change": "C",
    }

    items = []
    lineno = 0
    with open(list_path, encoding="utf-8") as f:
        for raw in f:
            lineno += 1
            line = raw.rstrip("\n").rstrip("\r")
            if not line.strip():
                continue
            cols = line.split("\t")
            if len(cols) < 2:
                continue
            relpath = cols[0].strip().replace("\\", "/")
            if not relpath:
                continue

            # 扫描 cols[1..] 找第一个状态列
            action = None
            for col in cols[1:]:
                key = col.strip().lower()
                if key in status_keywords:
                    action = status_keywords[key]
                    break

            if action is None:
                # 该行无任何状态关键字(可能是表头/注释/格式异常),跳过
                sys.stderr.write("    [!] 第%d行未识别到状态,跳过: %s\n"
                                 % (lineno, relpath))
                continue
            items.append((relpath, action))
    return items


# ============================================================================
# 路径工具
# ============================================================================

def norm(p):
    """路径归一化:统一为正斜杠 + 小写,用于前缀匹配(Windows 大小写不敏感)。"""
    return p.replace("\\", "/").lower()


def to_ospath(p):
    """把正斜杠路径转为 OS 原生分隔符,用于实际文件访问。"""
    return p.replace("/", os.sep)


def _is_prefix(rel, prefix):
    """
    rel 是否在 prefix 目录下(目录级匹配,非字符串裸前缀)。
    rel 和 prefix 均为归一化后的正斜杠小写形式。
    """
    if prefix == "":
        return False
    rel = rel.lstrip("/")
    prefix = prefix.rstrip("/")
    if rel == prefix:
        # prefix 本身就是该文件(无尾随子路径)——理论上 prefix 都是目录,这里兜底
        return True
    return rel.startswith(prefix + "/")


def _strip_prefix_case(relpath_orig, prefix):
    """
    从原始 relpath(保留大小写)剥掉 prefix 目录,返回剩余片段(原始大小写)。

    用 norm 后的字符串判断前缀匹配,但切片基于原始 relpath,
    保证拼出来的真实文件路径大小写正确。

    relpath_orig: 原始 relpath(正斜杠,保留大小写)
    prefix:       待剥的目录前缀(infos 里的原始值,可能含反斜杠)
    """
    rel = relpath_orig.lstrip("/").replace("\\", "/")
    pref = norm(prefix).rstrip("/")
    # 按"/"分段,逐段匹配,保留原始大小写的剩余部分
    rel_segs = rel.split("/")
    pref_segs = pref.split("/")
    if len(rel_segs) < len(pref_segs):
        return rel
    # 逐段比较(大小写不敏感)
    for i, ps in enumerate(pref_segs):
        if rel_segs[i].lower() != ps:
            return rel  # 不匹配,原样返回(调用方已先用 _is_prefix 判断过)
    return "/".join(rel_segs[len(pref_segs):])


# ============================================================================
# 核心:为一个清单文件解析出所有需要同步的 (from_abs, to_abs) 对
# ============================================================================

def resolve_pairs(relpath, direction):
    """
    遍历 infos[],按 relpath 前缀匹配,产出该文件在指定方向下所有需要同步的
    (from_abs, to_abs) 对。

    direction: 'merge' (A→R) | 'issue' (R→A)

    注意:不同 info 可能产出相同的 (from,to)(共享目录被多模块重复声明),
    返回前按 (from,to) 去重,避免重复 IO。

    infos 三类记录(字段语义不同):
      ① 前台模块: source=模块源码目录(相对path), target=Athena聚合目录,
                  workspace=工作区目录
      ② 后台模块: source=模块源码目录, target=src/com/fanglin/xxx, 无workspace
      ③ 顶层直连: source=99.Foreground/xxx, target=WebContent/xxx, 无workspace
                  (聚合层与工作区的桥,source本身就在Athena聚合目录下)

    各方向匹配规则:
      merge (A→R):
        ①②  匹配 target(Athena聚合/src路径),从 source 拷到 workspace侧
        ③   匹配 source(99.Foreground聚合路径),从 source 拷到 workspace侧(target)
      issue (R→A):
        匹配 workspace侧路径(workspace 或 target),反向写回 Athena 侧的 source;
        若 target 与 workspace侧路径不同,也回写 target(普通前台/后台模块);
        若相同(顶层直连的 target 就是 workspace 路径),不重复回写。
    """
    pairs = []
    rel_n = norm(relpath)

    for info in infos:
        source = info.get("source", "")
        target = info.get("target", "")
        ws = info.get("workspace")  # 后台模块/顶层直连为 None

        # 顶层直连:无 workspace 且 source 在 Athena 聚合层(99.Foreground)
        is_direct = ws is None and norm(source).startswith("99.foreground/")
        # workspace 侧路径:优先 workspace,否则 target(后台/顶层直连)
        ws_side = ws if ws else target

        if direction == "merge":
            if is_direct:
                # ③ 顶层直连:匹配 source(99.Foreground 聚合路径)
                if not _is_prefix(rel_n, norm(source)):
                    continue
                relative = _strip_prefix_case(relpath, source)
                if relative == "":
                    continue
                from_abs = os.path.join(path, to_ospath(source), to_ospath(relative))
                to_abs = os.path.join(workspace, to_ospath(target), to_ospath(relative))
            else:
                # ①② 普通模块:匹配 target
                if not _is_prefix(rel_n, norm(target)):
                    continue
                relative = _strip_prefix_case(relpath, target)
                if relative == "":
                    continue

                # 共享目录(condition/api/utils)按文件名归属模块:
                # 若 info 声明了 files 白名单,且当前文件不在白名单内,跳过该 info。
                # 避免 Athena 各模块目录下残留的同名旧文件互相覆盖 workspace。
                files = info.get("files")
                if files:
                    rel_first = relative.split("/")[0].lstrip("\\").strip()
                    if rel_first not in files:
                        continue

                ath_src = source if source else target
                from_abs = os.path.join(path, to_ospath(ath_src), to_ospath(relative))
                to_abs = os.path.join(workspace, to_ospath(ws_side), to_ospath(relative))
            pairs.append((from_abs, to_abs))

        elif direction == "issue":
            # 匹配 workspace 侧路径(ws_side)
            if not ws_side or not _is_prefix(rel_n, norm(ws_side)):
                continue
            relative = _strip_prefix_case(relpath, ws_side)
            if relative == "":
                continue

            # 共享目录(condition/api/utils)按文件名归属模块:
            # 若 info 声明了 files 白名单,且当前文件不在白名单内,跳过该 info。
            # 避免一个模块的文件被回写到所有声明了同共享目录的模块。
            files = info.get("files")
            if files:
                rel_first = relative.split("/")[0].lstrip("\\").strip()
                if rel_first not in files:
                    continue

            from_abs = os.path.join(workspace, to_ospath(ws_side), to_ospath(relative))

            if is_direct:
                # ③ 顶层直连:只回写 source(target 是 workspace 自己)
                pairs.append((from_abs,
                              os.path.join(path, to_ospath(source), to_ospath(relative))))
            else:
                # ①② 回写 source(模块源码)
                ath_src = source if source else target
                pairs.append((from_abs,
                              os.path.join(path, to_ospath(ath_src), to_ospath(relative))))
                # target 与 workspace侧不同时,也回写 target(聚合目录)
                if norm(target) != norm(ws_side):
                    pairs.append((from_abs,
                                  os.path.join(path, to_ospath(target), to_ospath(relative))))

    # 去重(共享目录被多模块重复声明时,同一 (from,to) 可能被产出多次)
    seen = set()
    unique = []
    for from_abs, to_abs in pairs:
        key = (os.path.normpath(from_abs).lower(),
               os.path.normpath(to_abs).lower())
        if key in seen:
            continue
        seen.add(key)
        unique.append((from_abs, to_abs))
    return unique


# ============================================================================
# 方向判定
# ============================================================================

def decide_directions(relpath):
    """
    根据清单路径前缀判定该行参与哪些方向的同步。

    返回去重保序的 list:['merge'] / ['issue'] / ['merge','issue']。

    方向规则(单向,避免双向同时执行导致覆盖):
      99.Foreground/...  → merge  (A→R,Athena 聚合层 → workspace)
      WebContent/...     → issue  (R→A,workspace → Athena)
      src/com/fanglin/...→ issue  (R→A,workspace 改的源码回写 Athena;
                                   这类代码实际在 ERP 工作区维护,
                                   只走 R→A 避免 Athena 旧码覆盖 workspace 新码)
      其它               → 双向兜底尝试
    """
    rel_n = norm(relpath)
    dirs = []
    if rel_n.startswith(norm(ATHENA_AGG_PREFIX)):
        dirs.append("merge")
    if rel_n.startswith("webcontent/"):
        dirs.append("issue")
    if rel_n.startswith("src/com/fanglin/"):
        # 后台 Java 代码:只在 workspace 改,只回写 Athena,绝不反向覆盖
        dirs.append("issue")
    if not dirs:
        # 未知前缀,默认双向都尝试(resolve_pairs 匹配不上自然为空)
        dirs = ["merge", "issue"]
    # 去重保序
    seen = set()
    out = []
    for d in dirs:
        if d not in seen:
            seen.add(d)
            out.append(d)
    return out


# ============================================================================
# 同步执行
# ============================================================================

def sync_one(from_abs, to_abs, action, dry_run=False):
    """
    执行单次同步,返回 (status, msg)。
    status: 'ok' / 'skip' / 'warn'

    action='C':拷贝 from→to(二进制),源不存在则 warn
    action='D':删除 to,目标不存在静默 skip
    """
    is_a2r = from_abs.lower().startswith(path.lower())
    tag = "A→R" if is_a2r else "R→A"
    base_from = path if is_a2r else workspace
    # to 的展示基准:若 to 落在 path 下用 path,否则用 workspace
    base_to = path if to_abs.lower().startswith(path.lower()) else workspace
    try:
        short_from = os.path.relpath(from_abs, base_from)
    except ValueError:
        short_from = from_abs
    try:
        short_to = os.path.relpath(to_abs, base_to)
    except ValueError:
        short_to = to_abs

    if action == "D":
        if os.path.exists(to_abs):
            if not dry_run:
                os.remove(to_abs)
            return ("ok", "[D][%s] del  %s" % (tag, short_to))
        return ("skip", "[D][%s] miss %s (目标不存在,跳过)" % (tag, short_to))

    # action == 'C'
    if not os.path.exists(from_abs):
        return ("warn", "[C][%s] miss %s (源不存在,跳过)" % (tag, short_from))
    if not dry_run:
        os.makedirs(os.path.dirname(to_abs), exist_ok=True)
        with open(from_abs, "rb") as sf, open(to_abs, "wb") as tf:
            tf.write(sf.read())
    return ("ok", "[C][%s] copy %s → %s" % (tag, short_from, short_to))


def run(changelist_path, direction_filter=None, dry_run=False):
    """
    主流程。

    direction_filter: None(由每行前缀自决) | 'merge' | 'issue'
    """
    if not os.path.exists(changelist_path):
        print("[X] 清单文件不存在: %s" % changelist_path)
        sys.exit(1)

    items = parse_changelist(changelist_path)
    if not items:
        print("[X] 清单为空或无可识别行: %s" % changelist_path)
        sys.exit(1)

    print("=" * 72)
    print("  增量代码同步%s" % ("  [DRY-RUN]" if dry_run else ""))
    print("  清单: %s" % changelist_path)
    print("  条目: %d   方向过滤: %s"
          % (len(items), direction_filter or "自动(按路径前缀)"))
    print("=" * 72)

    stats = {"ok": 0, "skip": 0, "warn": 0}
    unmatched = 0

    for relpath, action in items:
        dirs = decide_directions(relpath)
        if direction_filter:
            dirs = [d for d in dirs if d == direction_filter]
        if not dirs:
            continue

        line_matched = False
        for d in dirs:
            pairs = resolve_pairs(relpath, d)
            if not pairs:
                continue
            line_matched = True
            for from_abs, to_abs in pairs:
                status, msg = sync_one(from_abs, to_abs, action, dry_run)
                print("    %s" % msg)
                stats[status] += 1
        if not line_matched:
            unmatched += 1
            print("    [?] %s  (未匹配任何 infos 映射,跳过)" % relpath)

    print("\n" + "=" * 72)
    print("  汇总%s" % ("  [DRY-RUN,未落盘]" if dry_run else ""))
    print("=" * 72)
    print("  成功: %d" % stats["ok"])
    print("  跳过: %d" % stats["skip"])
    print("  警告: %d" % stats["warn"])
    print("  未匹配清单行: %d" % unmatched)


# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="基于变更清单的增量代码同步(Athena ↔ Rhadamanthus)")
    parser.add_argument("command", nargs="?", default=None,
                        choices=["merge", "issue"],
                        help="限制方向: merge=仅 A→R, issue=仅 R→A;"
                             " 不填则按清单每行路径前缀自动判定")
    parser.add_argument("-f", "--file", default=DEFAULT_CHANGELIST,
                        help="变更清单文件(TSV),默认 scripts/changelist.txt")
    parser.add_argument("--dry-run", action="store_true",
                        help="只打印同步计划,不实际拷贝/删除")
    args = parser.parse_args()

    run(changelist_path=args.file,
        direction_filter=args.command,
        dry_run=args.dry_run)


if __name__ == "__main__":
    main()
