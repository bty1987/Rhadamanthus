/**
 * @File Name		: StorehouseUserAction.java
 * @Package   	: com.fanglin.inventory.action
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.StorehouseUserService;
import com.fanglin.inventory.vo.StorehouseUserVO;
import com.fanglin.personel.vo.UserBaseVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class StorehouseUserAction extends BaseListAction {

	private static final long serialVersionUID = 2824975916931267086L;
	
	@Autowired
	private StorehouseUserService storehouseUserService;
	
	private List<StorehouseUserVO> storehouseUsers;
	
	private UserBaseVO user;
	
	private List<Long> shIds;
	
	@Action(value = "queryStorehouseUserByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryStorehouseUserByUserId(){
		
		storehouseUsers = storehouseUserService.queryStorehouseUserByUserId(user);
		
		return SUCCESS;
	}
	
	@Action(value = "updateStorehouseUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateStorehouseUser() throws FLException{
		
		storehouseUserService.updateStorehouseUser(user, shIds);
		
		return SUCCESS;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public List<Long> getShIds() {
		return shIds;
	}

	public void setShIds(List<Long> shIds) {
		this.shIds = shIds;
	}

	public List<StorehouseUserVO> getStorehouseUsers() {
		return storehouseUsers;
	}

	public void setStorehouseUsers(List<StorehouseUserVO> storehouseUsers) {
		this.storehouseUsers = storehouseUsers;
	}

}
