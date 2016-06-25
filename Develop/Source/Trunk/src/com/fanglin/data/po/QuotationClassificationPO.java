/**
 * @File Name		: QuotationClassificationPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="quotationclassification", catalog = "communion")
public class QuotationClassificationPO implements Serializable{
	
	private static final long serialVersionUID = 1333190756206588599L;
	
	public static final int TYPE_BASIC_PART_INT = 1;
	
	public static final int TYPE_OTHER_PART_INT = 2;
	
	public static final int TYPE_DISPOSABLE_INT = 3;
	
	public static final int TYPE_INTEGRATED_PROJECT_INT = 4;
	
	public static final int TYPE_MANAGEMENT_EXPENSE_INT = 5;
	
	public static final String TYPE_BASIC_PART_STR = "基础部分";
	
	public static final String TYPE_OTHER_PART_STR = "其他部分";
	
	public static final String TYPE_DISPOSABLE_STR = "一次性包死";
	
	public static final String TYPE_INTEGRATED_PROJECT_STR = "综合项目";
	
	public static final String TYPE_MANAGEMENT_EXPENSE_STR = "管理费";

	private int id;
	
	private String name;
	
	public QuotationClassificationPO(){
	}
	
	public QuotationClassificationPO(int id){
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
