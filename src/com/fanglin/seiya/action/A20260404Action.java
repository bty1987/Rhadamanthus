/**
 * @File Name		: A20260404Action.java
 * @Package   	: com.fanglin.seiya.action
 * @Version		: 1.0
 * @Date			: 2026-04-04
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: Supplier供应商数据同步
 */

package com.fanglin.seiya.action;

import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.seiya.service.A20260404Service;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20260404Action extends BaseListAction {

	private static final long serialVersionUID = 20260404L;

	@Autowired
	private A20260404Service a20260404Service;

	// ==================== 请求参数 ====================
	/** 供应商编号（也是 oldUserId 和 loginId） */
	private String userId;

	/** 供应商名称 */
	private String userName;

	/** 联系电话 */
	private String phone;

	/** 公司ID */
	private Integer company;

	/** 统一信用编码（对应 user.oldUserId） */
	private String creditCode;

	/** 所属厂商编号（user 表 type=1 的供应商用户） */
	private String supplierUserId;

	/** 品牌编号JSON数组字符串，如 ["B_001","B_002"]（对应 brand.no） */
	private String brands;

	/** 代理名称（可选，落 brandInstorer.agentName） */
	private String agentName;

	/** 代理电话（可选，落 brandInstorer.agentPhone） */
	private String agentPhone;

	/**
	 * 返回字段 - data对象，封装请求参数
	 */
	private Map<String, Object> data;

	// ==================== 响应字段 ====================

	/**
	 * 同步供应商数据接口
	 * 
	 * 通过编号(userId)判断是否存在，存在则更新，不存在则创建
	 * 
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,uid,data.*" }) }, params = { "contentType", "text/html" })
	public String syncSupplier() throws FLException {

		// 参数必填验证
		if (userId == null || userId.trim().isEmpty()) {
			throw new FLException(400011, "供应商编号不能为空");
		}
		if (userName == null || userName.trim().isEmpty()) {
			throw new FLException(400016, "供应商名称不能为空");
		}
		if (phone == null || phone.trim().isEmpty()) {
			throw new FLException(400020, "联系电话不能为空");
		}
		if (company == null) {
			throw new FLException(400024, "公司ID不能为空");
		}

		// 调用服务层处理
		Map<String, Object> result = a20260404Service.syncSupplier(userId, userName, phone, company, creditCode);

		// 设置响应数据
		this.data = result;

		return SUCCESS;
	}

	/**
	 * 同步驻店人员数据接口
	 *
	 * 通过编号(userId)判断是否存在：存在且类型为驻店员则更新，不存在则创建；存在但非驻店员则报错
	 * 同时以 brands 品牌编号列表为准全量对齐品牌绑定关系（补缺删多），并校验所属厂商有效性
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncInstorer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,uid,data.*" }) }, params = { "contentType", "text/html" })
	public String syncInstorer() throws FLException {

		// 参数必填验证
		if (userId == null || userId.trim().isEmpty()) {
			throw new FLException(400025, "驻店员编号不能为空");
		}
		if (userName == null || userName.trim().isEmpty()) {
			throw new FLException(400026, "驻店员名称不能为空");
		}
		if (phone == null || phone.trim().isEmpty()) {
			throw new FLException(400020, "联系电话不能为空");
		}
		if (company == null) {
			throw new FLException(400024, "公司ID不能为空");
		}
		if (supplierUserId == null || supplierUserId.trim().isEmpty()) {
			throw new FLException(400027, "厂商编号不能为空");
		}
		if (brands == null || brands.trim().isEmpty()) {
			throw new FLException(400033, "品牌列表不能为空且必须为JSON数组格式");
		}

		// 调用服务层处理
		Map<String, Object> result = a20260404Service.syncInstorer(userId, userName, phone, company, supplierUserId, brands, agentName, agentPhone);

		// 设置响应数据
		this.data = result;

		return SUCCESS;
	}

	// ==================== Getter and Setter ====================

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getCreditCode() {
		return creditCode;
	}

	public void setCreditCode(String creditCode) {
		this.creditCode = creditCode;
	}

	public String getSupplierUserId() {
		return supplierUserId;
	}

	public void setSupplierUserId(String supplierUserId) {
		this.supplierUserId = supplierUserId;
	}

	public String getBrands() {
		return brands;
	}

	public void setBrands(String brands) {
		this.brands = brands;
	}

	public String getAgentName() {
		return agentName;
	}

	public void setAgentName(String agentName) {
		this.agentName = agentName;
	}

	public String getAgentPhone() {
		return agentPhone;
	}

	public void setAgentPhone(String agentPhone) {
		this.agentPhone = agentPhone;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

}
