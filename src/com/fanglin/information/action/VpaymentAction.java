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
import com.fanglin.information.service.VreceiptService;
import com.fanglin.information.vo.VpaymentVO;
import com.fanglin.information.vo.VreceiptVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VpaymentAction extends BaseListAction {

	private static final long serialVersionUID = -6554413241328869566L;

	@Autowired
	private VpaymentService vpaymentService;

	@Autowired
	private VreceiptService vreceiptService;

	private VpaymentVO vpayment;

	private VreceiptVO vreceipt;

	private List<?> counts;

	private List<VpaymentVO> vpayments;

	private List<Long> posids;

	@Action(value = "pageVpayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageVpayment() throws FLException {

		vpaymentService.pageVpayment(getPaging(), getFilters(), vpayment);

		return SUCCESS;
	}

	@Action(value = "createVpayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createVpayment() throws FLException {

		vpaymentService.createVpayment(vpayment, queryUserId());

		return SUCCESS;
	}

	@Action(value = "collectVpayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectVpayment() throws FLException {

		vpaymentService.collectVpayment(vpayments, vreceipt, posids, queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryVpaymentByVrid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVpaymentByVrid() throws FLException {

		vpayments = vpaymentService.queryVpaymentByVrid(vpayment);

		return SUCCESS;
	}

	@Action(value = "queryVreceiptByVrid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVreceiptByVrid() throws FLException {

		vreceipt = vreceiptService.queryVreceiptByVrid(vreceipt);

		return SUCCESS;
	}

	public VpaymentVO getVpayment() {
		return vpayment;
	}

	public void setVpayment(VpaymentVO vpayment) {
		this.vpayment = vpayment;
	}

	public VreceiptVO getVreceipt() {
		return vreceipt;
	}

	public void setVreceipt(VreceiptVO vreceipt) {
		this.vreceipt = vreceipt;
	}

	public List<?> getCounts() {
		return counts;
	}

	public void setCounts(List<?> counts) {
		this.counts = counts;
	}

	public List<VpaymentVO> getVpayments() {
		return vpayments;
	}

	public void setVpayments(List<VpaymentVO> vpayments) {
		this.vpayments = vpayments;
	}

	public List<Long> getPosids() {
		return posids;
	}

	public void setPosids(List<Long> posids) {
		this.posids = posids;
	}

}
