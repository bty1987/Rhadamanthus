package com.fanglin.right.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "branduserright", catalog = "communion")
public class BrandUserRightPO implements java.io.Serializable {

	private static final long serialVersionUID = 7904444901810732882L;

	public static final String COLUMN_UID_STR = "uid";

	private int burId;
	
	private int uid;
	
	private String brandId;

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

	@Column(name = "brandId")
	public String getBrandId() {
		return brandId;
	}

	public void setBrandId(String brandId) {
		this.brandId = brandId;
	}

}