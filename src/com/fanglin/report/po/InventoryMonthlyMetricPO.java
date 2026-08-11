package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 仓储物流月级汇总（report.metric_inventory_monthly）。
 *
 * <p>由 {@code InventoryMetricCalculator.rebuild()} 每日全量重算，跨库只读聚合
 * {@code inventory.manifest}（出入库流水单），按 manifestTime 归月，仅统计已确认单（status=1）。
 * 唯一键 {@code (stat_month, company, type, direction)}。
 *
 * <p>口径：
 * <ul>
 *   <li>type：出入库类型（1进货/2进退/3出货/4出返/5调拨/6采购/7辅料/8辅退/9套合/11盘盈/12盘亏）。</li>
 *   <li>direction：方向（0 入库 / 1 出库），便于做出入库趋势对比。</li>
 *   <li>manifest_count：单据量。</li>
 * </ul>
 *
 * @see com.fanglin.report.service.impl.InventoryMetricCalculator
 */
@Entity
@Table(name = "metric_inventory_monthly", catalog = "report")
public class InventoryMonthlyMetricPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long imid;

	private String statMonth; // 统计月份 yyyy-MM

	private int company; // 公司

	private short type; // 出入库类型（manifest.type）

	private short direction; // 方向：0 入库 / 1 出库

	private long manifestCount; // 单据量

	public InventoryMonthlyMetricPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "imid")
	public long getImid() {
		return imid;
	}

	public void setImid(long imid) {
		this.imid = imid;
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

	@Column(name = "type", nullable = false)
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "direction", nullable = false)
	public short getDirection() {
		return direction;
	}

	public void setDirection(short direction) {
		this.direction = direction;
	}

	@Column(name = "manifest_count")
	public long getManifestCount() {
		return manifestCount;
	}

	public void setManifestCount(long manifestCount) {
		this.manifestCount = manifestCount;
	}

}
