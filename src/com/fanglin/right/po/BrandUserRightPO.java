package com.fanglin.right.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.BrandPO;

@Entity
@Table(name = "branduserright", catalog = "communion")
public class BrandUserRightPO implements java.io.Serializable {

	private static final long serialVersionUID = 7904444901810732882L;

	public static final String COLUMN_UID_STR = "uid";

	private int burId;
	
	private int uid;
	
	private BrandPO brand;
	
//	private String brandId;

	public BrandUserRightPO(){
		super();
	}
	
	public BrandUserRightPO(int uid, BrandPO brand) {
		super();
		this.uid = uid;
		this.brand = brand;
	}



	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "burId")
	public int getBurId() {
		return burId;
	}

	public void setBurId(int burId) {
		this.burId = burId;
	}

	@Column(name = "uid")
	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

//	@Column(name = "brandId")
//	public String getBrandId() {
//		return brandId;
//	}
//
//	public void setBrandId(String brandId) {
//		this.brandId = brandId;
//	}

}