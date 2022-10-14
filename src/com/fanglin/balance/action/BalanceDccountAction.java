package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceDccountService;
import com.fanglin.balance.vo.BalanceDccountVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceDccountAction extends BaseListAction {

	private static final long serialVersionUID = -6987407885414378116L;

	@Autowired
	private BalanceDccountService balanceDccountService;

	private List<BalanceDccountVO> balanceDccountes;

	private BalanceDccountVO balanceDccount;

	@Action(value = "pageBalanceDccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceDccount() throws FLException {

		balanceDccountService.pageBalanceDccount(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryBalanceDccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceDccount() {

		balanceDccountes = balanceDccountService.queryBalanceDccount(balanceDccount);

		return SUCCESS;
	}

	@Action(value = "addBalanceDccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBalanceDccount() throws FLException {

		balanceDccountService.addBalanceDccount(balanceDccount, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateBalanceDccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBalanceDccount() throws FLException {

		balanceDccountService.updateBalanceDccount(balanceDccount);
		return SUCCESS;
	}

	@Action(value = "updateBalanceDccountForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBalanceDccountForStatus() throws FLException {

		balanceDccountService.updateBalanceDccountForStatus(balanceDccount);

		return SUCCESS;
	}

	public List<BalanceDccountVO> getBalanceDccountes() {
		return balanceDccountes;
	}

	public void setBalanceDccountes(List<BalanceDccountVO> balanceDccountes) {
		this.balanceDccountes = balanceDccountes;
	}

	public BalanceDccountVO getBalanceDccount() {
		return balanceDccount;
	}

	public void setBalanceDccount(BalanceDccountVO balanceDccount) {
		this.balanceDccount = balanceDccount;
	}


}
