package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "branduserright", catalog = "platform")
public class BrandUserRightPO implements java.io.Serializable {

	private static final long serialVersionUID = 7904444901810732882L;

	public static final String COLUMN_USERID_STR = "userId";

	private int burId;
	
	private String userId;
	
	private BrandPO brand;
	
	public BrandUserRightPO() {
		super();
	}

	public BrandUserRightPO(String userId) {
		super();
		this.userId = userId;
	}

	public BrandUserRightPO(String userId, BrandPO brand) {
		super();
		this.userId = userId;
		this.brand = brand;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "burId")
	public int getBurId() {
		return burId;
	}

	@Column(name = "userId")
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bid", referencedColumnName="bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

}