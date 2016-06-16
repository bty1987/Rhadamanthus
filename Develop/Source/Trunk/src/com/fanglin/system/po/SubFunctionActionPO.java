package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "subFunctionAction", catalog = "communion")
public class SubFunctionActionPO implements Serializable {
	
	private static final long serialVersionUID = 6244446516300615653L;

	private int actionId;
	
	private SubFunctionPO subFunction;
	
	private String actionName;
	
	private String actionDes;
	
	private int defaultFlag;

	@Id
	@GeneratedValue
	@Column(name = "actionId", nullable = false)
	public int getActionId(){
		return actionId;
	}

	public void setActionId(int actionId){
		this.actionId = actionId;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "subFunctionId")
	public SubFunctionPO getSubFunction(){
		return subFunction;
	}

	public void setSubFunction(SubFunctionPO subFunction){
		this.subFunction = subFunction;
	}

	public String getActionName(){
		return actionName;
	}

	public void setActionName(String actionName){
		this.actionName = actionName;
	}

	public String getActionDes(){
		return actionDes;
	}

	public void setActionDes(String actionDes){
		this.actionDes = actionDes;
	}

	public int getDefaultFlag(){
		return defaultFlag;
	}

	public void setDefaultFlag(int defaultFlag){
		this.defaultFlag = defaultFlag;
	}

}
