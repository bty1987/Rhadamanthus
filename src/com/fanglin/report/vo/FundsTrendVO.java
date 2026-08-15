package com.fanglin.report.vo;

import java.io.Serializable;

/**
 * 资金闭环趋势点（月 + 四个金额段）。
 */
public class FundsTrendVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private String date; // 月份 yyyy-MM

	private long quotationTotal; // 总报价额（分）

	private long signTotal; // 总签约额（分）

	private long collectTotal; // 总收款（分）

	private long refundTotal; // 总退款（分）

	public FundsTrendVO() {
		super();
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public long getQuotationTotal() {
		return quotationTotal;
	}

	public void setQuotationTotal(long quotationTotal) {
		this.quotationTotal = quotationTotal;
	}

	public long getSignTotal() {
		return signTotal;
	}

	public void setSignTotal(long signTotal) {
		this.signTotal = signTotal;
	}

	public long getCollectTotal() {
		return collectTotal;
	}

	public void setCollectTotal(long collectTotal) {
		this.collectTotal = collectTotal;
	}

	public long getRefundTotal() {
		return refundTotal;
	}

	public void setRefundTotal(long refundTotal) {
		this.refundTotal = refundTotal;
	}

}
