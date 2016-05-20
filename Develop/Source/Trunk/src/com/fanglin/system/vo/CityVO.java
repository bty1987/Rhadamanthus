/**
 * @FileName	: CityVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */
package com.fanglin.system.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class CityVO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private Integer cId;

	@SerializedName("城市编号")
	private String cityId;
	
	@SerializedName("城市名称")
	private String cityName;
	
	@SerializedName("大区信息")
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
