/**
 * @File Name		: FunctionAreaVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class FunctionAreaVO implements Serializable {

	private static final long serialVersionUID = -62958203481876631L;

	private Long autoId;

	@SerializedName("功能区编号")
	private String functionAreaId;
	
	@SerializedName("功能区")
	private String functionAreaName;

	@SerializedName("功能区排序")
	private int functionAreaOrder;
	
	@SerializedName("功能区类型")
	private String functionAreaType;

	@SerializedName("报价版本编号")
	private String versionId;
	
	@SerializedName("报价版本")
	private String version;

	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
	}

	public String getFunctionAreaId(){
		return functionAreaId;
	}

	public void setFunctionAreaId(String functionAreaId){
		this.functionAreaId = functionAreaId;
	}

	public String getFunctionAreaName(){
		return functionAreaName;
	}

	public void setFunctionAreaName(String functionAreaName){
		this.functionAreaName = functionAreaName;
	}

	public int getFunctionAreaOrder(){
		return functionAreaOrder;
	}

	public void setFunctionAreaOrder(int functionAreaOrder){
		this.functionAreaOrder = functionAreaOrder;
	}

	public String getFunctionAreaType(){
		return functionAreaType;
	}

	public void setFunctionAreaType(String functionAreaType){
		this.functionAreaType = functionAreaType;
	}

	public String getVersionId(){
		return versionId;
	}

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getVersion(){
		return version;
	}

	public void setVersion(String version){
		this.version = version;
	}

}
