package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.DrawLineGroupService;
import com.fanglin.data.common.vo.DrawLineGroupVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DrawLineGroupAction extends BaseListAction {

	private static final long serialVersionUID = 244742108907409525L;
	
	@Autowired
	private DrawLineGroupService  drawLineGroupService ; 
	
	private  List<DrawLineGroupVO>  drawLineGroups;

	private DrawLineGroupVO drawLineGroup;
	
	@Action(value="pageDrawlineGroup", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageDrawLineGroup() throws FLException{
		
		 drawLineGroups = drawLineGroupService.pageDrawLineGroup(getPaging(), getFilters(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryDrawlineGroup", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDrawLineGroup() throws FLException{
		  
		  drawLineGroups = drawLineGroupService.queryDrawLineGroup(queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="addDrawlineGroup", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String saveDrawLineGroup() throws FLException{
		
		  drawLineGroupService.saveDrawLineGroup(drawLineGroup,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateDrawlineGroup", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateDrawLineGroup() throws FLException{
		
		  drawLineGroupService.updateDrawLineGroup(drawLineGroup);
		
		return SUCCESS;
	}
	
	@Action(value="updateDrawlineGroupForStatus", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateDrawLineGroupForStatus() throws FLException{
		
		  drawLineGroupService.updateDrawLineGroupForStatus(drawLineGroup);
		
		return SUCCESS;
	}
	
	public List<DrawLineGroupVO> getDrawLineGroups() {
		return drawLineGroups;
	}

	public void setDrawLineGroups(List<DrawLineGroupVO> drawLineGroups) {
		this.drawLineGroups = drawLineGroups;
	}

	public DrawLineGroupVO getDrawLineGroup() {
		return drawLineGroup;
	}

	public void setDrawLineGroup(DrawLineGroupVO drawLineGroup) {
		this.drawLineGroup = drawLineGroup;
	}

}
