package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.VpaymentService;
import com.fanglin.information.vo.VpaymentVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class VpaymentAction extends BaseListAction{

	private static final long serialVersionUID = -6554413241328869566L;
	
	@Autowired
	private VpaymentService vpaymentService;
	
	private VpaymentVO vpayment;
	
	private List<?> counts;
	
	@Action(value = "pageVpayment", results = {@Result (name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String pageVpayment() throws FLException{
		
		vpaymentService.pageVpayment(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="deleteVpaymentId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteVpaymentId() throws FLException{
		
		vpaymentService.deleteVpaymentId(vpayment);
		
		return SUCCESS;
	}
	
	@Action(value = "createVpayment", results = {@Result (name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String createVpayment() throws FLException{
		
		vpaymentService.createVpayment(vpayment, queryUserId());
		
		return SUCCESS;
	}

	public VpaymentVO getVpayment() { 
		return vpayment;
	}

	public void setVpayment(VpaymentVO vpayment) {
		this.vpayment = vpayment;
	}

	public List<?> getCounts() {
		return counts;
	}

	public void setCounts(List<?> counts) {
		this.counts = counts;
	}
	

}
