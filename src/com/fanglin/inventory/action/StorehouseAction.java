/**
 * @File Name		: StorehouseAction.java
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
import com.fanglin.inventory.service.StorehouseService;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.personel.vo.UserBaseVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class StorehouseAction extends BaseListAction {

	private static final long serialVersionUID = -3140016731366048717L;

	@Autowired
	private StorehouseService storehouseService;

	private StorehouseVO storehouse;

	private List<StorehouseVO> storehouses;

	private UserBaseVO user;

	@Action(value = "pageStorehouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageStorehouse() {

		storehouseService.pageStorehouse(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryStorehouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryStorehouse() {

		storehouses = storehouseService.queryStorehouse(storehouse);

		return SUCCESS;
	}

	@Action(value = "queryStorehouseForSelf", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryStorehouseForSelf() throws FLException {

		storehouses = storehouseService.queryStorehouseByUserId(new UserBaseVO(queryUserId()));

		return SUCCESS;
	}

	@Action(value = "addStorehouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addStorehouse() throws FLException {

		storehouseService.addStorehouse(storehouse);

		return SUCCESS;
	}

	@Action(value = "updateStorehouseForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateStorehouseForStatus() throws FLException {

		storehouseService.updateStorehouseForStatus(storehouse);

		return SUCCESS;
	}

	public StorehouseVO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehouseVO storehouse) {
		this.storehouse = storehouse;
	}

	public List<StorehouseVO> getStorehouses() {
		return storehouses;
	}

	public void setStorehouses(List<StorehouseVO> storehouses) {
		this.storehouses = storehouses;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

}
