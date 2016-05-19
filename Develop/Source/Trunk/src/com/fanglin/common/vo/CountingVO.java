/**
 * @File Name		: Counting.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2015-1-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.vo;

import java.io.Serializable;

public class CountingVO implements Serializable{

	private static final long serialVersionUID = 3060812679535517537L;
	
	private Integer cId;
	
	private String date;
	
	private Integer type;
	
	private Integer count;

	public Integer getcId(){
		return cId;
	}

	public void setcId(Integer cId){
		this.cId = cId;
	}

	public String getDate(){
		return date;
	}

	public void setDate(String date){
		this.date = date;
	}

	public Integer getType(){
		return type;
	}

	public void setType(Integer type){
		this.type = type;
	}

	public Integer getCount(){
		return count;
	}

	public void setCount(Integer count){
		this.count = count;
	}
	
}
