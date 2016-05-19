/**
 * @File Name	: FilterVO.java
 * @Package		：com.fanglin.vo 
 * @Version		: 1.0
 * @Date		: 2014-7-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * Describing	: TODO
 */

package com.fanglin.core.vo;

import java.io.Serializable;
import java.util.List;

public class FilterVO implements Serializable{

	private static final long serialVersionUID = 6936704306368277265L;
	
	private String op;
	
	private String field;
	
	private String data;
	
	private List<String> range;
	
	private String Logic;
	
	public FilterVO(){
		super();
	}
	
	public FilterVO(String field, String data, String op){
		super();
		setField(field);
		setData(data);
		setOp(op);
	}
	
	public FilterVO(String field, String data, String op, String logic){
		super();
		setField(field);
		setData(data);
		setOp(op);
		setLogic(logic);
	}
	
	public FilterVO(String field, List<String> range, String op) {
		super();
		this.op = op;
		this.field = field;
		this.range = range;
	}

	public String getOp(){
		return op;
	}
	
	public void setOp(String op){
		this.op = op;
	}
	
	public String getField(){
		return field;
	}
	
	public void setField(String field){
		this.field = field;
	}
	
	public String getData(){
		return data;
	}
	
	public void setData(String data){
		this.data = data;
	}

	public String getLogic(){
		return Logic;
	}
	
	public void setLogic(String logic){
		Logic = logic;
	}

	public List<String> getRange(){
		return range;
	}

	public void setRange(List<String> range){
		this.range = range;
	}
}
