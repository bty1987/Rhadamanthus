package com.fanglin.payment.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.PaytranService;
import com.fanglin.payment.vo.PaytranVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PaytranAction extends BaseListAction {

	private static final long serialVersionUID = 2664725104672617015L;

	@Autowired
	private PaytranService paytranService;

	private List<PaytranVO> paytrans;

	private PaytranVO paytran;

	private String mchNo;

	private String bsCheckoutPublickey;

	private String bsPrivateKey;

	@Action(value = "pagePaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePaytran() throws FLException {

		paytranService.pagePaytran(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryPaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaytran() throws FLException {

		paytrans = paytranService.queryPaytran(paytran);

		return SUCCESS;
	}

	@Action(value = "queryPaytranByPtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaytranByPtid() throws FLException {

		paytran = paytranService.queryPaytranByPtid(paytran);

		return SUCCESS;
	}

	@Action(value = "sendPaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendPaytran() throws FLException {

		paytranService.sendPaytran(paytran);

		return SUCCESS;
	}

	@Action(value = "addPaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPaytran() throws FLException {

		int company = paytran.getBompany() != null ? CompanyServiceImpl.decode(paytran.getBompany()) : queryCompany();

		paytranService.addPaytran(paytran, queryUserId(), company);

		return SUCCESS;
	}

	@Action(value = "checkPaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkPaytran() throws FLException {

		int company = paytran.getBompany() != null ? CompanyServiceImpl.decode(paytran.getBompany()) : queryCompany();

		paytranService.checkPaytran(paytran, queryUserId(), company);

		return SUCCESS;
	}

	@Action(value = "cancelPaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelPaytran() throws FLException {

		int company = paytran.getBompany() != null ? CompanyServiceImpl.decode(paytran.getBompany()) : queryCompany();

		paytranService.cancelPaytran(paytran, company);

		return SUCCESS;
	}

	@Action(value = "deletePaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePaytran() throws FLException {

		paytranService.deletePaytran(paytran);

		return SUCCESS;
	}

	@Action(value = "pospay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pospay() throws FLException {

		int company = paytran.getBompany() != null ? CompanyServiceImpl.decode(paytran.getBompany()) : queryCompany();

		paytranService.pospay(paytran, company);

		return SUCCESS;
	}

	@Action(value = "codepay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String codepay() throws FLException {

		paytranService.codepay(paytran);

		return SUCCESS;
	}

	@Action(value = "updateKey", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateKey() throws FLException {

		paytranService.updateKey(mchNo, bsCheckoutPublickey, bsPrivateKey);

		return SUCCESS;
	}

	public List<PaytranVO> getPaytrans() {
		return paytrans;
	}

	public void setPaytrans(List<PaytranVO> paytrans) {
		this.paytrans = paytrans;
	}

	public PaytranVO getPaytran() {
		return paytran;
	}

	public void setPaytran(PaytranVO paytran) {
		this.paytran = paytran;
	}

	public String getMchNo() {
		return mchNo;
	}

	public void setMchNo(String mchNo) {
		this.mchNo = mchNo;
	}

	public String getBsCheckoutPublickey() {
		return bsCheckoutPublickey;
	}

	public void setBsCheckoutPublickey(String bsCheckoutPublickey) {
		this.bsCheckoutPublickey = bsCheckoutPublickey;
	}

	public String getBsPrivateKey() {
		return bsPrivateKey;
	}

	public void setBsPrivateKey(String bsPrivateKey) {
		this.bsPrivateKey = bsPrivateKey;
	}

}
