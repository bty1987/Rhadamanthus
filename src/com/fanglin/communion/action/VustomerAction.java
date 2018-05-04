package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.VustomerService;
import com.fanglin.communion.vo.VustomerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VustomerAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548181L;
	
	@Autowired
	private VustomerService vustomerService;
	
	private VustomerVO vustomer;
	
	private List<VustomerVO> vustomers;
	
	@Action(value="pageVustomer", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageVustomer(){
		
		vustomerService.pageVustomer(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="queryVustomer", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryVustomer(){
		
		vustomers = vustomerService.queryVustomer();
		
		return SUCCESS;
	}
	
	@Action(value="queryVustomerByIdent", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryVustomerByIdent(){
		
		vustomers = vustomerService.queryVustomerByIdent(vustomer);
		
		return SUCCESS;
	}
	
	@Action(value="addVustomer", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addVustomer() {
		
		vustomerService.addVustomer(vustomer);
		
		return SUCCESS;
	}
	
	@Action(value="updateVustomer", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateVustomer() throws FLException{
		
		vustomerService.updateVustomer(vustomer);
		
		return SUCCESS;
	}
	
	@Action(value="deleteVustomer", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteVustomer(){
		
		vustomerService.deleteVustomer(vustomer);
		
		return SUCCESS;
	}

	public VustomerVO getVustomer() {
		return vustomer;
	}

	public void setVustomer(VustomerVO vustomer) {
		this.vustomer = vustomer;
	}

	public List<VustomerVO> getVustomers() {
		return vustomers;
	}

	public void setVustomers(List<VustomerVO> vustomers) {
		this.vustomers = vustomers;
	}
	
}
