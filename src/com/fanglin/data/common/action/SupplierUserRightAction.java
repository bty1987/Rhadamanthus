/**
 * @File Name		: SupplierUserRightAction.java
 * @Package   	: com.fanglin.data.action
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.common.service.SupplierUserRightService;
import com.fanglin.data.common.vo.SupplierUserRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierUserRightAction extends BaseListAction {

	private static final long serialVersionUID = 1187457947528986746L;
	
	@Autowired
	private SupplierUserRightService supplierUserRightService;
	
	private SupplierUserRightVO supplierUserRight;
	
	private List<SupplierUserRightVO> supplierUserRights;
	
	private List<String> userIds;
	
	@Action(value="querySupplierUserRightBySId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String querySupplierUserRightBySId(){
		
		supplierUserRights = supplierUserRightService.querySupplierUserRightBySId(supplierUserRight);
		
		return SUCCESS;
	}
	
	public SupplierUserRightVO getSupplierUserRight() {
		return supplierUserRight;
	}

	public void setSupplierUserRight(SupplierUserRightVO supplierUserRight) {
		this.supplierUserRight = supplierUserRight;
	}

	public List<SupplierUserRightVO> getSupplierUserRights() {
		return supplierUserRights;
	}

	public void setSupplierUserRights(List<SupplierUserRightVO> supplierUserRights) {
		this.supplierUserRights = supplierUserRights;
	}

	public List<String> getUserIds() {
		return userIds;
	}

	public void setUserIds(List<String> userIds) {
		this.userIds = userIds;
	}

}
