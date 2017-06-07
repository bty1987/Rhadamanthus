package com.fanglin.inventory.vo;

import java.io.Serializable;

public class AssisManifestVO implements Serializable{

	private static final long serialVersionUID = 7764011939608561432L;

	private Long amid;
	
	private AssisOrderVO assisOrder;
	
	private ManifestVO manifest;
	
	public AssisManifestVO(AssisOrderVO assisOrder, ManifestVO manifest) {
		super();
		this.assisOrder = assisOrder;
		this.manifest = manifest;
	}

	public Long getAmid() {
		return amid;
	}

	public void setAmid(Long amid) {
		this.amid = amid;
	}

	public AssisOrderVO getAssisOrder() {
		return assisOrder;
	}

	public void setAssisOrder(AssisOrderVO assisOrder) {
		this.assisOrder = assisOrder;
	}

	public ManifestVO getManifest() {
		return manifest;
	}

	public void setManifest(ManifestVO manifest) {
		this.manifest = manifest;
	}
	
}
