package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 资金闭环月级汇总（report.metric_funds_monthly）。
 *
 * <p>由 {@code FundsMetricCalculator.rebuild()} 每日全量重算，跨库只读聚合，
 * 反映资金从报价→签约→实收的三段流转。唯一键 {@code (stat_month, company)}。
 *
 * <p>口径说明（两段时间轴，页面展示需注明）：
 * <ul>
 *   <li>报价额/签约额：按 contractTime 归月（quotation 默认报价 JOIN decoration 签约单）。</li>
 *   <li>收款/退款：按 collectTime 归月（payment.receipt）。</li>
 * </ul>
 *
 * @see com.fanglin.report.service.impl.FundsMetricCalculator
 */
@Entity
@Table(name = "metric_funds_monthly", catalog = "report")
public class FundsMonthlyMetricPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long fmid;

	private String statMonth; // 统计月份 yyyy-MM

	private int company; // 公司

	private long quotationTotal; // 总报价额（分，按签约月的默认报价）

	private long signTotal; // 总签约额（分）

	private long collectTotal; // 总收款（分，按收款月）

	private long refundTotal; // 总退款（分，按收款月）

	public FundsMonthlyMetricPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "fmid")
	public long getFmid() {
		return fmid;
	}

	public void setFmid(long fmid) {
		this.fmid = fmid;
	}

	@Column(name = "stat_month", nullable = false)
	public String getStatMonth() {
		return statMonth;
	}

	public void setStatMonth(String statMonth) {
		this.statMonth = statMonth;
	}

	@Column(name = "company", nullable = false)
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "quotation_total")
	public long getQuotationTotal() {
		return quotationTotal;
	}

	public void setQuotationTotal(long quotationTotal) {
		this.quotationTotal = quotationTotal;
	}

	@Column(name = "sign_total")
	public long getSignTotal() {
		return signTotal;
	}

	public void setSignTotal(long signTotal) {
		this.signTotal = signTotal;
	}

	@Column(name = "collect_total")
	public long getCollectTotal() {
		return collectTotal;
	}

	public void setCollectTotal(long collectTotal) {
		this.collectTotal = collectTotal;
	}

	@Column(name = "refund_total")
	public long getRefundTotal() {
		return refundTotal;
	}

	public void setRefundTotal(long refundTotal) {
		this.refundTotal = refundTotal;
	}

}
