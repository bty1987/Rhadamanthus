/**
 * @File Name		: SupplierAction.java
 * @Package   	: com.fanglin.data.action
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.common.service.SupplierService;
import com.fanglin.data.common.vo.SupplierVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierAction extends BaseListAction {

	private static final long serialVersionUID = 4369256746196774320L;
	
	@Autowired
	private SupplierService supplierService;
	
	private SupplierVO supplier;
	
	@Action(value="pageSupplier", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageBrand(){
		
		supplierService.pageSupplier(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	public SupplierVO getSupplier() {
		return supplier;
	}

	public void setSupplier(SupplierVO supplier) {
		this.supplier = supplier;
	}
	
}
