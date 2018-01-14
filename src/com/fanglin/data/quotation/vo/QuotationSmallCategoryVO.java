/**
 * @File Name		: QuotationSmallCategoryVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class QuotationSmallCategoryVO implements Serializable{

	private static final long serialVersionUID = 6346260783385963854L;
	
	private int id;
	
	private String name;
	
	private Integer qtid;

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

	public Integer getQtid() {
		return qtid;
	}

	public void setQtid(Integer qtid) {
		this.qtid = qtid;
	}

}
