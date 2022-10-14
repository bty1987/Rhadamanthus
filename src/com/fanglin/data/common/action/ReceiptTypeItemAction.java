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
import com.fanglin.data.common.service.ReceiptTypeItemService;
import com.fanglin.data.common.vo.ReceiptTypeItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ReceiptTypeItemAction extends BaseListAction {

	private static final long serialVersionUID = 9125081078472027126L;

	@Autowired
	private ReceiptTypeItemService receiptTypeItemService;

	private ReceiptTypeItemVO receiptTypeItem;

	private List<ReceiptTypeItemVO> receiptTypeItems;

	@Action(value = "queryReceiptTypeItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryReceiptTypeItem() {

		receiptTypeItems = receiptTypeItemService.queryReceiptTypeItem(receiptTypeItem);

		return SUCCESS;
	}

	@Action(value = "addReceiptTypeItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addReceiptTypeItem() throws FLException {

		receiptTypeItemService.addReceiptTypeItem(receiptTypeItem);

		return SUCCESS;
	}

	@Action(value = "deleteReceiptTypeItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteReceiptTypeItem() throws FLException {

		receiptTypeItemService.deleteReceiptTypeItem(receiptTypeItem);

		return SUCCESS;
	}

	public ReceiptTypeItemVO getReceiptTypeItem() {
		return receiptTypeItem;
	}

	public void setReceiptTypeItem(ReceiptTypeItemVO receiptTypeItem) {
		this.receiptTypeItem = receiptTypeItem;
	}

	public List<ReceiptTypeItemVO> getReceiptTypeItems() {
		return receiptTypeItems;
	}

	public void setReceiptTypeItems(List<ReceiptTypeItemVO> receiptTypeItems) {
		this.receiptTypeItems = receiptTypeItems;
	}

}
