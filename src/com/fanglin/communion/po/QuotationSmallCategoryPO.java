package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotationsmallcategory", catalog = "communion")
public class QuotationSmallCategoryPO implements Serializable {

	private static final long serialVersionUID = 3068253191725820789L;

	private int id;

	private String name;

	private int qtid;

	public QuotationSmallCategoryPO() {

	}

	public QuotationSmallCategoryPO(int id) {
		this.id = id;
	}

	@Id
	@Column(name = "id")
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "quotationType")
	public int getQtid() {
		return qtid;
	}

	public void setQtid(int qtid) {
		this.qtid = qtid;
	}

}
