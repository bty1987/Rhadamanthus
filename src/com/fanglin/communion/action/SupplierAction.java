package com.fanglin.communion.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.communion.service.SupplierService;
import com.fanglin.communion.vo.SupplierVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierAction extends BaseListAction {

	private static final long serialVersionUID = 4369256746196774320L;
	
	@Autowired
	private SupplierService supplierService;
	
	private SupplierVO supplier;
	
	private String password;
	
	@Action(value="pageSupplier", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageBrand(){
		
		supplierService.pageSupplier(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="addSupplier", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addSupplier() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		supplierService.addSupplier(supplier);
		
		return SUCCESS;
	}
	
	@Action(value="updateSupplier", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateSupplier() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		supplierService.updateSupplier(supplier);
		
		return SUCCESS;
	}
	
	@Action(value="updateSupplierForLogin", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateSupplierForLogin() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		supplierService.updateSupplierForLogin(supplier);
		
		return SUCCESS;
	}
	
	@Action(value="updateSupplierForPassword", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateSupplierForPassword() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		supplierService.updateSupplierForPassword(supplier, password);
		
		return SUCCESS;
	}
	public SupplierVO getSupplier() {
		return supplier;
	}

	public void setSupplier(SupplierVO supplier) {
		this.supplier = supplier;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	
}
