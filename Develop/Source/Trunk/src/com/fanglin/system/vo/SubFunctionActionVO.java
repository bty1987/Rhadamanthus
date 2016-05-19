package com.fanglin.system.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class SubFunctionActionVO implements Serializable {
	
	private static final long serialVersionUID = 6244446516300615653L;

	@SerializedName("操作编号")
	private int actionId;
	
	@SerializedName("子功能信息")
	private SubFunctionVO subFunction;
	
	@SerializedName("操作名")
	private String actionName;
	
	@SerializedName("描述")
	private String actionDes;

	@SerializedName("默认标识")
	private int defaultFlag;
	
	public int getActionId(){
		return actionId;
	}

	public void setActionId(int actionId){
		this.actionId = actionId;
	}

	public SubFunctionVO getSubFunction(){
		return subFunction;
	}

	public void setSubFunction(SubFunctionVO subFunction){
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
