package com.fanglin.data.quotation.action;

import java.text.ParseException;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.PresignItemService;
import com.fanglin.data.quotation.vo.PresignItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PresignItemAction extends BaseListAction {

	private static final long serialVersionUID = 2929932907231711680L;

	@Autowired
	private PresignItemService presignItemService;

	private PresignItemVO presignItem;

	private List<Short> types;

	@Action(value = "pagePresignItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePresignItem() throws FLException {

		presignItemService.pagePresignItem(getPaging(), getFilters(), presignItem, types);

		return SUCCESS;
	}

	@Action(value = "pagePresignItemByPpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePresignItemByPpid() throws FLException {

		presignItemService.pagePresignItemByPpid(getPaging(), getFilters(), presignItem);

		return SUCCESS;
	}

	@Action(value = "queryPresignItemByPiid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPresignItemByPiid() throws FLException {

		presignItemService.queryPresignItemByPiid(presignItem);

		return SUCCESS;
	}

	@Action(value = "addPresignItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPresignItem() throws FLException {

		presignItemService.addPresignItem(presignItem);

		return SUCCESS;
	}

	@Action(value = "updatePresignItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePresignItem() throws FLException, ParseException {

		presignItemService.updatePresignItem(presignItem);

		return SUCCESS;
	}

	@Action(value = "updatePresignItemForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePresignItemForStatus() throws FLException {

		presignItemService.updatePresignItemForStatus(presignItem);

		return SUCCESS;
	}

	@Action(value = "deletePresignItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePresignItem() throws FLException {

		presignItemService.deletePresignItem(presignItem);

		return SUCCESS;
	}

	public PresignItemVO getPresignItem() {
		return presignItem;
	}

	public void setPresignItem(PresignItemVO presignItem) {
		this.presignItem = presignItem;
	}

	public List<Short> getTypes() {
		return types;
	}

	public void setTypes(List<Short> types) {
		this.types = types;
	}

}
