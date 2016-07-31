/**
 * @FileName	: CityVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */
package com.fanglin.system.vo;

import java.io.Serializable;

public class CityVO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private Integer cId;

	private String cityId;
	
	private String cityName;
	
	private RegionVO region;
	
	public CityVO() {
		super();
	}
	
	public CityVO(String cityId) {
		super();
		this.cityId = cityId;
	}

	public Integer getcId() {
		return cId;
	}

	public void setcId(Integer cId) {
		this.cId = cId;
	}

	public String getCityId(){
		return cityId;
	}

	public void setCityId(String cityId){
		this.cityId = cityId;
	}

	public String getCityName(){
		return cityName;
	}

	public void setCityName(String cityName){
		this.cityName = cityName;
	}

	public RegionVO getRegion(){
		return region;
	}

	public void setRegion(RegionVO region){
		this.region = region;
	}

}
