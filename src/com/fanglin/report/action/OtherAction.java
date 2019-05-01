package com.fanglin.report.action;

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
import com.fanglin.information.service.VticketService;

@ParentPackage("common")
@Namespace("/")
@Controller
public class OtherAction extends BaseListAction {

	private static final long serialVersionUID = -4005684085957114814L;
	
	@Autowired
	private VticketService vticketService;
	
	@Autowired
	private VpaymentService vpaymentService;
	
	private List<?> counts;
	
	private short param;
	
	@Action(value="countVticket", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
    public String countVticket(){
		
		counts = vticketService.countVticket(param);
        
        return SUCCESS;
    }
	
	@Action(value="countVpayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String countVpayment() throws FLException{
		
		counts = vpaymentService.countVpayment();
		
		return SUCCESS;
	}

	public List<?> getCounts() {
		return counts;
	}

	public void setCounts(List<?> counts) {
		this.counts = counts;
	}

	public short getParam() {
		return param;
	}

	public void setParam(short param) {
		this.param = param;
	}
	
}
