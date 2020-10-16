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
import com.fanglin.data.common.service.TalkingService;
import com.fanglin.data.common.vo.TalkingVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class TalkingAction extends BaseListAction {

	private static final long serialVersionUID = 186695626269014534L;

	@Autowired
	private TalkingService talkingService;

	private TalkingVO talking;

	private List<Short> types;

	private List<TalkingVO> talkings;

	@Action(value = "pageTalking", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageTalking() throws FLException {

		talkingService.pageTalking(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryTalking", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryTalking() throws FLException {

		talkings = talkingService.queryTalking(types, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addTalking", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addTalking() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		talkingService.addTalking(talking, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateTalking", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateTalking() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		talkingService.updateTalking(talking);

		return SUCCESS;
	}

	@Action(value = "updateTalkingForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateTalkingForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		talkingService.updateTalkingForStatus(talking);

		return SUCCESS;
	}

	@Action(value = "deleteTalking", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteTalking() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		talkingService.deleteTalking(talking);

		return SUCCESS;
	}

	public List<Short> getTypes() {
		return types;
	}

	public void setTypes(List<Short> types) {
		this.types = types;
	}

	public TalkingVO getTalking() {
		return talking;
	}

	public void setTalking(TalkingVO talking) {
		this.talking = talking;
	}

	public List<TalkingVO> getTalkings() {
		return talkings;
	}

	public void setTalkings(List<TalkingVO> talkings) {
		this.talkings = talkings;
	}

}
