package com.fanglin.decoration.vo;

/**
 * 优惠额度校验结果快照VO: 仅校验通过时返回; balance/toplimit 为厘(接口元值×1000, 接口未返回时为 null)。
 */
public class ActivityCostVO {

	private Integer balance;

	private Integer toplimit;

	private String summary;

	public ActivityCostVO(Integer balance, Integer toplimit, String summary) {
		super();
		this.balance = balance;
		this.toplimit = toplimit;
		this.summary = summary;
	}

	public Integer getBalance() {
		return balance;
	}

	public void setBalance(Integer balance) {
		this.balance = balance;
	}

	public Integer getToplimit() {
		return toplimit;
	}

	public void setToplimit(Integer toplimit) {
		this.toplimit = toplimit;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}
}
