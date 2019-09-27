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

	public static final long serialVersionUID = 13444646L;

	public static final String COLUMN_TYPE_STR = "type";

	public static final short TYPE_PART_INT = 0;

	public static final short TYPE_WHOLE_INT = 1;

	public static final short TYPE_AI_INT = 3;

	private long faId;

	private String functionAreaId;

	private String functionAreaName;

	private QuotationVersionPO quotationVersion;

	private int functionAreaOrder;

	private String functionAreaType;

	private short type;

	private long total;

	public FunctionAreaPO() {
		super();
	}

	public FunctionAreaPO(long faId) {
		super();
		this.faId = faId;
	}

	@Id
	@Column(name = "faId")
	public long getFaId() {
		return faId;
	}

	public void setFaId(long faId) {
		this.faId = faId;
	}

	public String getFunctionAreaId() {
		return functionAreaId;
	}

	public void setFunctionAreaId(String functionAreaId) {
		this.functionAreaId = functionAreaId;
	}

	public String getFunctionAreaName() {
		return functionAreaName;
	}

	public void setFunctionAreaName(String functionAreaName) {
		this.functionAreaName = functionAreaName;
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
