/**
 * @File Name		: A20260324Action.java
 * @Package   	: com.fanglin.seiya.action
 * @Version		: 1.0
 * @Date			: 2026-03-24
 * @Copyright	: Copyright Creators 2014
 * @Author		:
 * @Email			:
 * @Describing	:
 */

package com.fanglin.seiya.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.seiya.service.A20260324Service;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20260324Action extends BaseListAction {

	private static final long serialVersionUID = 20260324L;

	@Autowired
	private A20260324Service a20260324Service;

	// ==================== 请求参数 ====================
	/** 职位/部门名称 */
	private String name;

	/** 职位/部门ID或编码（更新时提供） */
	private String code;

	/** 部门编号（如：DEPT9526）- 职位同步保留但未使用 */
	private String org_code;

	/** 部门类型ID */
	private Integer type;

	/** 状态：1启用，2禁用 */
	private Integer status;

	/** 是否领导岗：0否，1是 - 职位同步专用 */
	private Integer leader_flag;

	/** 父部门编号（如：DEPT9525）- 部门同步专用 */
	private String parent_code;

	/** 排序值 - 部门同步专用 */
	private Integer order_value;

	/** 部门经理工号（如：FL-09527）- 部门同步专用 */
	private String leader_code;

	/** 定岗数据（JSON字符串）- 部门同步专用 */
	private String posts;

	// ==================== 用户同步专用参数 ====================
	/** 现用名（可选，默认使用name） */
	private String current_name;

	/** 性别：0女，1男（可选，默认1） */
	private Integer gender;

	/** 身份证号 */
	private String identity;

	/** 手机号 */
	private String phone;

	/** 登录用户名（可选，默认使用user.userId） */
	private String login_id;

	/** 部门ID（部门同步：更新定位优先级高于code；用户同步：必填） */
	private Integer dept_id;

	/** 职位ID */
	private Long duty_id;

	/** 公司ID（user.company） */
	private Integer company;

	// ==================== 响应字段 ====================
	/** 返回的职位ID或编码 */
	private String data;

	/**
	 * 同步职位信息接口
	 * 
	 * 请求参数示例： { "name": "司机", // 职位名称 "code": "POST9526", // 职位编码（更新时提供） "type": 1, // 部门类型ID "org_code": "DEPT9526", // 部门编号（保留但未使用） "status": 1, // 状态：1启用，2禁用 "leader_flag": 0 // 是否领导岗：0否，1是 }
	 * 
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncDuty", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,data" }) }, params = { "contentType", "text/html" })
	public String syncDuty() throws FLException {

		// 参数必填验证
		if (name == null || name.trim().isEmpty()) {
			throw new FLException(400010, "职位名称不能为空");
		}
		if (type == null) {
			throw new FLException(400019, "部门类型不能为空");
		}

		// 调用服务层处理
		data = a20260324Service.syncDuty(code, name, org_code, type, status, leader_flag);

		return SUCCESS;
	}

	/**
	 * 同步部门信息接口
	 * 
	 * 请求参数示例： { "dept_id": 123, // 部门主键ID（更新时提供，优先级高于code） "name": "设计一部", // 部门名称 "code": "DEPT9526", // 信息平台部门ID或编码：更新时提供 "type": 1, // 部门类型ID "parent_code": "DEPT9525", // 信息平台父级编码：创建/更新时提供 "org_code": "1", // 公司ID（对应 company.cid）：创建时提供 "status": 1, // 状态：1启用，2禁用 "order_value": 1, // 排序值 "leader_code": "FL-09527", // 部门经理工号 "posts": "{\"1\": 10, \"2\": 20}" // 定岗映射信息：岗位码 => 人员上限值（JSON字符串） }
	 * 
	 * 更新定位优先级：dept_id（主键）→ code（编码）；两者均为空时视为新增。
	 * 
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,data" }) }, params = { "contentType", "text/html" })
	public String syncDepartment() throws FLException {

		// 参数必填验证
		if (name == null || name.trim().isEmpty()) {
			throw new FLException(401001, "部门名称不能为空");
		}
		if (org_code == null || org_code.trim().isEmpty()) {
			throw new FLException(401002, "组织编码不能为空");
		}
		if (type == null) {
			throw new FLException(401003, "部门类型不能为空");
		}

		// 调用服务层处理
		data = a20260324Service.syncDepartment(dept_id, code, name, type, parent_code, org_code, status, leader_code, posts, order_value);

		return SUCCESS;
	}

	/**
	 * 同步用户信息接口
	 * 
	 * 请求参数示例： { "code": "FL-09527", // 用户工号（更新时提供，新增时为空） "name": "张三", // 姓名（必填） "current_name": "张三", // 现用名（可选，默认使用name） "gender": 1, // 性别：0女，1男（可选，默认1） "identity": "210xxx...", // 身份证号（必填） "phone": "13800138000", // 手机号（必填） "login_id": "zhangsan", // 登录用户名（可选，默认使用userId） "dept_id": 123, // 部门ID（必填） "duty_id": 456, // 职位ID（必填） "company": 1, // 公司ID（必填，user.company） "status": 1 // 状态：1在职, 0离职, 2停薪留职（可选，默认1） }
	 * 
	 * 响应示例： { "errorCode": 0, "errorMsg": "", "data": { "code": "12345", // user.uid "belong_org_code": "1", // user.company "userId": "FL-09527" // user.userId（工号） } }
	 * 
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,data" }) }, params = { "contentType", "text/html" })
	public String syncUser() throws FLException {

		// 参数必填验证
		if (name == null || name.trim().isEmpty()) {
			throw new FLException(402001, "姓名不能为空");
		}
		if (identity == null || identity.trim().isEmpty()) {
			throw new FLException(402002, "身份证号不能为空");
		}
		if (phone == null || phone.trim().isEmpty()) {
			throw new FLException(402003, "手机号不能为空");
		}
		if (dept_id == null) {
			throw new FLException(402005, "部门ID不能为空");
		}
		if (duty_id == null) {
			throw new FLException(402006, "职位ID不能为空");
		}
		if (company == null) {
			throw new FLException(402007, "公司ID不能为空");
		}

		// 调用服务层处理
		data = a20260324Service.syncUser(code, name, current_name, gender, identity, phone, login_id, dept_id, duty_id, company, status);

		return SUCCESS;
	}

	// ==================== Getter and Setter ====================

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getOrg_code() {
		return org_code;
	}

	public void setOrg_code(String org_code) {
		this.org_code = org_code;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getLeader_flag() {
		return leader_flag;
	}

	public void setLeader_flag(Integer leader_flag) {
		this.leader_flag = leader_flag;
	}

	public String getParent_code() {
		return parent_code;
	}

	public void setParent_code(String parent_code) {
		this.parent_code = parent_code;
	}

	public Integer getOrder_value() {
		return order_value;
	}

	public void setOrder_value(Integer order_value) {
		this.order_value = order_value;
	}

	public String getLeader_code() {
		return leader_code;
	}

	public void setLeader_code(String leader_code) {
		this.leader_code = leader_code;
	}

	public String getPosts() {
		return posts;
	}

	public void setPosts(String posts) {
		this.posts = posts;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getCurrent_name() {
		return current_name;
	}

	public void setCurrent_name(String current_name) {
		this.current_name = current_name;
	}

	public Integer getGender() {
		return gender;
	}

	public void setGender(Integer gender) {
		this.gender = gender;
	}

	public String getIdentity() {
		return identity;
	}

	public void setIdentity(String identity) {
		this.identity = identity;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getLogin_id() {
		return login_id;
	}

	public void setLogin_id(String login_id) {
		this.login_id = login_id;
	}

	public Integer getDept_id() {
		return dept_id;
	}

	public void setDept_id(Integer dept_id) {
		this.dept_id = dept_id;
	}

	public Long getDuty_id() {
		return duty_id;
	}

	public void setDuty_id(Long duty_id) {
		this.duty_id = duty_id;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
