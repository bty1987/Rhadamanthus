package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceOalesItemService;
import com.fanglin.balance.vo.BalanceOalesItemVO;
import com.fanglin.balance.vo.BalanceOalesVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceOalesItemAction extends BaseListAction {

	private static final long serialVersionUID = 1971388547987213930L;

	@Autowired
	private BalanceOalesItemService balanceOalesItemService;

	private BalanceOalesVO balanceOales;

	private BalanceOalesItemVO balanceOalesItem;

	private List<BalanceOalesItemVO> balanceOalesItems;

	private int count;

	@Action(value = "pageBalanceOalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceOalesItem() throws FLException {

		balanceOalesItemService.pageBalanceOalesItem(getPaging(), getFilters(), balanceOales.getBoid());

		return SUCCESS;
	}

	@Action(value = "queryBalanceOalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceOalesItem() {

		balanceOalesItems = balanceOalesItemService.queryBalanceOalesItem(balanceOalesItem);

		return SUCCESS;
	}

	@Action(value = "countBalanceOalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countBalanceOalesItem() throws FLException {

		count = balanceOalesItemService.countBalanceOalesItem(balanceOales);

		return SUCCESS;
	}

	public BalanceOalesVO getBalanceOales() {
		return balanceOales;
	}

	public void setBalanceOales(BalanceOalesVO balanceOales) {
		this.balanceOales = balanceOales;
	}

	public BalanceOalesItemVO getBalanceOalesItem() {
		return balanceOalesItem;
	}

	public void setBalanceOalesItem(BalanceOalesItemVO balanceOalesItem) {
		this.balanceOalesItem = balanceOalesItem;
	}

	public List<BalanceOalesItemVO> getBalanceOalesItems() {
		return balanceOalesItems;
	}

	public void setBalanceOalesItems(List<BalanceOalesItemVO> balanceOalesItems) {
		this.balanceOalesItems = balanceOalesItems;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

}
