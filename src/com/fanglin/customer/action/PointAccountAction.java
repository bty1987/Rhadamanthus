package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.PointAccountService;
import com.fanglin.customer.service.PointRecordService;
import com.fanglin.customer.vo.PointAccountVO;
import com.fanglin.customer.vo.PointRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PointAccountAction extends BaseListAction {

	private static final long serialVersionUID = -8825208607348364693L;

	@Autowired
	private PointAccountService pointAccountService;

	@Autowired
	private PointRecordService pointRecordService;

	private PointAccountVO pointAccount;

	private List<PointRecordVO> pointRecords;

	@Action(value = "pagePointAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePointAccount() throws FLException {

		pointAccountService.pagePointAccount(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryPointAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPointAccount() throws FLException {

		pointAccount = pointAccountService.queryPointAccount(pointAccount);

		return SUCCESS;
	}

	@Action(value = "queryPointRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPointRecord() throws FLException {

		pointRecordService.queryPointRecord(pointAccount, getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "createPointAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createPointAccount() throws FLException {

		pointAccount = pointAccountService.createPointAccount(pointAccount, queryCompany(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "grantPoint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String grantPoint() throws FLException {

		pointAccountService.grantPoint(pointAccount, queryUserId());

		return SUCCESS;
	}

	@Action(value = "consumePoint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String consumePoint() throws FLException {

		pointAccount = pointAccountService.consumePoint(pointAccount, queryUserId());

		return SUCCESS;
	}

	public PointAccountVO getPointAccount() {
		return pointAccount;
	}

	public void setPointAccount(PointAccountVO pointAccount) {
		this.pointAccount = pointAccount;
	}

	public List<PointRecordVO> getPointRecords() {
		return pointRecords;
	}

	public void setPointRecords(List<PointRecordVO> pointRecords) {
		this.pointRecords = pointRecords;
	}

}
