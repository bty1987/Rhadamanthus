package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="quotationtype", catalog = "communion")
public class QuotationTypePO implements Serializable{
	
	private static final long serialVersionUID = 6306610802053889704L;

	private int id;
	
	private String name;
	
	public QuotationTypePO(){
		
	}
	
	public QuotationTypePO(int id){
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
