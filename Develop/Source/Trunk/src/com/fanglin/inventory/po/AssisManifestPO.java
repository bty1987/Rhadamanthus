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
@Table(name = "assismanifest", catalog = "inventory")
public class AssisManifestPO implements Serializable{

	private static final long serialVersionUID = 6057547291570119006L;
	
	private long amid;
	
	private AssisOrderPO assisOrder;
	
	private ManifestPO manifest;
	
	public AssisManifestPO(AssisOrderPO assisOrder, ManifestPO manifest) {
		super();
		this.assisOrder = assisOrder;
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
	@JoinColumn(name = "aoid", referencedColumnName = "aoid")
	public AssisOrderPO getAssisOrder() {
		return assisOrder;
	}

	public void setAssisOrder(AssisOrderPO assisOrder) {
		this.assisOrder = assisOrder;
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
