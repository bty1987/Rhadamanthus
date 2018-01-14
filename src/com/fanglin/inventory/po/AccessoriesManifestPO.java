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
@Table(name = "accessoriesmanifest", catalog = "inventory")
public class AccessoriesManifestPO implements Serializable{

	private static final long serialVersionUID = 6057547291570119006L;
	
	private long amid;
	
	private AccessoriesPO accessories;
	
	private ManifestPO manifest;

	public AccessoriesManifestPO(AccessoriesPO accessories, ManifestPO manifest) {
		super();
		this.accessories = accessories;
		this.manifest = manifest;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "amid")
	public long getAmid() {
		return amid;
	}

	public void setAmid(long amid) {
		this.amid = amid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aid", referencedColumnName = "aid")
	public AccessoriesPO getAccessories() {
		return accessories;
	}

	public void setAccessories(AccessoriesPO accessories) {
		this.accessories = accessories;
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
