package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotetionfunctionarea", catalog = "quotetion")
public class QuotetionFunctionAreaPO implements Serializable {

	private static final long serialVersionUID = 470291788273394310L;

	public static final short TYPE_MANAGEMENT_INT = 0; // 管理

	public static final short TYPE_PROJECT_NUM_INT = 1; // 工程量

	public static final short TYPE_FUNCTIONAREA_TOTAL_INT = 2; // 功能区总价

	public static final short TYPE_NOT_COUNT_INT = 3; // 不计算

	public static final short TYPE_CMPREH_INT = 7; // 综合

	private long qfaId;

	private long qid;

	private String name;

	private int functionAreaOrder;

	private short type;

	private short index;

	public QuotetionFunctionAreaPO() {
		super();
	}

	public QuotetionFunctionAreaPO(long qfaId) {
		this.qfaId = qfaId;
	}

	public QuotetionFunctionAreaPO(long qid, String name, int functionAreaOrder, short type, short index) {
		this.qid = qid;
		this.name = name;
		this.functionAreaOrder = functionAreaOrder;
		this.type = type;
		this.index = index;
	}

	@Id
	@GeneratedValue
	@Column(name = "qfaId")
	public long getQfaId() {
		return qfaId;
	}

	public void setQfaId(long qfaId) {
		this.qfaId = qfaId;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "functionAreaOrder")
	public int getFunctionAreaOrder() {
		return functionAreaOrder;
	}

	public void setFunctionAreaOrder(int functionAreaOrder) {
		this.functionAreaOrder = functionAreaOrder;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "[index]")
	public short getIndex() {
		return index;
	}

	public void setIndex(short index) {
		this.index = index;
	}

}
