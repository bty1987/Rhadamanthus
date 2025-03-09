package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.VillageRuleService;
import com.fanglin.communion.vo.VillageRuleVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VillageRuleAction extends BaseListAction {

	private static final long serialVersionUID = -3547262783577379120L;

	@Autowired
	private VillageRuleService villageRuleService;

	private VillageRuleVO villageRule;

	private List<VillageRuleVO> villageRules;

	@Action(value = "queryVillageRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVillageRule() throws FLException {

		villageRules = villageRuleService.queryVillageRule(villageRule);

		return SUCCESS;
	}

	@Action(value = "addVillageRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addVillageRule() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		villageRuleService.addVillageRule(villageRule);

		return SUCCESS;
	}

	@Action(value = "deleteVillageRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteVillageRule() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		villageRuleService.deleteVillageRule(villageRule);

		return SUCCESS;
	}

	public VillageRuleVO getVillageRule() {
		return villageRule;
	}

	public void setVillageRule(VillageRuleVO villageRule) {
		this.villageRule = villageRule;
	}

	public List<VillageRuleVO> getVillageRules() {
		return villageRules;
	}

	public void setVillageRules(List<VillageRuleVO> villageRules) {
		this.villageRules = villageRules;
	}

}
