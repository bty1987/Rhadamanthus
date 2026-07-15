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
import com.fanglin.information.service.PlanService;
import com.fanglin.information.service.VawardService;
import com.fanglin.information.service.VpaymentService;
import com.fanglin.information.service.VprizeService;
import com.fanglin.information.service.VticketService;
import com.fanglin.information.vo.PlanVO;
import com.fanglin.information.vo.VawardVO;
import com.fanglin.information.vo.VpaymentVO;
import com.fanglin.information.vo.VprizeVO;
import com.fanglin.information.vo.VticketVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CommonAction extends BaseListAction {

	private static final long serialVersionUID = -4141641122501947005L;

	@Autowired
	private PlanService planService;

	@Autowired
	private VticketService vticketService;

	@Autowired
	private VpaymentService vpaymentService;

	@Autowired
	private VawardService vawardService;

	@Autowired
	private VprizeService vprizeService;

	private PlanVO plan;

	private List<VticketVO> vtickets;

	private VprizeVO vprize;

	private List<VprizeVO> vprizes;

	private VpaymentVO vpayment;

	private List<VpaymentVO> vpayments;

	private VawardVO vaward;

	private List<VawardVO> vawards;

	private String no;

	@Action(value = "pageVticketForSelf", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageVticketForSelf() throws FLException {

		vticketService.pageVticketForBelonger(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryVprizeByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVprizeByNo() throws FLException {

		vprizes = vprizeService.queryVprizeByNo(no);

		return SUCCESS;
	}

	@Action(value = "queryVpaymentByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVpaymentByNo() throws FLException {

		vpayments = vpaymentService.queryVpaymentByNo(vpayment);

		return SUCCESS;
	}

	@Action(value = "queryVawardByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVawardByNo() throws FLException {

		vawards = vawardService.queryVawardByNo(vaward);

		return SUCCESS;
	}

	@Action(value = "addVaward", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addVaward() throws FLException {

		vawardService.addVaward(vaward);

		return SUCCESS;
	}

	@Action(value = "updatePlanForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePlanSchedule() throws FLException {

		planService.updatePlanForAdvance(plan);

		return SUCCESS;
	}

	@Action(value = "deleteVaward", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteVaward() throws FLException {

		vawardService.deleteVaward(vaward);

		return SUCCESS;
	}

	public PlanVO getPlan() {
		return plan;
	}

	public void setPlan(PlanVO plan) {
		this.plan = plan;
	}

	public List<VticketVO> getVtickets() {
		return vtickets;
	}

	public void setVtickets(List<VticketVO> vtickets) {
		this.vtickets = vtickets;
	}

	public VprizeVO getVprize() {
		return vprize;
	}

	public void setVprize(VprizeVO vprize) {
		this.vprize = vprize;
	}

	public List<VprizeVO> getVprizes() {
		return vprizes;
	}

	public void setVprizes(List<VprizeVO> vprizes) {
		this.vprizes = vprizes;
	}

	public VpaymentVO getVpayment() {
		return vpayment;
	}

	public void setVpayment(VpaymentVO vpayment) {
		this.vpayment = vpayment;
	}

	public List<VpaymentVO> getVpayments() {
		return vpayments;
	}

	public void setVpayments(List<VpaymentVO> vpayments) {
		this.vpayments = vpayments;
	}

	public VawardVO getVaward() {
		return vaward;
	}

	public void setVaward(VawardVO vaward) {
		this.vaward = vaward;
	}

	public List<VawardVO> getVawards() {
		return vawards;
	}

	public void setVawards(List<VawardVO> vawards) {
		this.vawards = vawards;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

}
