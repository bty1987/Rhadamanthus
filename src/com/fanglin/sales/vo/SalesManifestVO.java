package com.fanglin.sales.vo;

import java.io.Serializable;

import com.fanglin.inventory.vo.ManifestVO;

public class SalesManifestVO implements Serializable{

	private static final long serialVersionUID = -7883317079919388113L;
	
	private Long smid;
	
	private SalesVO sales;
	
	private ManifestVO manifest;
	
	public SalesManifestVO() {
		super();
	}

	public SalesManifestVO(SalesVO sales, ManifestVO manifest) {
		super();
		this.sales = sales;
		this.manifest = manifest;
	}

	public Long getSmid() {
		return smid;
	}

	public void setSmid(Long smid) {
		this.smid = smid;
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
