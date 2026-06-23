package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationAccountItemService;
import com.fanglin.decoration.vo.DecorationAccountItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationAccountItemAction extends BaseListAction {

	private static final long serialVersionUID = 5431649425816329731L;

	@Autowired
	private DecorationAccountItemService decorationAccountItemService;

	private DecorationAccountItemVO decorationAccountItem;

	private List<DecorationAccountItemVO> decorationAccountItems;

	@Action(value = "queryDecorationAccountItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationAccountItem() throws FLException {

		decorationAccountItems = decorationAccountItemService.queryDecorationAccountItem(decorationAccountItem);

		return SUCCESS;
	}

	@Action(value = "updateDecorationAccountItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationAccountItem() throws FLException {

		decorationAccountItemService.updateDecorationAccountItem(decorationAccountItem, decorationAccountItems);

		return SUCCESS;
	}

	public DecorationAccountItemVO getDecorationAccountItem() {
		return decorationAccountItem;
	}

	public void setDecorationAccountItem(DecorationAccountItemVO decorationAccountItem) {
		this.decorationAccountItem = decorationAccountItem;
	}

	public List<DecorationAccountItemVO> getDecorationAccountItems() {
		return decorationAccountItems;
	}

	public void setDecorationAccountItems(List<DecorationAccountItemVO> decorationAccountItems) {
		this.decorationAccountItems = decorationAccountItems;
	}

}
