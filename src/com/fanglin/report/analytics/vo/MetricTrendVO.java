package com.fanglin.report.analytics.vo;

import java.io.Serializable;

/**
 * 趋势指标点（日期+金额），用于签约额趋势折线图。
 */
public class MetricTrendVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private String date; // 日期 yyyy-MM 或 yyyy-MM-dd

	private long amount; // 金额（单位分）

	public MetricTrendVO() {
		super();
	}

	public MetricTrendVO(String date, long amount) {
		super();
		this.date = date;
		this.amount = amount;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public long getAmount() {
		return amount;
	}

	public void setAmount(long amount) {
		this.amount = amount;
	}

}
