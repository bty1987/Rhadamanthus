package com.fanglin.elecsign.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.elecsign.service.ElecsignAuthService;
import com.fanglin.elecsign.vo.ElecsignAuthVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ElecsignAuthAction extends BaseAction {

	private static final long serialVersionUID = 6210070100000100L;

	private CustomerVO customer;

	private List<ElecsignAuthVO> elecsignAuths;

	@Autowired
	private ElecsignAuthService elecsignAuthService;

	@Action(value = "queryElecsignAuthByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryElecsignAuthByCid() throws FLException {

		elecsignAuths = elecsignAuthService.queryElecsignAuthByCid(customer.getCid().intValue());

		return SUCCESS;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public List<ElecsignAuthVO> getElecsignAuths() {
		return elecsignAuths;
	}

	public void setElecsignAuths(List<ElecsignAuthVO> elecsignAuths) {
		this.elecsignAuths = elecsignAuths;
	}
}
