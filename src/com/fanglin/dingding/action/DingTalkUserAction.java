/**
 * @File Name		: DingTalkUserAction.java
 * @Package   	: com.fanglin.dingding.action
 * @Version		: 1.0
 * @Date			: 2015-11-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 钉钉用户管理 Action
 */

package com.fanglin.dingding.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.bean.User;
import com.fanglin.dingding.service.UserService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DingTalkUserAction extends BaseListAction {

	private static final long serialVersionUID = -6593413211279089778L;

	@Autowired
	private UserService userService;

	private User user;

	private List<Long> dids;

	private int errcode;

	/**
	 * 查询钉钉用户
	 */
	@Action(value = "queryDDUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUser() throws FLException {

		user = userService.getUser(user.getUserid(), queryCompany());

		return SUCCESS;
	}

	/**
	 * 添加钉钉用户
	 */
	@Action(value = "addDDUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDDUser() throws FLException {

		errcode = userService.addDDUser(user, dids, queryCompany());

		return SUCCESS;
	}

	/**
	 * 更新钉钉用户
	 */
	@Action(value = "updateDDUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUser() throws FLException {

		errcode = userService.updateDDUser(user, dids, queryCompany());

		return SUCCESS;
	}

	/**
	 * 删除钉钉用户
	 */
	@Action(value = "deleteDDUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteUser() throws FLException {

		errcode = userService.deleteDDUser(user, queryCompany());

		return SUCCESS;
	}

	// Getters and Setters

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getCode() {
		return user != null ? user.getCode() : null;
	}

	public void setCode(String code) {
		if (user != null) {
			user.setCode(code);
		}
	}

	public List<Long> getDids() {
		return dids;
	}

	public void setDids(List<Long> dids) {
		this.dids = dids;
	}

	public int getErrcode() {
		return errcode;
	}

	public void setErrcode(int errcode) {
		this.errcode = errcode;
	}

}
