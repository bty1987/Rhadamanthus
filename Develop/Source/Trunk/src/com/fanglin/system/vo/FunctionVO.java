package com.fanglin.system.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;


public class FunctionVO implements Serializable {
	
	private static final long serialVersionUID = 4190138235413328979L;

	@SerializedName("自增主键")
	private int id;
	
	@SerializedName("功能序号")
	private int functionId;
	
	@SerializedName("功能名")
	private String functionName;
	
	@SerializedName("模块信息")
	private ModuleVO module;
	
	@SerializedName("功能图标")
	private String functionIcon;
	
	@SerializedName("功能描述")
	protected String functionDes;

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public int getFunctionId(){
		return functionId;
	}

	public void setFunctionId(int functionId){
		this.functionId = functionId;
	}

	public String getFunctionName(){
		return functionName;
	}

	public void setFunctionName(String functionName){
		this.functionName = functionName;
	}

	public ModuleVO getModule(){
		return module;
	}

	public void setModule(ModuleVO module){
		this.module = module;
	}

	public String getFunctionIcon(){
		return functionIcon;
	}

	public void setFunctionIcon(String functionIcon){
		this.functionIcon = functionIcon;
	}

	public String getFunctionDes(){
		return functionDes;
	}

	public void setFunctionDes(String functionDes){
		this.functionDes = functionDes;
	}
	
}
