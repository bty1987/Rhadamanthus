package com.fanglin.system.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.json.annotations.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserApproveVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.service.UserApproveService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserApproveAction extends BaseListAction {

	private static final long serialVersionUID = 4493385608040589247L;

	@Autowired
	private UserApproveService userApproveService;
	
	private UserVO user;

	private UserApproveVO userApprove;

	private List<UserApproveVO> userApproveList;

	private List<Integer> userApproveIds;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	@Action(value = "pageUserApprove", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPageUserApprove(){
		
		userApproveService.pageUserApprove(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryApproveUserForNameByType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApproveUserForNameByType(){
		
		List<UserApproveVO> userApproveVOs = userApproveService.queryApproveUserForNameByType(user, userApprove);
		
		for(UserApproveVO userApproveVO : userApproveVOs){
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(userApproveVO.getUser().getUserId());
			keyValueVO.setValue(userApproveVO.getUser().getCurrentName() + "-" + userApproveVO.getUser().getUserId());
			
			getAutoFillKeyValue().add(keyValueVO);
		}
		
		return SUCCESS;
	}

	@Action(value = "addUserApprove", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addUserApprove() throws FLException{
		
		userApproveService.addUserApprove(userApprove);
		
		return SUCCESS;
	}

	@Action(value = "updateUserApprove", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserApprove() throws FLException{
		
		userApproveService.updateUserApprove(userApprove);
		
		return SUCCESS;
	}

	@Action(value = "deleteUserApprove", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteUserApprove(){
		
		userApproveService.deleteUserApprove(userApproveIds);
		
		return SUCCESS;
	}

	public UserApproveVO getUserApprove(){
		return userApprove;
	}

	public void setUserApprove(UserApproveVO userApprove){
		this.userApprove = userApprove;
	}

	@JSON(serialize = false)
	public List<Integer> getUserApproveIds(){
		return userApproveIds;
	}

	public void setUserApproveIds(List<Integer> userApproveIds){
		this.userApproveIds = userApproveIds;
	}

	public List<UserApproveVO> getUserApproveList(){
		return userApproveList;
	}

	public void setUserApproveList(List<UserApproveVO> userApproveList){
		this.userApproveList = userApproveList;
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

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

}
