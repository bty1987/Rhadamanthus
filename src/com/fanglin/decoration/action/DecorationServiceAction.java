package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationServiceService;
import com.fanglin.decoration.vo.DecorationServiceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationServiceAction extends BaseListAction{

	private static final long serialVersionUID = 1515051131753670098L;

	@Autowired
	private DecorationServiceService decorationServiceService;
	
	private List<DecorationServiceVO> decorationServices;
	
	private DecorationServiceVO decorationService;
	
	
	@Action(value = "queryDecorationServiceByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationServiceByOrderId(){
		
		decorationServices = decorationServiceService.queryDecorationServiceByOrderId(decorationService);
		
		return SUCCESS;
	}

	@Action(value = "addDecorationService", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationService() throws FLException{
		
		System.out.println("ACTION:"+authentication().getUserId());
		decorationServiceService.addDecortionService(decorationService,authentication());
		
		return SUCCESS;
	}
	
	@Action(value = "completeDecorationService", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String completeDecorationService() throws FLException{
		
		decorationServiceService.completeDecorationService(decorationService);
		
		return SUCCESS;
	}
	
	
	public List<DecorationServiceVO> getDecorationServices() {
		return decorationServices;
	}

	public void setDecorationServices(List<DecorationServiceVO> decorationServices) {
		this.decorationServices = decorationServices;
	}

	public DecorationServiceVO getDecorationService() {
		return decorationService;
	}

	public void setDecorationService(DecorationServiceVO decorationService) {
		this.decorationService = decorationService;
	}

	
}
