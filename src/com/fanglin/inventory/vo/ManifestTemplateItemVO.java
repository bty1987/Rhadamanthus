package com.fanglin.inventory.vo;


public class ManifestTemplateItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 6009033959954676623L;

	private Long mtiid;
	
	private ManifestTemplateVO manifestTemplate;
	
	private GoodsVO goods;
	
	public ManifestTemplateItemVO() {
		super();
	}

	public ManifestTemplateItemVO(GoodsVO goods, ManifestTemplateVO manifestTemplate) {
		super();
		this.manifestTemplate = manifestTemplate;
		this.goods = goods;
	}

	public Long getMtiid() {
		return this.mtiid;
	}

	public void setMtiid(Long mtiid) {
		this.mtiid = mtiid;
	}

	public ManifestTemplateVO getManifestTemplate() {
		return manifestTemplate;
	}

	public void setManifestTemplate(ManifestTemplateVO manifestTemplate) {
		this.manifestTemplate = manifestTemplate;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

}