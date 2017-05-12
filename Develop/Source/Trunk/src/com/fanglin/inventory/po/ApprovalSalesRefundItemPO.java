package com.fanglin.inventory.po;

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

	private Long asriid;

	private Long asrid;

	private Long sid;

	private Float num;

	private Float total;

	private SalesItemPO salesItem;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "asriid")
	public Long getAsriid() {
		return this.asriid;
	}

	public void setAsriid(Long asriid) {
		this.asriid = asriid;
	}

	@Column(name = "asrid")
	public Long getAsrid() {
		return this.asrid;
	}

	public void setAsrid(Long asrid) {
		this.asrid = asrid;
	}

	@Column(name = "sid")
	public Long getSid() {
		return this.sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	@Column(name = "num")
	public Float getNum() {
		return this.num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	@Column(name = "total")
	public Float getTotal() {
		return this.total;
	}

	public void setTotal(Float total) {
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
