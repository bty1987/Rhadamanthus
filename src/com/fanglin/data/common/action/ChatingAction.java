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
import com.fanglin.data.common.service.ChatingService;
import com.fanglin.data.common.vo.ChatingVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ChatingAction extends BaseListAction {

	private static final long serialVersionUID = -9131212075237193276L;

	@Autowired
	private ChatingService chatingService;

	private ChatingVO chating;

	private List<ChatingVO> chatings;

	@Action(value = "pageChating", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageChating() throws FLException {

		chatingService.pageChating(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryChating", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryChating() throws FLException {

		chatings = chatingService.queryChating(queryCompany());

		return SUCCESS;
	}

	@Action(value = "addChating", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addChating() throws FLException {

		chatingService.addChating(chating, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateChating", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateChating() throws FLException {

		chatingService.updateChating(chating);

		return SUCCESS;
	}

	@Action(value = "updateChatingForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateChatingForStatus() throws FLException {

		chatingService.updateChatingForStatus(chating);

		return SUCCESS;
	}

	@Action(value = "deleteChating", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteChating() throws FLException {

		chatingService.deleteChating(chating);

		return SUCCESS;
	}

	public ChatingVO getChating() {
		return chating;
	}

	public void setChating(ChatingVO chating) {
		this.chating = chating;
	}

	public List<ChatingVO> getChatings() {
		return chatings;
	}

	public void setChatings(List<ChatingVO> chatings) {
		this.chatings = chatings;
	}

}
