package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.InstorerService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class InstorerAction extends BaseListAction {

	private static final long serialVersionUID = 4903124049746001829L;

	@Autowired
	private InstorerService instorerService;

	private List<UserVO> instorers;

	private UserVO instorer;

	@Action(value = "pageInstorer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageInstorer() throws FLException {

		instorerService.pageInstorer(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryInstorerByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryInstorerByPinyin() throws FLException {

		instorers = instorerService.queryInstorerByPinyin(instorer.getPinYin(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addInstorer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addInstorer() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		instorerService.addInstorer(instorer, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateInstorer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateInstorer() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		instorerService.updateInstorer(instorer);

		return SUCCESS;
	}

	public UserVO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserVO instorer) {
		this.instorer = instorer;
	}

	public List<UserVO> getInstorers() {
		return instorers;
	}

	public void setInstorers(List<UserVO> instorers) {
		this.instorers = instorers;
	}

}
