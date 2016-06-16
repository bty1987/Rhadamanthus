/**
 * @File Name		: WorkTypeVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class WorkTypeVO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 4274531910071238320L;
	
	@SerializedName("工种编号")
	private int id;
	@SerializedName("工种")
	private String name;
	@SerializedName("描述")
	protected String workTypeDes;

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public String getName(){
		return name;
	}

	public void setName(String name){
		this.name = name;
	}

	public String getWorkTypeDes(){
		return workTypeDes;
	}

	public void setWorkTypeDes(String workTypeDes){
		this.workTypeDes = workTypeDes;
	}
	
}
