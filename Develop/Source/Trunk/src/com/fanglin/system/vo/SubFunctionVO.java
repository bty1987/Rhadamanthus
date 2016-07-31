package com.fanglin.system.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;


public class SubFunctionVO implements Serializable {

	private static final long serialVersionUID = 8882188430338671991L;

	private int id;
	
	private int subFunctionId;
	
	private String subFunctionName;
	
	private FunctionVO function;
	
	protected String subfunctionDes;

	private String subfunctionIcon;
	
	@SerializedName("url")
	private String url;

	public SubFunctionVO() {
		super();
	}

	public SubFunctionVO(int subFunctionId) {
		super();
		this.subFunctionId = subFunctionId;
	}

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public int getSubFunctionId(){
		return subFunctionId;
	}

	public void setSubFunctionId(int subFunctionId){
		this.subFunctionId = subFunctionId;
	}

	public String getSubFunctionName(){
		return subFunctionName;
	}

	public void setSubFunctionName(String subFunctionName){
		this.subFunctionName = subFunctionName;
	}

	public FunctionVO getFunction(){
		return function;
	}

	public void setFunction(FunctionVO function){
		this.function = function;
	}

	public String getSubfunctionDes(){
		return subfunctionDes;
	}

	public void setSubfunctionDes(String subfunctionDes){
		this.subfunctionDes = subfunctionDes;
	}

	public String getSubfunctionIcon(){
		return subfunctionIcon;
	}

	public void setSubfunctionIcon(String subfunctionIcon){
		this.subfunctionIcon = subfunctionIcon;
	}

	public String getUrl(){
		return url;
	}

	public void setUrl(String url){
		this.url = url;
	}
	
}
