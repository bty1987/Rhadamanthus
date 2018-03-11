package com.fanglin.finance.vo;

public class SubjectBalanceVO implements java.io.Serializable {

	private static final long serialVersionUID = -6855897866528112894L;

	private Long sbId;
	
	private SubjectVO subject;
	
	private String period;
	
	private Float total;
	
	private Float initial;
	
	private Float balance;
	
	private Float debit;
	
	private Float credit;
	
	private Float annual;
	
	private Float adebit;
	
	private Float acredit;
	
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

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public Float getInitial() {
		return initial;
	}

	public void setInitial(Float initial) {
		this.initial = initial;
	}

	public Float getBalance() {
		return balance;
	}

	public void setBalance(Float balance) {
		this.balance = balance;
	}

	public Float getAnnual() {
		return annual;
	}

	public void setAnnual(Float annual) {
		this.annual = annual;
	}

	public Float getDebit() {
		return debit;
	}

	public void setDebit(Float debit) {
		this.debit = debit;
	}

	public Float getCredit() {
		return credit;
	}

	public void setCredit(Float credit) {
		this.credit = credit;
	}

	public Float getAdebit() {
		return adebit;
	}

	public void setAdebit(Float adebit) {
		this.adebit = adebit;
	}

	public Float getAcredit() {
		return acredit;
	}

	public void setAcredit(Float acredit) {
		this.acredit = acredit;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}