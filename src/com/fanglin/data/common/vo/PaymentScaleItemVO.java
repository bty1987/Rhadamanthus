package com.fanglin.data.common.vo;

public class PaymentScaleItemVO {
		
	private Long psiid;
		
	private	Long psid;
		
	private String name;
		
	private Integer scale;
	
	private Short sort;

	public PaymentScaleItemVO() {
			super();
	}

	public Long getPsiid() {
		return psiid;
	}

	public void setPsiid(Long psiid) {
		this.psiid = psiid;
	}

	public Long getPsid() {
		return psid;
	}

	public void setPsid(Long psid) {
		this.psid = psid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getScale() {
		return scale;
	}

	public void setScale(Integer scale) {
		this.scale = scale;
	}

	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}

}
