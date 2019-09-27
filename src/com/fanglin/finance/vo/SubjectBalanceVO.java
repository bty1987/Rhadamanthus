package com.fanglin.finance.vo;

public class SubjectBalanceVO implements java.io.Serializable {

	private static final long serialVersionUID = -6855897866528112894L;

	private Long sbId;

	private SubjectVO subject;

	private String period;

	private Long total;

	private Long initial;

	private Long balance;

	private Long debit;

	private Long credit;

	private Long annual;

	private Long adebit;

	private Long acredit;

	private Short status;

	public Long getSbId() {
		return sbId;
	}

	public void setSbId(Long sbId) {
		this.sbId = sbId;
	}

	public SubjectVO getSubject() {
		return subject;
	}

	public void setSubject(SubjectVO subject) {
		this.subject = subject;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Long getInitial() {
		return initial;
	}

	public void setInitial(Long initial) {
		this.initial = initial;
	}

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}

	public Long getAnnual() {
		return annual;
	}

	public void setAnnual(Long annual) {
		this.annual = annual;
	}

	public Long getDebit() {
		return debit;
	}

	public void setDebit(Long debit) {
		this.debit = debit;
	}

	public Long getCredit() {
		return credit;
	}

	public void setCredit(Long credit) {
		this.credit = credit;
	}

	public Long getAdebit() {
		return adebit;
	}

	public void setAdebit(Long adebit) {
		this.adebit = adebit;
	}

	public Long getAcredit() {
		return acredit;
	}

	public void setAcredit(Long acredit) {
		this.acredit = acredit;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}