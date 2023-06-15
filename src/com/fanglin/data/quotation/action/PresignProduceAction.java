package com.fanglin.data.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.PresignProduceService;
import com.fanglin.data.quotation.vo.PresignItemVO;
import com.fanglin.data.quotation.vo.PresignProduceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PresignProduceAction extends BaseListAction {

	private static final long serialVersionUID = 866908888938851489L;

	@Autowired
	private PresignProduceService presignProduceService;

	private PresignProduceVO presignProduce;

	private List<PresignProduceVO> presignProduces;

	private List<PresignItemVO> presignItems;

	@Action(value = "pagePresignProduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePresignProduce() throws FLException {

		presignProduceService.pagePresignProduce(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryPresignProduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPresignProduce() throws FLException {

		presignProduces = presignProduceService.queryPresignProduce(presignProduce, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryPresignProduceByPpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPresignProduceByPpid() {

		presignProduce = presignProduceService.queryPresignProduceByPpid(presignProduce);

		return SUCCESS;
	}

	@Action(value = "addPresignProduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPresignProduce() throws FLException {

		presignProduceService.addPresignProduce(presignProduce, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updatePresignProduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePresignProduce() throws FLException {

		presignProduceService.updatePresignProduce(presignProduce, presignItems);

		return SUCCESS;
	}

	@Action(value = "updatePresignProduceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePresignProduceForStatus() throws FLException {

		presignProduceService.updatePresignProduceForStatus(presignProduce);

		return SUCCESS;
	}

	@Action(value = "copyPresignProduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String copyPresignProduce() throws FLException {

		presignProduceService.copyPresignProduce(presignProduce);

		return SUCCESS;
	}

	public PresignProduceVO getPresignProduce() {
		return presignProduce;
	}

	public void setPresignProduce(PresignProduceVO presignProduce) {
		this.presignProduce = presignProduce;
	}

	public List<PresignProduceVO> getPresignProduces() {
		return presignProduces;
	}

	public void setPresignProduces(List<PresignProduceVO> presignProduces) {
		this.presignProduces = presignProduces;
	}

	public List<PresignItemVO> getPresignItems() {
		return presignItems;
	}

	public void setPresignItems(List<PresignItemVO> presignItems) {
		this.presignItems = presignItems;
	}

}
