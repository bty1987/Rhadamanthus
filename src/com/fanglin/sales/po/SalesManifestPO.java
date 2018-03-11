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

import com.fanglin.inventory.po.ManifestPO;

@Entity
@Table(name = "salesmanifest", catalog = "sales")
public class SalesManifestPO implements Serializable{

	private static final long serialVersionUID = -1613255669850984436L;
	
	private long smid;
	
	private SalesPO sales;
	
	private ManifestPO manifest;
	
	public SalesManifestPO() {
		super();
	}
	
	public SalesManifestPO(SalesPO sales, ManifestPO manifest) {
		super();
		this.sales = sales;
		this.manifest = manifest;
	}

	@Id
	@GeneratedValue
	@Column(name="smid")
	public long getSmid() {
		return smid;
	}

	public void setSmid(long smid) {
		this.smid = smid;
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
	@JoinColumn(nullable = false, name = "mid", referencedColumnName="mid")
	public ManifestPO getManifest() {
		return manifest;
	}

	public void setManifest(ManifestPO manifest) {
		this.manifest = manifest;
	}
	
}
