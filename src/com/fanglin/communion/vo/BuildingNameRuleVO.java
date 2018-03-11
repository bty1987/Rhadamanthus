
package com.fanglin.communion.vo;

import java.io.Serializable;

public class BuildingNameRuleVO implements Serializable {

	private static final long serialVersionUID = -1784504009954603352L;
	
	private int id;
	
	private String buildingNameRuleId;
	
	private String rule;
	
	private String ruleExample;
	
	private String ruleContent;
	
	private String rulefill;

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public String getBuildingNameRuleId(){
		return buildingNameRuleId;
	}

	public void setBuildingNameRuleId(String buildingNameRuleId){
		this.buildingNameRuleId = buildingNameRuleId;
	}

	public String getRule(){
		return rule;
	}

	public void setRule(String rule){
		this.rule = rule;
	}

	public String getRuleExample(){
		return ruleExample;
	}

	public void setRuleExample(String ruleExample){
		this.ruleExample = ruleExample;
	}

	public String getRuleContent(){
		return ruleContent;
	}

	public void setRuleContent(String ruleContent){
		this.ruleContent = ruleContent;
	}

	public String getRulefill() {
		return rulefill;
	}

	public void setRulefill(String rulefill) {
		this.rulefill = rulefill;
	}
	
}
