package com.fanglin.sales.vo;

import java.io.Serializable;

import com.fanglin.inventory.vo.ManifestVO;

public class SalesPurchaseVO implements Serializable{

	private static final long serialVersionUID = -7883317079919388113L;
	
	private Long spid;
	
	private SalesVO sales;
	
	private ManifestVO manifest;
	
	public SalesPurchaseVO() {
		super();
	}

	public SalesPurchaseVO(Long spid, SalesVO sales, ManifestVO manifest) {
		super();
		this.spid = spid;
		this.sales = sales;
		this.manifest = manifest;
	}

	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public ManifestVO getManifest() {
		return manifest;
	}

	public void setManifest(ManifestVO manifest) {
		this.manifest = manifest;
	}
	
}
