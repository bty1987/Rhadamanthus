package com.fanglin.finance.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "subjectbalanceupinfo", catalog = "finance")
public class SubjectBalanceUpinfoPO implements java.io.Serializable {

	private static final long serialVersionUID = 7651176706696685835L;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_SID_STR = "sid";
	
	public static final String COLUMN_PERIOD_STR = "period";
	
	public static final short STATUS_INIT_INT = 0;
	
	public static final short STATUS_HANDLED_INT = 1;

	private long sbuId;
	
	private String code;
	
	private String period;
	
	private float debit;
	
	private float credit;
	
	private short direction;
	
	private short status;
	
	public SubjectBalanceUpinfoPO() {
		super();
	}

	public SubjectBalanceUpinfoPO(String code, String period, float debit, float credit, short direction, short status) {
		super();
		this.code = code;
		this.period = period;
		this.debit = debit;
		this.credit = credit;
		this.direction = direction;
		this.status = status;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sbuId")
	public long getSbuId() {
		return this.sbuId;
	}

	public void setSbuId(long sbuId) {
		this.sbuId = sbuId;
	}

	@Column(name = "code")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "period")
	public String getPeriod() {
		return this.period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	@Column(name = "debit")
	public float getDebit() {
		return this.debit;
	}

	public void setDebit(float debit) {
		this.debit = debit;
	}

	@Column(name = "credit")
	public float getCredit() {
		return this.credit;
	}

	public void setCredit(float credit) {
		this.credit = credit;
	}

	@Column(name = "direction")
	public short getDirection() {
		return direction;
	}

	public void setDirection(short direction) {
		this.direction = direction;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}