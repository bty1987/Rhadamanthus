package com.fanglin.communion.vo;

import com.fanglin.personel.vo.UserVO;

public class BrandSupplierVO implements java.io.Serializable {

	private static final long serialVersionUID = 6320887348119978331L;

	private Long buid;

	private UserVO supplier;

	private BrandVO brand;

	public BrandSupplierVO() {
		super();
	}

	public BrandSupplierVO(UserVO supplier, BrandVO brand) {
		super();
		this.supplier = supplier;
		this.brand = brand;
	}

	public Long getBuid() {
		return buid;
	}

	public void setBuid(Long buid) {
		this.buid = buid;
	}

	public UserVO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserVO supplier) {
		this.supplier = supplier;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
		this.brand = brand;
	}

}