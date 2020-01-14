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

import com.fanglin.data.po.GoodsPO;

@Entity
@Table(name = "manifesttemplateitem", catalog = "inventory")
public class ManifestTemplateItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -5581067815805537836L;
	
	public static final String COLUMN_MTID_STR = "manifestTemplate.mtid";
	
	private long mtiid;
	
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
	@Column(name = "mtiid")
	public long getMtiid() {
		return this.mtiid;
	}

	public void setMtiid(long mtiid) {
		this.mtiid = mtiid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mtid", referencedColumnName = "mtid")
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