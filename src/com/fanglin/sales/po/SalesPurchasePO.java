package com.fanglin.sales.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.inventory.po.PurchasePO;

@Entity
@Table(name = "salespurchase", catalog = "sales")
public class SalesPurchasePO implements Serializable{

	private static final long serialVersionUID = 3635723788185082605L;
	
	public static final String COLUMN_SALESSID_STR = "sales.sid";
	
	private long spid;
	
	private SalesPO sales;
	
	private PurchasePO purchase;
	
	public SalesPurchasePO() {
		super();
	}

	public SalesPurchasePO(SalesPO sales, PurchasePO purchase) {
		super();
		this.sales = sales;
		this.purchase = purchase;
	}

	@Id
	@GeneratedValue
	@Column(name="spid")
	public long getSpid() {
		return spid;
	}

	public void setSpid(long spid) {
		this.spid = spid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "sid", referencedColumnName="sid")
	public SalesPO getSales() {
		return sales;
	}

	public void setSales(SalesPO sales) {
		this.sales = sales;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "pid", referencedColumnName="pid")
	public PurchasePO getPurchase() {
		return purchase;
	}

	public void setPurchase(PurchasePO purchase) {
		this.purchase = purchase;
	}

}
