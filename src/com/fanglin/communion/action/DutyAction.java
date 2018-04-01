package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.DutyService;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DutyAction extends BaseListAction{

	private static final long serialVersionUID = 3246937855994579649L;
	@Autowired
	private DutyService dutyService;
	
	private DutyVO duty;

	private List<DutyVO> dutys;
	
	@Action(value = "pageDuty", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDuty(){
		
		dutyService.pageDuty(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDuty", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDuty(){
		
		dutys=dutyService.queryDuty();
				
		
		return SUCCESS;
	}
	
	@Action(value = "queryDutyByDtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDutyByDtid(){
		
		dutys=dutyService.queryDutyByDtid(duty);
				
		
		return SUCCESS;
	}
	
	@Action(value = "addDuty", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDuty() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		dutyService.addDuty(duty);
		
		return SUCCESS;
	}
	
	@Action(value = "updateDuty", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDuty() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		dutyService.updateDuty(duty);
		
		return SUCCESS;
	}
	
	@Action(value = "updateDutyForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDutyForStatus() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		dutyService.updateDutyForStatus(duty);
		
		return SUCCESS;
	}
	
	public DutyVO getDuty() {
		return duty;
	}

	public void setDuty(DutyVO duty) {
		this.duty = duty;
	}

	public List<DutyVO> getDutys() {
		return dutys;
	}

	public void setDutys(List<DutyVO> dutys) {
		this.dutys = dutys;
	}


}
