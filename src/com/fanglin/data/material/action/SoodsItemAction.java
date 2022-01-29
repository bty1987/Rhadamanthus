package com.fanglin.data.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.SoodsItemService;
import com.fanglin.data.material.vo.SoodsItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SoodsItemAction extends BaseListAction {

	private static final long serialVersionUID = 6771368786758871433L;

	@Autowired
	private SoodsItemService soodsItemService;

	private List<SoodsItemVO> soodsItems;

	private SoodsItemVO soodsItem;

	@Action(value = "pageSoodsItemByQiid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSoodsItemByQiid() throws FLException {

		soodsItemService.pageSoodsItemByQiid(getPaging(), getFilters(), soodsItem);

		return SUCCESS;
	}

	@Action(value = "pageSoodsItemBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSoodsItemBySid() throws FLException {

		soodsItemService.pageSoodsItemBySid(getPaging(), getFilters(), soodsItem);

		return SUCCESS;
	}

	@Action(value = "querySoodsItemByQiid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySoodsItemByQiid() throws FLException {

		soodsItems = soodsItemService.querySoodsItemByQiid(soodsItem);

		return SUCCESS;
	}

	@Action(value = "querySoodsItemBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySoodsItemBySid() throws FLException {

		soodsItems = soodsItemService.querySoodsItemBySid(soodsItem);

		return SUCCESS;
	}

	@Action(value = "addSoodsItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSoodsItem() throws FLException {

		soodsItemService.addSoodsItem(soodsItem, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteSoodsItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSoodsItem() throws FLException {

		soodsItemService.deleteSoodsItem(soodsItem);

		return SUCCESS;
	}

	public List<SoodsItemVO> getSoodsItems() {
		return soodsItems;
	}

	public void setSoodsItems(List<SoodsItemVO> soodsItems) {
		this.soodsItems = soodsItems;
	}

	public SoodsItemVO getSoodsItem() {
		return soodsItem;
	}

	public void setSoodsItem(SoodsItemVO soodsItem) {
		this.soodsItem = soodsItem;
	}

}
