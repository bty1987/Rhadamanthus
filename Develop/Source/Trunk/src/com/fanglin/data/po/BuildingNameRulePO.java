/**
 * @File Name		: BuildingNameRulePO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-8-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="buildingnamerule", catalog = "communion")
public class BuildingNameRulePO implements Serializable {

	private static final long serialVersionUID = 2856873455201052337L;
	
	private int id;
	
	private String buildingNameRuleId;
	
	private String rule;
	
	private String ruleExample;
	
	private String ruleContent;
	
	private String rulefill;
	
	public BuildingNameRulePO(){
		
	}
	
	public BuildingNameRulePO(int id){
		this.id = id;
	}
	
	@Id
	@Column(name="id")
	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	@Column(name="buildingNameRuleId")
	public String getBuildingNameRuleId(){
		return buildingNameRuleId;
	}

	public void setBuildingNameRuleId(String buildingNameRuleId){
		this.buildingNameRuleId = buildingNameRuleId;
	}

	@Column(name="rule")
	public String getRule(){
		return rule;
	}

	public void setRule(String rule){
		this.rule = rule;
	}

	@Column(name="ruleExample")
	public String getRuleExample(){
		return ruleExample;
	}

	public void setRuleExample(String ruleExample){
		this.ruleExample = ruleExample;
	}

	@Column(name="ruleContent")
	public String getRuleContent(){
		return ruleContent;
	}

	public void setRuleContent(String ruleContent){
		this.ruleContent = ruleContent;
	}

	@Column(name="rulefill")
	public String getRulefill() {
		return rulefill;
	}

	public void setRulefill(String rulefill) {
		this.rulefill = rulefill;
	}
	
	
	
}
