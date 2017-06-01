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
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserVO;

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
	
	private List<UserVO> users;
	
	private List<String> dutys;
	
	private List<String> dutysO;

	private List<String> userIds;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	private List<String> autoFillList;
	
	@Action(value = "pageUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUser() throws FLException{
		
		userService.pageUser(getPaging(), getFilters(), user, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "pageUserByNameOPinyinName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUserByNameOPinyinName() throws FLException{
		
		userService.pageUserByNameOPinyinName(getPaging(), user, queryCompany());
		
		return SUCCESS;
	}

	@Action(value = "queryUserByLoginId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByLoginId() throws FLException{
		
		user = userService.queryUserByLoginId(user);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByUserId() throws FLException{
		
		user = userService.queryUserByUserId(user);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserInfoByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserInfoByUserId() throws FLException{
		
		userInfo = userService.queryUserInfoByUserId(userInfo);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForSelfByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForSelfByUserId() throws FLException{
		
		user = new UserVO(queryUserId());
		user = userService.queryUserByUserId(user);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserByOldUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserByOldUserId() throws FLException{
		
	    user = userService.queryUserByOldUserId(user);
	    
	    return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByPinyinName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByPinyinName(){
		
		users = userService.queryUserForNameByPinyinName(pinyinName);
		
		packageUserName(users);
		
		return SUCCESS;
	}

	@Action(value = "queryUserForNameByDuty", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByDuty(){
		
		users = userService.queryUserForNameByDuty(pinyinName, duty);
		
		packageUserName(users);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByDutys", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByDutys(){
		
		users = userService.queryUserForNameByDutys(pinyinName, dutys);
		
		packageUserName(users);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByDutyADept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserNamesByDutyDept() throws FLException{
		
		users = userService.queryUserForNameByDutyADept(pinyinName, duty, queryUserId());
		
		packageUserName(users);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByDutysADept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByDutysADept() throws FLException{
		
		users = userService.queryUserForNameByDutysADept(pinyinName, dutys, queryUserId());
		
		packageUserName(users);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByDutysAO", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByDutysAO(){
		
		users = userService.queryUserForNameByDutysAO(pinyinName, dutys, dutysO);
		
		packageUserName(users);
		
		return SUCCESS;
	}
	
	@Action(value = "queryUserForNameByDutysAODept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserForNameByDutysAODept() throws FLException{
		
		users = userService.queryUserForNameByDutysAODept(pinyinName, dutys, dutysO, queryUserId());
		
		packageUserName(users);
		
		return SUCCESS;
	}
	
	private void packageUserName(List<UserVO> users){
		for(UserVO userVO: users){
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

	public UserInfoVO getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(UserInfoVO userInfo) {
		this.userInfo = userInfo;
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

	public List<UserVO> getUsers() {
		return users;
	}

	public void setUsers(List<UserVO> users) {
		this.users = users;
	}

}
