package com.fanglin.common.vo;

public class KeyValueVO {
	
	private String key;
	
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
