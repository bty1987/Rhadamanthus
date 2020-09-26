package com.fanglin.store.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.MpaymentService;
import com.fanglin.store.vo.MpaymentVO;
import com.fanglin.store.vo.MuserVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class MpaymentAction extends BaseListAction {

	private static final long serialVersionUID = 6383258978800424942L;

	@Autowired
	private MpaymentService mpaymentService;

	private MpaymentVO mpayment;

	private MuserVO muser;

	@Action(value = "addMpayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMpayment() throws FLException {

		mpaymentService.addMpayment(mpayment, muser);

		return SUCCESS;
	}

	public MpaymentVO getMpayment() {
		return mpayment;
	}

	public void setMpayment(MpaymentVO mpayment) {
		this.mpayment = mpayment;
	}

	public MuserVO getMuser() {
		return muser;
	}

	public void setMuser(MuserVO muser) {
		this.muser = muser;
	}

}
