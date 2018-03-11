package com.fanglin.communion.vo;

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
