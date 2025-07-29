package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CustomerNoticeService;
import com.fanglin.customer.vo.CustomerNoticeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerNoticeAction extends BaseListAction {

	private static final long serialVersionUID = 1187649667392381541L;

	@Autowired
	private CustomerNoticeService customerNoticeService;

	private CustomerNoticeVO customerNotice;

	@Action(value = "pageCustomerNotice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerNotice() throws FLException {

		customerNoticeService.pageCustomerNotice(getPaging(), getFilters(), customerNotice);

		return SUCCESS;
	}

	public CustomerNoticeVO getCustomerNotice() {
		return customerNotice;
	}

	public void setCustomerNotice(CustomerNoticeVO customerNotice) {
		this.customerNotice = customerNotice;
	}

}
