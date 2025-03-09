/**
 * @File Name		: AddReduceItemAction.java
 * @Package   	: com.fanglin.decoration.action
 * @Version		: 1.0
 * @Date			: 2016-6-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.AddReduceItemService;
import com.fanglin.quotation.vo.AddReduceItemVO;
import com.fanglin.quotation.vo.AddReduceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AddReduceItemAction extends BaseListAction {

	private static final long serialVersionUID = -2176662119622511079L;

	@Autowired
	private AddReduceItemService addReduceItemService;

	private AddReduceVO addReduce;

	private List<AddReduceItemVO> addReduceItems;

	private AddReduceItemVO addReduceItem;

	private List<Long> addReduceIds;

	@Action(value = "queryAddReduceItemByAddReduceId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddReduceItemByAddReduceId() throws FLException {

		addReduceItems = addReduceItemService.queryAddReduceItemByAddReduceId(addReduce);

		return SUCCESS;
	}

	@Action(value = "queryAddReduceItemByAddReduceIds", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddReduceItemByAddReduceIds() throws FLException {

		addReduceItems = addReduceItemService.queryAddReduceItemByAddReduceIds(addReduceIds);

		return SUCCESS;
	}

	@Action(value = "updateAddReduceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAddReduceItem() throws FLException {

		addReduceItemService.updateAddReduceItem(addReduce, addReduceItem);

		return SUCCESS;
	}

	@Action(value = "updateAddReduceItemForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAddReduceItemForAdvance() throws FLException {

		addReduceItemService.updateAddReduceItemForAdvance(addReduce, addReduceItem);

		return SUCCESS;
	}

	@Action(value = "updateAddReduceItemForIndex", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAddReduceItemForIndex() throws FLException {

		addReduceItemService.updateAddReduceItemForIndex(addReduceItems);

		return SUCCESS;
	}

	@Action(value = "deleteAddReduceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAddReduceItem() throws FLException {

		addReduceItemService.deleteAddReduceItem(addReduce, addReduceItem);

		return SUCCESS;
	}

	public AddReduceVO getAddReduce() {
		return addReduce;
	}

	public void setAddReduce(AddReduceVO addReduce) {
		this.addReduce = addReduce;
	}

	public AddReduceItemVO getAddReduceItem() {
		return addReduceItem;
	}

	public void setAddReduceItem(AddReduceItemVO addReduceItem) {
		this.addReduceItem = addReduceItem;
	}

	public List<AddReduceItemVO> getAddReduceItems() {
		return addReduceItems;
	}

	public void setAddReduceItems(List<AddReduceItemVO> addReduceItems) {
		this.addReduceItems = addReduceItems;
	}

	public List<Long> getAddReduceIds() {
		return addReduceIds;
	}

	public void setAddReduceIds(List<Long> addReduceIds) {
		this.addReduceIds = addReduceIds;
	}

}
