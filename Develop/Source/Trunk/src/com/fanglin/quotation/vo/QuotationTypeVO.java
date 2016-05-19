/**
 * @File Name		: QuotationTypeVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QuotationTypeVO implements Serializable {
	
	private static final long serialVersionUID = 8949482529462325360L;

	private int id;
	
	private String name;

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
	
}
