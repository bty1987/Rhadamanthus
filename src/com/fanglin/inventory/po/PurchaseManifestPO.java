package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
@Entity
@Table(name="purchasemanifest", catalog = "inventory")
public class PurchaseManifestPO implements Serializable{

	private static final long serialVersionUID = -2903868492084166519L;
	
	public static final String COLUMN_PID_STR = "purchase.pid"; 

	private long pmid;
	
	private PurchasePO purchase;
	
	private ManifestPO manifest;
	
	public PurchaseManifestPO() {
		super();
	}

	public PurchaseManifestPO(PurchasePO purchase, ManifestPO manifest) {
		super();
		this.purchase = purchase;
		this.manifest = manifest;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "pmid")
	public long getPmid() {
		return pmid;
	}

	public void setPmid(long pmid) {
		this.pmid = pmid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pid", referencedColumnName = "pid")
	public PurchasePO getPurchase() {
		return purchase;
	}

	public void setPurchase(PurchasePO purchase) {
		this.purchase = purchase;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mid", referencedColumnName = "mid")
	public ManifestPO getManifest() {
		return manifest;
	}

	public void setManifest(ManifestPO manifest) {
		this.manifest = manifest;
	}
	
}
