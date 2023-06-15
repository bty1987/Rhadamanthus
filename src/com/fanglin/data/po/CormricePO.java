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
@Table(name = "cormrice", catalog = "data")
public class CormricePO implements Serializable {

	private static final long serialVersionUID = 6502232226239251054L;

	public static final String COLUMN_QCID_STR = "quotationCtem.qcid";

	public static final short STATUS_VALID_STR = 0;

	private long cpid;

	private QuotationCtemPO quotationCtem;

	private ConstructionNodePO constructionNode;

	private String unit;

	private int trannum;

	private int salary;

	private short status;

	private int company;

	public CormricePO() {
		super();
	}

	public CormricePO(QuotationCtemPO quotationCtem, ConstructionNodePO constructionNode) {
		super();
		this.quotationCtem = quotationCtem;
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "qcid", referencedColumnName = "qcid")
	public QuotationCtemPO getQuotationCtem() {
		return quotationCtem;
	}

	public void setQuotationCtem(QuotationCtemPO quotationCtem) {
		this.quotationCtem = quotationCtem;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cnid", referencedColumnName = "cnid")
	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}

	@Column(name = "unit")
	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@Column(name = "trannum")
	public int getTrannum() {
		return trannum;
	}

	public void setTrannum(int trannum) {
		this.trannum = trannum;
	}

	@Column(name = "salary")
	public int getSalary() {
		return salary;
	}

	public void setSalary(int salary) {
		this.salary = salary;
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
