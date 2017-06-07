package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.inventory.po.SalesItemPO;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "approvalsalesrefunditem", catalog = "approval")
public class ApprovalSalesRefundItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -2816996256600150880L;

	public static final String COLUMN_ASRID_STR = "asrid";

	private long asriid;

	private long asrid;

	private long sid;

	private float num;

	private float total;

	private SalesItemPO salesItem;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "asriid")
	public long getAsriid() {
		return this.asriid;
	}

	public void setAsriid(long asriid) {
		this.asriid = asriid;
	}

	@Column(name = "asrid")
	public long getAsrid() {
		return this.asrid;
	}

	public void setAsrid(long asrid) {
		this.asrid = asrid;
	}

	@Column(name = "sid")
	public long getSid() {
		return this.sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "num")
	public float getNum() {
		return this.num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@Column(name = "total")
	public float getTotal() {
		return this.total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siid", referencedColumnName = "siid")
	public SalesItemPO getSalesItem() {
		return this.salesItem;
	}

	public void setSalesItem(SalesItemPO salesItem) {
		this.salesItem = salesItem;
	}

}
