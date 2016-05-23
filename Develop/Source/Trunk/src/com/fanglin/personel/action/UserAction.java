/**
 * Title: UserAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.personel.action;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.RoleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	@SuppressWarnings("unchecked")
	private List<RoleVO> roleList = Collections.EMPTY_LIST;

	@Autowired
	private UserService userService;
	
	private UserVO user;

	private String pinyinName;
	
	private String duty;
	
	private List<String> dutys;
	
	private List<String> dutysO;

	private List<String> userIds;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	private List<String> autoFillList;
	
	@Action(value = "pageUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUser() throws FLException{
		
		userService.pageUser(getPaging(), getFilters(), getUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "pageUserByNameOPinyinName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUserByNameOPinyinName() throws FLException{
		
		userService.pageUserByNameOPinyinName(getPaging(), user, getUserId());
		
		return SUCCESS;
	}

	@Action(value = "pageUserForResetPassword", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUserForResetPassword() throws FLException{
		
		userService.pageUserForResetPassword(getPaging(), getFilters(), getUserId());
		
		return SUCCESS;
	}

	@Action(value = "queryUserByLoginId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByLoginId(){
		
		user = userService.queryUserByLoginId(user.getLoginId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByUserId(){
		
		user = userService.queryUserByUserId(user.getUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForSelfByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForSelfByUserId() throws FLException{
		
		user = userService.queryUserByUserId(getUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserByOldUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByOldUserId(){
		
	    user = userService.queryUserByOldUserId(user.getOldUserId());
	    
	    return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByPinyinName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByPinyinName(){
		
		List<UserVO> userVOs = userService.queryUserForNameByPinyinName(pinyinName);
		
		packageUserName(userVOs);
		
		return SUCCESS;
	}

	@Action(value = "queryUserForNameByDuty", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByDuty(){
		
		List<UserVO> userVOs = userService.queryUserForNameByDuty(pinyinName, duty);
		
		packageUserName(userVOs);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByDutys", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByDutys(){
		
		List<UserVO> userVOs = userService.queryUserForNameByDutys(pinyinName, dutys);
		
		packageUserName(userVOs);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByDutyADept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserNamesByDutyDept() throws FLException{
		
		List<UserVO> userVOs = userService.queryUserForNameByDutyADept(pinyinName, duty, getUserId());
		
		packageUserName(userVOs);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByDutysADept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByDutysADept() throws FLException{
		
		List<UserVO> userVOs = userService.queryUserForNameByDutysADept(pinyinName, dutys, getUserId());
		
		packageUserName(userVOs);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByDutysAO", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByDutysAO(){
		
		List<UserVO> userVOs = userService.queryUserForNameByDutysAO(pinyinName, dutys, dutysO);
		
		packageUserName(userVOs);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByDutysAODept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByDutysAODept() throws FLException{
		
		List<UserVO> userVOs = userService.queryUserForNameByDutysAODept(pinyinName, dutys, dutysO, getUserId());
		
		packageUserName(userVOs);
		
		return SUCCESS;
	}
	
	private void packageUserName(List<UserVO> userVOs){
		for(UserVO userVO: userVOs){
			KeyValueVO keyValueVO = new KeyValueVO();
			
			StringBuffer value = new StringBuffer();
			value.append(userVO.getCurrentName());
			value.append("-");
			value.append(userVO.getDept().getDeptName());
			
			keyValueVO.setKey(userVO.getUserId());
			keyValueVO.setValue(value.toString());
			
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(userVO.getCurrentName());
		}
	}

	public UserVO getUser(){
		return user;
	}

	public void setUser(UserVO user){
		this.user = user;
	}

	public List<RoleVO> getRoleList(){
		return roleList;
	}

	public void setRoleList(List<RoleVO> roleList){
		this.roleList = roleList;
	}

	public List<KeyValueVO> getAutoFillKeyValue(){
		if(autoFillKeyValue == null){
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue){
		this.autoFillKeyValue = autoFillKeyValue;
	}

	public List<String> getAutoFillList(){
		if(autoFillList == null){
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList){
		this.autoFillList = autoFillList;
	}

	public String getPinyinName(){
		return pinyinName;
	}

	public void setPinyinName(String pinyinName){
		this.pinyinName = pinyinName;
	}

	public List<String> getUserIds(){
		return userIds;
	}

	public void setUserIds(List<String> userIds){
		this.userIds = userIds;
	}

	public String getDuty(){
		return duty;
	}

	public void setDuty(String duty){
		this.duty = duty;
	}

	public List<String> getDutys(){
		return dutys;
	}

	public void setDutys(List<String> dutys){
		this.dutys = dutys;
	}

	public List<String> getDutysO(){
		return dutysO;
	}

	public void setDutysO(List<String> dutysO){
		this.dutysO = dutysO;
	}

}
