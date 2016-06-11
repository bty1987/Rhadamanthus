package com.fanglin.data.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialbrandright", catalog = "platform")
public class MaterialBrandRightPO implements java.io.Serializable {

	private static final long serialVersionUID = 6767441655705988667L;
	
	public static final String COLUMN_USERID_STR = "userId";

	private int mbrId;
	
	private String userId;
	
	private String brandId;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mbrId")
	public int getMbrId(){
		return this.mbrId;
	}

	public void setMbrId(int mbrId){
		this.mbrId = mbrId;
	}

	@Column(name = "userId")
	public String getUserId(){
		return this.userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	@Column(name = "brandId")
	public String getBrandId(){
		return this.brandId;
	}

	public void setBrandId(String brandId){
		this.brandId = brandId;
	}

}