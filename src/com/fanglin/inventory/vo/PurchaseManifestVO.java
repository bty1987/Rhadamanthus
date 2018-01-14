package com.fanglin.inventory.vo;

import java.io.Serializable;

public class PurchaseManifestVO implements Serializable{

	private static final long serialVersionUID = -728334110359792109L;
	
	private Long pmid;
	
	private PurchaseVO purchase;
	
	private ManifestVO manifest;

	public PurchaseManifestVO(PurchaseVO purchase, ManifestVO manifest) {
		super();
		this.purchase = purchase;
		this.manifest = manifest;
	}

	public Long getPmid() {
		return pmid;
	}

	public void setPmid(Long pmid) {
		this.pmid = pmid;
	}

	public PurchaseVO getPurchase() {
		return purchase;
	}

	public void setPurchase(PurchaseVO purchase) {
		this.purchase = purchase;
	}

	public ManifestVO getManifest() {
		return manifest;
	}

	public void setManifest(ManifestVO manifest) {
		this.manifest = manifest;
	}
	
}
