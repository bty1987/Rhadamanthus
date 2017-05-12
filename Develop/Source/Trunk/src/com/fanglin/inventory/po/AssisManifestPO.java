package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "assismanifest", catalog = "inventory")
public class AssisManifestPO implements Serializable{

	private static final long serialVersionUID = 6057547291570119006L;
	
	private Long amid;
	
	private AssisOrderPO purchase;
	
	private ManifestPO manifest;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "gId")
	public Long getAmid() {
		return amid;
	}

	public void setAmid(Long amid) {
		this.amid = amid;
	}

	public AssisOrderPO getPurchase() {
		return purchase;
	}

	public void setPurchase(AssisOrderPO purchase) {
		this.purchase = purchase;
	}

	public ManifestPO getManifest() {
		return manifest;
	}

	public void setManifest(ManifestPO manifest) {
		this.manifest = manifest;
	}
	
}
