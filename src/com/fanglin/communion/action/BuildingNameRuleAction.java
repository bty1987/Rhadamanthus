/**
 * @File Name		: BuildingNameRuleAction.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-8-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.BuildingNameRuleService;
import com.fanglin.communion.vo.BuildingNameRuleVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BuildingNameRuleAction extends BaseListAction {

	private static final long serialVersionUID = 8467114372750348187L;

	@Autowired
	private BuildingNameRuleService buildingNameRuleService;

	private BuildingNameRuleVO buildingNameRule;

	private List<BuildingNameRuleVO> buildingNameRules;

	@Action(value = "pageBuildingNameRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBuildingNameRule() {
		return SUCCESS;
	}

	@Action(value = "queryBuildingNameRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBuildingNameRule() {

		buildingNameRules = buildingNameRuleService.queryBuildNameRule();

		return SUCCESS;
	}

	public BuildingNameRuleVO getBuildingNameRule() {
		return buildingNameRule;
	}

	public void setBuildingNameRule(BuildingNameRuleVO buildingNameRule) {
		this.buildingNameRule = buildingNameRule;
	}

	public List<BuildingNameRuleVO> getBuildingNameRules() {
		return buildingNameRules;
	}

	public void setBuildingNameRules(List<BuildingNameRuleVO> buildingNameRules) {
		this.buildingNameRules = buildingNameRules;
	}

}
