package com.fanglin.common.vo;

import com.google.gson.annotations.SerializedName;

public class KeyValueVO {
	
	@SerializedName("键")
	private String key;
	@SerializedName("值")
	private String value;
	public void setValue(String value){
		this.value = value;
	}
	public String getValue(){
		return value;
	}
	public void setKey(String key){
		this.key = key;
	}
	public String getKey(){
		return key;
	}
	
}
