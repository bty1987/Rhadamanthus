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
	
	private long pid ;  
	
	@Action(value = "pageOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String pageOutsource (){
		
		outsourceService.pageOutsource(getPaging(), getFilters(),pid);
		
		return  SUCCESS;
	}
	
	@Action(value = "addOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String addOutsource(){
	
		outsourceService.addOutsource(outsource);
		
		return  SUCCESS;
	}
	
	@Action(value = "updateOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String updateOutsource() throws FLException{
	
		outsourceService.updateOutsource(outsource);
		
		return  SUCCESS;
	}
	
	@Action(value = "updateOutsourceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String updateOutsourceForStatus() throws FLException{
	
		outsourceService.updateOutsourceForStatus(outsource);
		
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

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}
	
}
