package com.fanglin.system.vo;

import java.io.Serializable;

public class FunctionVO implements Serializable {
	
	private static final long serialVersionUID = 4190138235413328979L;

	private int id;
	
	private int functionId;
	
	private String functionName;
	
	private ModuleVO module;
	
	private String functionIcon;
	
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
