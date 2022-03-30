package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "normadd", catalog = "data")
public class NormaddPO implements Serializable {

	private static final long serialVersionUID = -1109476732868699253L;

	public static final String COLUMN_CNID_STR = "constructionNode.cnid";

	public static final short STATUS_START_SHORT = 0;

	public static final short STATUS_STOP_SHORT = 1;

	private long naid;

	private String name;

	private ConstructionNodePO constructionNode;

	private String unit;// 单位

	private int price;// 单价

	private short status;

	private int company;

	@Column(name = "unit")
	public String getUnit() {
		return unit;
	}

	public NormaddPO() {
		super();
	}

	public NormaddPO(ConstructionNodePO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "naid")
	public long getNaid() {
		return naid;
	}

	public void setNaid(long naid) {
		this.naid = naid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cnid", referencedColumnName = "cnid")
	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@Column(name = "price")
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
}
