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

package com.fanglin.data.common.vo;

import java.io.Serializable;

public class WorkTypeVO implements Serializable{

	private static final long serialVersionUID = 4274531910071238320L;
	
	private int id;
	
	private String name;
	
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
