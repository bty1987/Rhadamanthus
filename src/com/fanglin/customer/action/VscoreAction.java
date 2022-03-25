package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.VscoreService;
import com.fanglin.customer.vo.VscoreRecordVO;
import com.fanglin.customer.vo.VscoreVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VscoreAction extends BaseListAction {

	private static final long serialVersionUID = -8596903321672725017L;

	@Autowired
	private VscoreService vscoreService;

	private VscoreVO vscore;

	private VscoreRecordVO vscoreRecord;

	@Action(value = "raiseVscore", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String raiseVscore() throws FLException {

		vscoreService.raiseVscore(vscore, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateVscoreRecordForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVscoreRecordForStatus() {

		vscoreService.updateVscoreRecordForStatus(vscoreRecord);

		return SUCCESS;
	}

	public VscoreVO getVscore() {
		return vscore;
	}

	public void setVscore(VscoreVO vscore) {
		this.vscore = vscore;
	}

	public VscoreRecordVO getVscoreRecord() {
		return vscoreRecord;
	}

	public void setVscoreRecord(VscoreRecordVO vscoreRecord) {
		this.vscoreRecord = vscoreRecord;
	}

}
