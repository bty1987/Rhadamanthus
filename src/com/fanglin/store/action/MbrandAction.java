package com.fanglin.store.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.MbrandService;
import com.fanglin.store.vo.MbrandVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MbrandAction extends BaseListAction{

	private static final long serialVersionUID = 6606015629580300464L;

	@Autowired
	private MbrandService mbrandService;
	
	private MbrandVO mbrand;
	
	@Action(value="pageMbrand", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMbrand(){
		
		mbrandService.pageMbrand(getPaging(), getFilters());
		
		return SUCCESS;
		
	}
	
	@Action(value="addMbrand", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMbrand() throws FLException{
		
		mbrandService.addMbrand(mbrand);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMbrand", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMbrand() throws FLException{
		
		mbrandService.updateMbrand(mbrand);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMbrandForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMbrandForStatus() throws FLException{
		
		mbrandService.updateMbrandForStatus(mbrand);
		
		return SUCCESS;
		
	}

	public MbrandVO getMbrand() {
		return mbrand;
	}

	public void setMbrand(MbrandVO mbrand) {
		this.mbrand = mbrand;
	}
	
}
