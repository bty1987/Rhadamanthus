/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "functionArea", catalog = "quotation")
public class FunctionAreaPO implements Serializable {

	private static final long serialVersionUID = -1311565802416130652L;

	public static final String COLUMN_TYPE_STR = "type";

	public static final short TYPE_PART_INT = 0;

	public static final short TYPE_WHOLE_INT = 1;

	public static final short TYPE_AI_INT = 3;

	private long faid;

	private String no;

	private String name;

	private QuotationVersionPO quotationVersion;

	private int functionAreaOrder;

	private String functionAreaType;

	private short type;

	private long total;

	public FunctionAreaPO() {
		super();
	}

	public FunctionAreaPO(long faid) {
		super();
		this.faid = faid;
	}

	@Id
	@Column(name = "faid")
	public long getFaid() {
		return faid;
	}

	public void setFaid(long faid) {
		this.faid = faid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "versionId", referencedColumnName = "no")
	public QuotationVersionPO getQuotationVersion() {
		return quotationVersion;
	}

	public void setQuotationVersion(QuotationVersionPO quotationVersion) {
		this.quotationVersion = quotationVersion;
	}

	public int getFunctionAreaOrder() {
		return functionAreaOrder;
	}

	public void setFunctionAreaOrder(int functionAreaOrder) {
		this.functionAreaOrder = functionAreaOrder;
	}

	public String getFunctionAreaType() {
		return functionAreaType;
	}

	public void setFunctionAreaType(String functionAreaType) {
		this.functionAreaType = functionAreaType;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

}
