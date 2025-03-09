package com.fanglin.data.quotation.action;

import java.text.ParseException;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.PresignPriceService;
import com.fanglin.data.quotation.vo.PresignPriceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PresignPriceAction extends BaseListAction {

	private static final long serialVersionUID = -6043631305734437363L;

	@Autowired
	private PresignPriceService presignPriceService;

	private PresignPriceVO presignPrice;

	@Action(value = "pagePresignPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePresignPrice() throws FLException {

		presignPriceService.pagePresignPrice(getPaging(), getFilters(), presignPrice);

		return SUCCESS;
	}

	@Action(value = "queryPresignPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPresignPrice() throws FLException {

		presignPrice = presignPriceService.queryPresignPrice(presignPrice);

		return SUCCESS;
	}

	@Action(value = "addPresignPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPresignPrice() throws FLException {

		presignPriceService.addPresignPrice(presignPrice);

		return SUCCESS;
	}

	@Action(value = "updatePresignPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePresignPrice() throws FLException, ParseException {

		presignPriceService.updatePresignPrice(presignPrice);

		return SUCCESS;
	}

	@Action(value = "updatePresignPriceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePresignPriceForStatus() throws FLException {

		presignPriceService.updatePresignPriceForStatus(presignPrice);

		return SUCCESS;
	}

	@Action(value = "deletePresignPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePresignPrice() throws FLException {

		presignPriceService.deletePresignPrice(presignPrice);

		return SUCCESS;
	}

	public PresignPriceVO getPresignPrice() {
		return presignPrice;
	}

	public void setPresignPrice(PresignPriceVO presignPrice) {
		this.presignPrice = presignPrice;
	}

}
