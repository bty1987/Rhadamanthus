package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.VscoreService;
import com.fanglin.customer.service.VustomerNetService;
import com.fanglin.customer.service.VustomerService;
import com.fanglin.customer.vo.VscoreVO;
import com.fanglin.customer.vo.VustomerNetVO;
import com.fanglin.customer.vo.VustomerVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VustomerScopeAction extends BaseListAction {

	private static final long serialVersionUID = -4510376569684619436L;

	@Autowired
	private VustomerNetService vustomerNetService;

	@Autowired
	private VustomerService vustomerService;

	@Autowired
	private VscoreService vscoreService;

	private List<VustomerVO> vustomers;

	private VustomerNetVO vustomerNet;

	private VustomerVO vustomer;

	private VscoreVO vscore;

	private List<?> counts;

	private String unionId;

	@Action(value = "pageVscoreRecordByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageVscoreRecordByUnionId() {

		vscoreService.pageVscoreRecordByUnionId(getPaging(), getFilters(), unionId);

		return SUCCESS;
	}

	@Action(value = "pageVustomerByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageVustomerByUnionId() {

		vustomerService.pageVustomerByUnionId(getPaging(), getFilters(), unionId);

		return SUCCESS;
	}

	@Action(value = "queryVustomerByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVustomerByUnionId() {

		vustomers = vustomerService.queryVustomerByUnionId(vustomer);

		return SUCCESS;
	}

	@Action(value = "queryVscoreByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVscoreByUnionId() {

		vscore = vscoreService.queryVscoreByUnionId(vscore);

		return SUCCESS;
	}

	@Action(value = "countVustomerByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countVustomerByUnionId() {

		counts = vustomerService.countVustomerByUnionId(vustomer);

		return SUCCESS;
	}

	@Action(value = "addVustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addVustomer() {

		vustomerService.addVustomer(vustomer);

		return SUCCESS;
	}

	@Action(value = "deleteVustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteVustomer() {

		vustomerService.deleteVustomer(vustomer);

		return SUCCESS;
	}

	@Action(value = "countVustomerNetByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countVustomerNetByUnionId() throws FLException {

		counts = vustomerNetService.countVustomerNetByUnionId(vustomerNet);

		return SUCCESS;
	}

	@Action(value = "buildVustomerNet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String buildVustomerNet() throws FLException {

		vustomerNetService.buildVustomerNet(vustomerNet);

		return SUCCESS;
	}

	@Action(value = "pickupVscore", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pickupVscore() throws FLException {

		vscoreService.pickupVscore(vscore, queryUserId());

		return SUCCESS;
	}

	public List<VustomerVO> getVustomers() {
		return vustomers;
	}

	public void setVustomers(List<VustomerVO> vustomers) {
		this.vustomers = vustomers;
	}

	public VustomerVO getVustomer() {
		return vustomer;
	}

	public void setVustomer(VustomerVO vustomer) {
		this.vustomer = vustomer;
	}

	public List<?> getCounts() {
		return counts;
	}

	public void setCounts(List<?> counts) {
		this.counts = counts;
	}

	public VustomerNetVO getVustomerNet() {
		return vustomerNet;
	}

	public void setVustomerNet(VustomerNetVO vustomerNet) {
		this.vustomerNet = vustomerNet;
	}

	public VscoreVO getVscore() {
		return vscore;
	}

	public void setVscore(VscoreVO vscore) {
		this.vscore = vscore;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

}
