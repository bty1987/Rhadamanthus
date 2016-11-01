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
	
	public static final String REGION_ID = "regionId";
	
	public static final String REGION_NAME = "regionName";
	
	private int rId;

	private String regionId;
	
	private String regionName;
	
	private double x;
	
	private double y;

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
	@Column(name = REGION_ID)
	public String getRegionId(){
		return regionId;
	}

	public void setRegionId(String regionId){
		this.regionId = regionId;
	}

	@Column(name = REGION_NAME)
	public String getRegionName(){
		return regionName;
	}

	public void setRegionName(String regionName){
		this.regionName = regionName;
	}

	@Column(name = "x")
	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	@Column(name = "y")
	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

}
