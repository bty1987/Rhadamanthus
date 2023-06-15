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

import com.fanglin.quotation.po.QuotationFunctionPO;

@Entity
@Table(name = "quotationfunctionright", catalog = "platform")
public class QuotationFunctionRightPO implements Serializable {

	private static final long serialVersionUID = -4951947606402286210L;

	private long qfrid;

	private String name;

	private QuotationFunctionPO quotationFunction;

	private short type;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "qfrid")
	public long getQfrid() {
		return qfrid;
	}

	public void setQfrid(long qfrid) {
		this.qfrid = qfrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "qfid", referencedColumnName = "qfid")
	public QuotationFunctionPO getQuotationFunction() {
		return quotationFunction;
	}

	public void setQuotationFunction(QuotationFunctionPO quotationFunction) {
		this.quotationFunction = quotationFunction;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
