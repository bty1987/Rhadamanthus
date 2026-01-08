# dingtalk 钉钉
## 钉钉

## api.dingding.DingTalkAction

    #### user

    - **userid**: 员工编号
      - 类型: *String*
    - **name**: 员工名
      - 类型: *String*
    - **position**: 职位
      - 类型: *String*
    - **mobile**: 电话
      - 类型: *String*
    - **avatar**: 头像
      - 类型: *String*
    - **email**: 邮件
      - 类型: *String*
    - **department**: 部门
      - 类型: *Object*
    - **active**: 激活状态
      - 类型: *String*

    #### deptartment

    - **id**: ID
      - 类型: *Integer*
    - **name**: 部门名称
      - 类型: *String*
    - **parentid**: 父级部门ID
      - 类型: *Integer*

    ### `queryDDUser` <span style="color:gray">[内部]</span>

        通过员工编号查询该人员的钉钉相关信息

**请求参数**:

- **user.userId**:
  员工编号

        **示例**:{
                "user.userId": "FL-00001"
            }

**返回参数**:

- **user**: 员工信息 , 类型 *user*
          - 类型: *Object*

        **示例**:{
                ...
                "user": {
                    "active": true,
                    "avatar": "http://static.dingtalk.com/media/lADPACOG84WW3mjNAq7NAoA_640_686.jpg",
                    "department":{
                       0:2465645,
                       1:33271028
                    }
                    "email": null,
                    "extattr": null,
                    "mobile": "138xxxx3620",
                    "name": "白雪",
                    "openId": "TWZrgP4lkiS6cqniimPUNvYwiEiE",
                    "position": "设计师",
                    "status": 0,
                    "userid": "FL-00001",
                }
                ...
            }

    ### `queryDDDepartment` <span style="color:gray">[内部]</span>

        通过登录人员的当前登录的公司查询当前公司的钉钉组织结构

**返回参数**:

- **user**: 部门信息列表 , 每条数据类型 *department*
          - 类型: *List*

        **示例**:{
                ...
                "departments": [
                    0: {
                        "id": 2742563,
                        "name": "巡检部",
                        "parentid": 2747375,
                    },
                ],
                ...
            }

    ### `addDDUser` <span style="color:gray">[内部]</span>

        添加人员到钉钉

**请求参数**:

- **user.Mobile**:
  联系方式
        - **user.Position**:
  职位
        - **user.name**:
  姓名
        - **user.userid**:
  员工号
        - **dids**: 钉钉部门
          - 类型: *list*

        **示例**:{
                "user.Mobile": "13840103620",
                "user.Position": "设计师",
                "user.name" : "白雪",
                "user.userid": "FL-07033",
                "dids": [2465645,2742563],
            }

    ### `updateDDUser` <span style="color:gray">[内部]</span>

        更新员工钉钉信息

**请求参数**:

- **user.Mobile**:
  联系方式
        - **user.Position**:
  职位
        - **user.name**:
  姓名
        - **user.userid**:
  员工号
        - **dids**: 钉钉部门
          - 类型: *list*

        **示例**:{
                "user.Mobile": "13840103620",
                "user.Position": "设计师",
                "user.name" : "白雪",
                "user.userid": "FL-07033",
                "dids": [2465645,2742563],
            }

    ### `deleteDDUser` <span style="color:gray">[内部]</span>

        从钉钉中删除

**请求参数**:

- **user.userId**:
  员工编号

        **示例**:{
                "user.userId": "FL-00001"
            }

    ### `requestDDConfig` <span style="color:gray">[内部]</span>

    ### `queryDDUserInfo` <span style="color:gray">[内部]</span>

    ### `queryAccessToken` <span style="color:gray">[内部]</span>

    ### `queryJsapiTicket` <span style="color:gray">[内部]</span>

    ### `makeAccessToken` <span style="color:gray">[内部]</span>

    ### `batchmakeAccessToken` <span style="color:gray">[内部]</span>

    ###
