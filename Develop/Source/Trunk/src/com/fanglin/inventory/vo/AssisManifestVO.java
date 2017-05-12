package com.fanglin.inventory.vo;

import java.io.Serializable;

public class AssisManifestVO implements Serializable{

	private static final long serialVersionUID = 7764011939608561432L;

	private Long amid;
	
	private AssisOrderVO purchase;
	
	private ManifestVO manifest;

	public Long getAmid() {
		return amid;
	}

	public void setAmid(Long amid) {
		this.amid = amid;
	}

	public AssisOrderVO getPurchase() {
		return purchase;
	}

	public void setPurchase(AssisOrderVO purchase) {
		this.purchase = purchase;
	}

	public ManifestVO getManifest() {
		return manifest;
	}

	public void setManifest(ManifestVO manifest) {
		this.manifest = manifest;
	}
	
}
