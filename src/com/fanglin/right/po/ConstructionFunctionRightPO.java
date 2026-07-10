package com.fanglin.right.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.construction.po.ConstructionFunctionPO;

@Entity
@Table(name = "constructionfunctionright", catalog = "platform")
public class ConstructionFunctionRightPO implements Serializable {

	private static final long serialVersionUID = -565492413799408190L;

	private long cfrrid;

	private String name;

	private ConstructionFunctionPO constructionFunction;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "cfrrid")
	public long getCfrrid() {
		return cfrrid;
	}

	public void setCfrrid(long cfrrid) {
		this.cfrrid = cfrrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cfid", referencedColumnName = "cfid")
	public ConstructionFunctionPO getConstructionFunction() {
		return constructionFunction;
	}

	public void setConstructionFunction(ConstructionFunctionPO constructionFunction) {
		this.constructionFunction = constructionFunction;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
