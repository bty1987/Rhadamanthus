package com.fanglin.information.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.PhoneCallService;
import com.fanglin.information.vo.PhoneCallVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PhoneCallAction extends BaseListAction {

	private static final long serialVersionUID = -341930098017022857L;

	@Autowired
	private PhoneCallService phoneCallService;

	private PhoneCallVO phoneCall;

	private String token;

	@Action(value = "pagePhoneCall", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePhoneCall() throws FLException {

		phoneCallService.pagePhoneCall(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "phoneCall", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String phoneCall() throws FLException {

		try {
			phoneCallService.phoneCall(phoneCall);
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(160023);
			setErrorMsg("电话拨通中");
		}

		return SUCCESS;
	}

	@Action(value = "updatePhoneCallForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePhoneCallForInfo() {

		try {
			phoneCallService.updatePhoneCallForInfo(phoneCall);
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(160025);
			setErrorMsg("电话回拨失败");
		}
		return SUCCESS;
	}

	@Action(value = "updatePhoneCallForRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePhoneCallForRecord() {

		try {

			phoneCall.setToken(token);

			phoneCallService.updatePhoneCallForRecord(phoneCall);
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(160025);
			setErrorMsg("电话回拨失败");
		}
		return SUCCESS;
	}

	public PhoneCallVO getPhoneCall() {
		return phoneCall;
	}

	public void setPhoneCall(PhoneCallVO phoneCall) {
		this.phoneCall = phoneCall;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

}
