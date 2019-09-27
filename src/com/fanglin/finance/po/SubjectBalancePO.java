package com.fanglin.finance.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "subjectbalance", catalog = "finance")
public class SubjectBalancePO implements java.io.Serializable {

	private static final long serialVersionUID = -4186283504248226538L;

	public static final String COLUMN_SUBJECT_STR = "subject";

	public static final String COLUMN_SUBJECT_CODE_STR = "subject.code";

	public static final String COLUMN_PERIOD_STR = "period";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_EXPIRED_INT = 1;

	private long sbId;

	private SubjectPO subject;

	private String period;

	private long total;

	private long initial;

	private long balance;

	private long debit;

	private long credit;

	private long annual;

	private long adebit;

	private long acredit;

	private short status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sbId")
	public long getSbId() {
		return this.sbId;
	}

	public void setSbId(long sbId) {
		this.sbId = sbId;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "sId", referencedColumnName = "sid")
	public SubjectPO getSubject() {
		return subject;
	}

	public void setSubject(SubjectPO subject) {
		this.subject = subject;
	}

	@Column(name = "period")
	public String getPeriod() {
		return this.period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "initial")
	public long getInitial() {
		return this.initial;
	}

	public void setInitial(long initial) {
		this.initial = initial;
	}

	@Column(name = "balance")
	public long getBalance() {
		return this.balance;
	}

	public void setBalance(long balance) {
		this.balance = balance;
	}

	@Column(name = "annual")
	public long getAnnual() {
		return this.annual;
	}

	public void setAnnual(long annual) {
		this.annual = annual;
	}

	@Column(name = "debit")
	public long getDebit() {
		return debit;
	}

	public void setDebit(long debit) {
		this.debit = debit;
	}

	@Column(name = "credit")
	public long getCredit() {
		return credit;
	}

	public void setCredit(long credit) {
		this.credit = credit;
	}

	@Column(name = "adebit")
	public long getAdebit() {
		return adebit;
	}

	public void setAdebit(long adebit) {
		this.adebit = adebit;
	}

	@Column(name = "acredit")
	public long getAcredit() {
		return acredit;
	}

	public void setAcredit(long acredit) {
		this.acredit = acredit;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}