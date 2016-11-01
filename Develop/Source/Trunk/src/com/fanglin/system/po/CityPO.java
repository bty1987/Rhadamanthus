/**
 * @FileName	: CityPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */

package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name = "city", catalog = "communion")
public class CityPO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public static final String CITY_ID = "cityId";
	
	public static final String CITY_NAME = "cityName";
	
	public static final String CITY_REGION_ID = "cityRegionId";
	
	public static final String REGION_ID = "regionId";
	
	private int cId;

	private String cityId;

	private String cityName;

	private RegionPO region;
	
	private double x;
	
	private double y;
	
	@GeneratedValue
	@Column(name = "cId")
	public int getcId() {
		return cId;
	}

	public void setcId(int cId) {
		this.cId = cId;
	}
	
	@Id
	@Column(name = CITY_ID, nullable = false)
	public String getCityId(){
		return cityId;
	}

	public void setCityId(String cityId){
		this.cityId = cityId;
	}

	@Column(name = CITY_NAME, nullable = false)
	public String getCityName(){
		return cityName;
	}

	public void setCityName(String cityName){
		this.cityName = cityName;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = CITY_REGION_ID, referencedColumnName="regionId")
	public RegionPO getRegion(){
		return region;
	}

	public void setRegion(RegionPO region){
		this.region = region;
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
