package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.VustomerService;
import com.fanglin.customer.vo.VustomerVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VustomerAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548181L;
	
	@Autowired
	private VustomerService vustomerService;
	
	private VustomerVO vustomer;
	
	private List<VustomerVO> vustomers;
	
	@Action(value = "pageVustomer", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String pageVustomer() throws FLException{
		
		vustomerService.pageVustomer(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "pageVustomerForAdvance", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String pageVustomerForAdvance(){
		
		vustomerService.pageVustomerForAdvance(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageVustomerForCommunion", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String pageVustomerForCommunion(){
		
		vustomerService.pageVustomerForCommunion(getPaging(), getFilters());
		
		return SUCCESS;
	}

	@Action(value = "updateVustomer", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String updateVustomer() throws FLException{
		
		vustomerService.updateVustomer(vustomer);
		
		return SUCCESS;
	}
	
	@Action(value = "freeVustomer", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String freeVustomer() throws FLException{
		
		vustomerService.freeVustomer(vustomer);
		
		return SUCCESS;
	}
	
	@Action(value = "takeVustomer", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String takeVustomer() throws FLException{
		
		vustomerService.takeVustomer(vustomer, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "updateVustomerForBelonger", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String updateVustomerForBelonger() throws FLException{
		
		vustomerService.updateVustomerForBelonger(vustomer);
		
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
