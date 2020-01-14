package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.OutsourceService;
import com.fanglin.production.vo.OutsourceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OutsourceAction extends BaseListAction{

	private static final long serialVersionUID = -5430236603609546877L;
	
	private OutsourceVO outsource;
	
	private List<OutsourceVO> outsources;
	
	@Autowired
	private OutsourceService  outsourceService;
	
	@Action(value = "pageOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String pageOutsource () throws FLException{
		
		outsourceService.pageOutsource(getPaging(), getFilters(), queryCompany());
		
		return  SUCCESS;
	}
	
	@Action(value = "pageOutsourceForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String pageOutsourceForSupplier () throws FLException{
		
		outsourceService.pageOutsourceForSupplier(getPaging(), getFilters(),queryUserId(),queryCompany());
		
		return  SUCCESS;
	}
	
	@Action(value = "addOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String addOutsource() throws FLException{
	
		outsourceService.addOutsource(outsource,queryUserId(), queryCompany());
		
		return  SUCCESS;
	}
	
	@Action(value = "updateOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String updateOutsource() throws FLException{
	
		outsourceService.updateOutsource(outsource);
		
		return  SUCCESS;
	}
	
	@Action(value = "queryOutsourceByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String queryOutsourceByPid() throws FLException{
	
		outsources = outsourceService.queryOutsourceByPid(outsource,queryCompany());
		
		return  SUCCESS;
	}
	
	@Action(value = "passOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String passOutsource() throws FLException{

		outsourceService.passOutsource(outsource);
		
		return  SUCCESS;
	}
	
	@Action(value = "confirmOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String confirmOutsource() throws FLException{
	
		outsourceService.confirmOutsource(outsource);
		
		return  SUCCESS;
	}
	
	@Action(value = "finishOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String finishOutsource() throws FLException{
	
		outsourceService.finishOutsource(outsource,queryUserId());
		
		return  SUCCESS;
	}
	
	@Action(value = "deleteOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String deleteOutsource() throws FLException{
	
		outsourceService.deleteOutsource(outsource);
		
		return  SUCCESS;
	}

	public OutsourceVO getOutsource() {
		return outsource;
	}

	public void setOutsource(OutsourceVO outsource) {
		this.outsource = outsource;
	}

	public List<OutsourceVO> getOutsources() {
		return outsources;
	}

	public void setOutsources(List<OutsourceVO> outsources) {
		this.outsources = outsources;
	}

}
