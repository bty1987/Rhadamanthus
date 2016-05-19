/**
 * @FileName	: Region.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */
package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "region", catalog = "communion")
public class RegionPO implements Serializable {

	private static final long serialVersionUID = -3881595135226541201L;
	
	private int rId;

	private String regionId;
	
	private String regionName;

	public static final String REGION_ID = "regionId";
	
	public RegionPO() {
		super();
	}

	public RegionPO(String regionId) {
		super();
		this.regionId = regionId;
	}

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rId") 
	public int getrId() {
		return rId;
	}

	public void setrId(int rId) {
		this.rId = rId;
	}
	
	@Id
	@Column(name = REGION_ID, nullable = false)
	public String getRegionId(){
		return regionId;
	}

	public void setRegionId(String regionId){
		this.regionId = regionId;
	}

	public static final String REGION_NAME = "regionName";

	@Column(name = REGION_NAME, nullable = false)
	public String getRegionName(){
		return regionName;
	}

	public void setRegionName(String regionName){
		this.regionName = regionName;
	}

}
