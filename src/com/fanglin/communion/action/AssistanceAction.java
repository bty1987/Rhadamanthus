package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.AssistanceItemService;
import com.fanglin.communion.service.AssistanceService;
import com.fanglin.communion.vo.AssistanceItemVO;
import com.fanglin.communion.vo.AssistanceVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AssistanceAction extends BaseListAction {

	private static final long serialVersionUID = -4823422063220091897L;

	@Autowired
	private AssistanceService assistanceService;

	@Autowired
	private AssistanceItemService assistanceItemService;

	private AssistanceVO assistance;

	private List<AssistanceVO> assistances;

	private AssistanceItemVO assistanceItem;

	private List<AssistanceItemVO> assistanceItems;

	@Action(value = "pageAssistance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageOales() throws FLException {

		assistanceService.pageAssistance(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryAssistance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAssistance() throws FLException {

		assistances = assistanceService.queryAssistance(assistance);

		return SUCCESS;
	}

	@Action(value = "queryAssistanceByAid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAssistanceByAid() throws FLException {

		assistance = assistanceService.queryAssistanceByAid(assistance);

		return SUCCESS;
	}

	@Action(value = "queryAssistanceByKeyword", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAssistanceByKeyword() throws FLException {

		assistance = assistanceService.queryAssistanceByKeyword(assistance);

		return SUCCESS;
	}

	@Action(value = "addAssistance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAssistance() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		assistanceService.addAssistance(assistance, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateAssistance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAssistance() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		assistanceService.updateAssistance(assistance);

		return SUCCESS;
	}

	@Action(value = "updateAssistanceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAssistanceForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		assistanceService.updateAssistanceForStatus(assistance);

		return SUCCESS;
	}

	@Action(value = "queryAssistanceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAssistanceItem() {

		assistanceItems = assistanceItemService.queryAssistanceItem(assistance);

		return SUCCESS;
	}

	@Action(value = "addAssistanceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAssistanceItem() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		assistanceItemService.addAssistanceItem(assistance, assistanceItem);

		return SUCCESS;
	}

	@Action(value = "updateAssistanceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAssistanceItem() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		assistanceItemService.updateAssistanceItem(assistance, assistanceItem);

		return SUCCESS;
	}

	public AssistanceVO getAssistance() {
		return assistance;
	}

	public void setAssistance(AssistanceVO assistance) {
		this.assistance = assistance;
	}

	public List<AssistanceVO> getAssistances() {
		return assistances;
	}

	public void setAssistances(List<AssistanceVO> assistances) {
		this.assistances = assistances;
	}

	public AssistanceItemVO getAssistanceItem() {
		return assistanceItem;
	}

	public void setAssistanceItem(AssistanceItemVO assistanceItem) {
		this.assistanceItem = assistanceItem;
	}

	public List<AssistanceItemVO> getAssistanceItems() {
		return assistanceItems;
	}

	public void setAssistanceItems(List<AssistanceItemVO> assistanceItems) {
		this.assistanceItems = assistanceItems;
	}

}
