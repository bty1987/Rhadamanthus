/**
 * @File Name		: QuotationBigCategory.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="quotationbigcategory", catalog = "communion")
public class QuotationBigCategoryPO implements Serializable{

	private static final long serialVersionUID = -8769277258546264266L;
	
	private int id;
	
	private String name;
	
	public QuotationBigCategoryPO(){
		
	}
	
	public QuotationBigCategoryPO(int id){
		this.id = id;
	}

	@Id
	@Column(name="id")
	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	@Column(name="name")
	public String getName(){
		return name;
	}

	public void setName(String name){
		this.name = name;
	}

}
