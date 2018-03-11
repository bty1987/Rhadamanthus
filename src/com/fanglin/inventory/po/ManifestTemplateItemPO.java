package com.fanglin.inventory.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "manifesttemplateitem", catalog = "inventory")
public class ManifestTemplateItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -5581067815805537836L;
	
	public static final String COLUMN_MTID_STR = "manifestTemplate.mtId";
	
	private long mtiId;
	
	private ManifestTemplatePO manifestTemplate;
	
	private GoodsPO goods;
	
	public ManifestTemplateItemPO() {
		super();
	}

	public ManifestTemplateItemPO(ManifestTemplatePO manifestTemplate, GoodsPO goods) {
		super();
		this.manifestTemplate = manifestTemplate;
		this.goods = goods;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mtiId")
	public long getMtiId() {
		return this.mtiId;
	}

	public void setMtiId(long mtiId) {
		this.mtiId = mtiId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mtId", referencedColumnName = "mtId")
	public ManifestTemplatePO getManifestTemplate() {
		return manifestTemplate;
	}

	public void setManifestTemplate(ManifestTemplatePO manifestTemplate) {
		this.manifestTemplate = manifestTemplate;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

}