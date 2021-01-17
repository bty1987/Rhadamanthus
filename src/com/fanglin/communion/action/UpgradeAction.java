package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.UpgradeService;
import com.fanglin.communion.vo.UpgradeVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UpgradeAction extends BaseListAction {

	private static final long serialVersionUID = -73141511258270262L;

	@Autowired
	private UpgradeService upgradeService;

	private UpgradeVO upgrade;

	private List<UpgradeVO> upgrades;

	private String maxNo;

	@Action(value = "pageUpgrade", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUpgrade() {

		upgradeService.pageUpgrade(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryUpgrade", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUpgrade() {

		upgrades = upgradeService.queryUpgrade(getFilters(), upgrade);

		return SUCCESS;
	}

	@Action(value = "matchUpgrade", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String matchUpgrade() {

		upgrade = upgradeService.matchUpgrade(upgrade);
		maxNo = upgradeService.maxUpgrade();

		return SUCCESS;
	}

	@Action(value = "addUpgrade", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addUpgrade() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		upgradeService.addUpgrade(upgrade);

		return SUCCESS;
	}

	@Action(value = "updateUpgradeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUpgradeForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		upgradeService.updateUpgradeForStatus(upgrade);

		return SUCCESS;
	}

	@Action(value = "deleteUpgrade", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteUpgrade() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		upgradeService.deleteUpgrade(upgrade);

		return SUCCESS;
	}

	public UpgradeVO getUpgrade() {
		return upgrade;
	}

	public void setUpgrade(UpgradeVO upgrade) {
		this.upgrade = upgrade;
	}

	public List<UpgradeVO> getUpgrades() {
		return upgrades;
	}

	public void setUpgrades(List<UpgradeVO> upgrades) {
		this.upgrades = upgrades;
	}

	public String getMaxNo() {
		return maxNo;
	}

	public void setMaxNo(String maxNo) {
		this.maxNo = maxNo;
	}

}
