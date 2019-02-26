/**
 * Title: UserAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	@Autowired
	private UserService userService;

	private UserVO user;

	private UserInfoVO userInfo;

	private String pinyinName;

	private String duty;

	private List<UserBaseVO> userBases;

	private List<String> dutys;

	private List<String> dutysO;

	private List<KeyValueVO> autoFillKeyValue;

	private List<String> autoFillList;

	private String password;

	private String rePassword;

	private DepartmentTypeVO departmentType;

	private List<Integer> uids;

	@Action(value = "pageUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUser() throws FLException {

		userService.pageUser(getPaging(), getFilters(), user, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryUserByLoginId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByLoginId() throws FLException {

		user = userService.queryUserByLoginId(user);

		return SUCCESS;
	}

	@Action(value = "queryUserByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByUserId() throws FLException {

		user = userService.queryUserByUserId(user);

		return SUCCESS;
	}

	@Action(value = "queryUserInfoByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserInfoByUserId() throws FLException {

		userInfo = userService.queryUserInfoByUserId(userInfo);

		return SUCCESS;
	}

	@Action(value = "queryUserForSelfByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForSelfByUserId() throws FLException {

		userInfo = new UserInfoVO(new UserVO(queryUserId()));
		userInfo = userService.queryUserForSelfByUserId(userInfo);

		return SUCCESS;
	}

	@Action(value = "queryUserByOldUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByOldUserId() throws FLException {

		user = userService.queryUserByOldUserId(user);

		return SUCCESS;
	}

	@Action(value = "queryUserByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByPinyin() throws FLException {

		userBases = userService.queryUserByPinyin(pinyinName, user, departmentType, queryCompany());

		packageUserName(userBases);

		return SUCCESS;
	}

	@Action(value = "queryUserByUids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByUids() throws FLException {

		userBases = userService.queryUserByUids(uids);

		packageUserName(userBases);

		return SUCCESS;
	}

	@Action(value = "resetPassword", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String resetPassword() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userService.resetPassword(user, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addUser() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userService.addUser(userInfo, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUser() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userService.updateUser(userInfo, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateUserForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserForAdvance() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userService.updateUserForAdvance(user);

		return SUCCESS;
	}

	@Action(value = "defaultPassword", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String defaultPassword() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userService.defaultPassword(user.getUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "changePassword", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changePassword() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userService.checkUserForPassword(queryUserId(), password, rePassword);

		return SUCCESS;
	}

	@Action(value = "updateUserForBaseInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserForBaseInfo() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userService.updateUserForBaseInfo(userInfo);

		return SUCCESS;
	}

	@Action(value = "updateUserForProfiles", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserForProfiles() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userService.updateUserForProfiles(userInfo);

		return SUCCESS;
	}

	private void packageUserName(List<UserBaseVO> users) {
		for (UserBaseVO userBaseVO : users) {
			KeyValueVO keyValueVO = new KeyValueVO();

			StringBuffer value = new StringBuffer();
			value.append(userBaseVO.getCurrentName());
			value.append("-");
			value.append(userBaseVO.getDept().getName());

			keyValueVO.setKey(userBaseVO.getUserId());
			keyValueVO.setValue(value.toString());

			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(userBaseVO.getCurrentName());
		}
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public UserInfoVO getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(UserInfoVO userInfo) {
		this.userInfo = userInfo;
	}

	public List<KeyValueVO> getAutoFillKeyValue() {
		if (autoFillKeyValue == null) {
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue) {
		this.autoFillKeyValue = autoFillKeyValue;
	}

	public List<String> getAutoFillList() {
		if (autoFillList == null) {
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList) {
		this.autoFillList = autoFillList;
	}

	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}

	public String getDuty() {
		return duty;
	}

	public void setDuty(String duty) {
		this.duty = duty;
	}

	public List<String> getDutys() {
		return dutys;
	}

	public void setDutys(List<String> dutys) {
		this.dutys = dutys;
	}

	public List<String> getDutysO() {
		return dutysO;
	}

	public void setDutysO(List<String> dutysO) {
		this.dutysO = dutysO;
	}

	public List<UserBaseVO> getUserBases() {
		return userBases;
	}

	public void setUserBases(List<UserBaseVO> userBases) {
		this.userBases = userBases;
	}

	public String getPassword() {
		return password;
	}

	public String getRePassword() {
		return rePassword;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setRePassword(String rePassword) {
		this.rePassword = rePassword;
	}

	public DepartmentTypeVO getDepartmentType() {
		return departmentType;
	}

	public void setDepartmentType(DepartmentTypeVO departmentType) {
		this.departmentType = departmentType;
	}

	public List<Integer> getUids() {
		return uids;
	}

	public void setUids(List<Integer> uids) {
		this.uids = uids;
	}

}
