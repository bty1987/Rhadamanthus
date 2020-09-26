package com.fanglin.store.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.McolorService;
import com.fanglin.store.vo.McolorVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class McolorAction extends BaseListAction {

	private static final long serialVersionUID = 7084128294243545580L;

	@Autowired
	private McolorService mcolorService;

	private List<McolorVO> mcolors;

	private McolorVO mcolor;

	@Action(value = "queryMcolorByGid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMcolorByGid() {

		mcolors = mcolorService.queryMcolorByGid(mcolor);

		return SUCCESS;
	}

	@Action(value = "addMcolor", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMcolor() throws FLException {

		mcolorService.addMcolor(mcolor);

		return SUCCESS;
	}

	@Action(value = "updateMcolorForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMcolorForStatus() throws FLException {

		mcolorService.updateMcolorForStatus(mcolor);

		return SUCCESS;
	}

	public McolorVO getMcolor() {
		return mcolor;
	}

	public void setMcolor(McolorVO mcolor) {
		this.mcolor = mcolor;
	}

	public List<McolorVO> getMcolors() {
		return mcolors;
	}

	public void setMcolors(List<McolorVO> mcolors) {
		this.mcolors = mcolors;
	}

}
