package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.ReceiptTypeService;
import com.fanglin.data.common.vo.ReceiptTypeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ReceiptTypeAction extends BaseListAction {

	private static final long serialVersionUID = 496491832865207890L;

	@Autowired
	private ReceiptTypeService receiptTypeService;

	private ReceiptTypeVO receiptType;

	private List<ReceiptTypeVO> receiptTypes;

	@Action(value = "pageReceiptType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageReceiptType() throws FLException {

		receiptTypeService.pageReceiptType(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryReceiptType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryReceiptType() throws FLException {

		receiptTypes = receiptTypeService.queryReceiptType(queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryReceiptTypeByType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryReceiptTypeByType() throws FLException {

		receiptTypes = receiptTypeService.queryReceiptTypeByType(receiptType, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addReceiptType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addReceiptType() throws FLException {

		receiptTypeService.addReceiptType(receiptType, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateReceiptType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateReceiptType() throws FLException {

		receiptTypeService.updateReceiptType(receiptType, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateReceiptTypeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDrawLineGroupForStatus() throws FLException {

		receiptTypeService.updateReceiptTypeForStatus(receiptType);

		return SUCCESS;
	}

	public ReceiptTypeVO getReceiptType() {
		return receiptType;
	}

	public void setReceiptType(ReceiptTypeVO receiptType) {
		this.receiptType = receiptType;
	}

	public List<ReceiptTypeVO> getReceiptTypes() {
		return receiptTypes;
	}

	public void setReceiptTypes(List<ReceiptTypeVO> receiptTypes) {
		this.receiptTypes = receiptTypes;
	}

}
