package com.fanglin.inventory.vo;

import java.io.Serializable;

public class AccessoriesManifestVO implements Serializable{

	private static final long serialVersionUID = 7764011939608561432L;

	private Long amid;
	
	private AccessoriesVO accessories;
	
	private ManifestVO manifest;
	
	public AccessoriesManifestVO(AccessoriesVO accessories, ManifestVO manifest) {
		super();
		this.accessories = accessories;
		this.manifest = manifest;
	}

	public Long getAmid() {
		return amid;
	}

	public void setAmid(Long amid) {
		this.amid = amid;
	}

	public AccessoriesVO getAccessories() {
		return accessories;
	}

	public void setAccessories(AccessoriesVO accessories) {
		this.accessories = accessories;
	}

	public ManifestVO getManifest() {
		return manifest;
	}

	public void setManifest(ManifestVO manifest) {
		this.manifest = manifest;
	}
	
}
