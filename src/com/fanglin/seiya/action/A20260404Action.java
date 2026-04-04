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
			throw new FLException(400001, "供应商编号不能为空");
		}
		if (userName == null || userName.trim().isEmpty()) {
			throw new FLException(400002, "供应商名称不能为空");
		}
		if (phone == null || phone.trim().isEmpty()) {
			throw new FLException(400003, "联系电话不能为空");
		}
		if (company == null) {
			throw new FLException(400004, "公司ID不能为空");
		}

		// 调用服务层处理
		Map<String, Object> result = a20260404Service.syncSupplier(userId, userName, phone, company);

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

}
