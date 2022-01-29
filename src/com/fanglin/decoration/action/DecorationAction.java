package com.fanglin.decoration.action;

import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.vo.DecorationPaymentVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;

	@Autowired
	private DecorationService decorationService;

	private List<DecorationVO> decorations;

	private DecorationVO decoration;

	private DecorationInfoVO decorationInfo;

	private String decorationOrderId;

	private long backup = 0;

	private List<DecorationPaymentVO> decorationPayments;

	private short timeType;

	private Timestamp dateTime;

	private List<Short> statuses;

	private String customerPhone;

	@Action(value = "pageDecoration", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecoration() throws FLException {

		decorationService.pageDecoration(getPaging(), getFilters(), authentication(), statuses);

		return SUCCESS;
	}

	@Action(value = "pageDecorationForGeneral", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForGeneral() throws FLException {

		decorationService.pageDecorationForGeneral(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}

	@Action(value = "pageDecorationForCommon", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForCommon() throws FLException {

		decorationService.pageDecorationForCommon(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}

	@Action(value = "pageDecorationForCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForCompany() throws FLException {

		decorationService.pageDecorationForCompany(getPaging(), getFilters(), queryCompany(), statuses);

		return SUCCESS;
	}

	@Action(value = "pageDecorationForGrade", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForGrade() throws FLException {

		decorationService.pageDecorationForGrade(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageDecorationForCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForCustomer() throws FLException {

		decorationService.pageDecorationForCustomer(getPaging(), getFilters(), customerPhone, queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageDecorationForDesigner", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForDesigner() throws FLException {

		decorationService.pageDecorationForDesigner(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}

	@Action(value = "pageDecorationForSalesman", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForSalesman() throws FLException {

		decorationService.pageDecorationForSalesman(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}

	@Action(value = "pageDecorationForBelong", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForBelong() throws FLException {

		decorationService.pageDecorationForBelong(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}

	@Action(value = "pageDecorationForQuoter", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForQuoter() throws FLException {

		decorationService.pageDecorationForQuoter(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}

	@Action(value = "pageDecorationForEscorter", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForEscorter() throws FLException {

		decorationService.pageDecorationForEscorter(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}

	@Action(value = "pageDecorationForDesignerManager", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForDesignerManager() throws FLException {

		decorationService.pageDecorationForDesignerManager(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}

	@Action(value = "pageDecorationForSalesmanManager", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForSalesmanManager() throws FLException {

		decorationService.pageDecorationForSalesmanManager(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}

	@Action(value = "queryDecorationByCustomerId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationByCustomerId() throws FLException {

		decorations = decorationService.queryDecorationByCustomerId(decoration, authentication());

		return SUCCESS;
	}

	@Action(value = "queryDecorationByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationByOrderId() throws FLException {

		decoration = decorationService.queryDecorationByOrderId(decorationOrderId);

		return SUCCESS;
	}

	@Action(value = "queryDecorationForCommonByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationForCommonByOrderId() throws FLException {

		decoration = decorationService.queryDecorationForCommonByOrderId(decoration, queryUserId());

		return SUCCESS;
	}

	@Action(value = "checkDecoration", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkDecoration() throws FLException {

		decoration = decorationService.checkDecoration(decoration, authentication());

		return SUCCESS;
	}

	@Action(value = "createDecoration", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createDecoration() throws FLException {

		decorationService.createDecoration(decoration, decorationInfo, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "createDecorationForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createDecorationForAdvance() throws FLException {

		decorationService.createDecorationForAdvance(decoration, decorationInfo, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "changeDecorationForOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForOrderId() throws FLException {

		decorationService.changeDecorationForOrderId(decoration.getOrderId(), decorationOrderId, queryUserId());

		return SUCCESS;
	}

	@Action(value = "changeDecorationForTime", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForCreateTime() throws FLException {

		decorationService.changeDecorationForTime(decoration, timeType, dateTime, queryUserId());

		return SUCCESS;
	}

	@Action(value = "changeDecorationForVersionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForVersionId() throws FLException {

		decorationService.changeDecorationForVersionId(decoration, queryUserId());

		return SUCCESS;
	}

	@Action(value = "changeDecorationForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForStatus() throws FLException {

		decorationService.changeDecorationForStatus(decoration, queryUserId());

		return SUCCESS;
	}

	@Action(value = "changeDecorationForHouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForHouse() throws FLException {

		decorationService.changeDecorationForHouse(decoration, queryUserId());

		return SUCCESS;
	}

	@Action(value = "obsoleteDecoration", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String obsoleteDecoration() throws FLException {

		decorationService.obsoleteDecoration(decoration, queryUserId());

		return SUCCESS;
	}

	@Action(value = "terminalDecoration", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String terminalDecoration() throws FLException {

		decorationService.terminalDecoration(decoration, decorationPayments, authentication());

		return SUCCESS;
	}

	@Action(value = "changeDecorationForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForAdvance() throws FLException {

		decorationService.changeDecorationForAdvance(decoration, decorationInfo, queryUserId());

		return SUCCESS;
	}

	@Action(value = "subDecorationForQuotationTime", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String subDecorationForQuotationTime() throws FLException {

		decorationService.subDecorationForQuotationTime(decoration, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "changeDecorationForRepairStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForRepairStatus() throws FLException {

		decorationService.changeDecorationForRepairStatus(decoration);

		return SUCCESS;
	}

	public List<DecorationVO> getDecorations() {
		return decorations;
	}

	public void setDecorations(List<DecorationVO> decorations) {
		this.decorations = decorations;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public void setDecorationOrderId(String decorationOrderId) {
		this.decorationOrderId = decorationOrderId;
	}

	public long getBackup() {
		return backup;
	}

	public void setBackup(long backup) {
		this.backup = backup;
	}

	public String getDecorationOrderId() {
		return decorationOrderId;
	}

	public short getTimeType() {
		return timeType;
	}

	public void setTimeType(short timeType) {
		this.timeType = timeType;
	}

	public Timestamp getDateTime() {
		return dateTime;
	}

	public void setDateTime(Timestamp dateTime) {
		this.dateTime = dateTime;
	}

	public DecorationInfoVO getDecorationInfo() {
		return decorationInfo;
	}

	public void setDecorationInfo(DecorationInfoVO decorationInfo) {
		this.decorationInfo = decorationInfo;
	}

	public List<Short> getStatusas() {
		return statuses;
	}

	public void setStatusas(List<Short> statuses) {
		this.statuses = statuses;
	}

	public String getCustomerPhone() {
		return customerPhone;
	}

	public void setCustomerPhone(String customerPhone) {
		this.customerPhone = customerPhone;
	}

	public List<DecorationPaymentVO> getDecorationPayments() {
		return decorationPayments;
	}

	public void setDecorationPayments(List<DecorationPaymentVO> decorationPayments) {
		this.decorationPayments = decorationPayments;
	}

}
