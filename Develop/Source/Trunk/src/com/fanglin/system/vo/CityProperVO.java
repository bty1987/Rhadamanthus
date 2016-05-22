/**
 * @File Name		: CityProperVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-8-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.vo;

import java.io.Serializable;

public class CityProperVO implements Serializable {

	private static final long serialVersionUID = 20145246885240346L;
	
	private Integer cpId;
	
	private String cityProperId;
	
	private String cityProperName;
	
	private CityVO city;
	
	public Integer getCpId() {
		return cpId;
	}

	public void setCpId(Integer cpId) {
		this.cpId = cpId;
	}

	public String getCityProperId(){
		return cityProperId;
	}

	public void setCityProperId(String cityProperId){
		this.cityProperId = cityProperId;
	}

	public String getCityProperName(){
		return cityProperName;
	}

	public void setCityProperName(String cityProperName){
		this.cityProperName = cityProperName;
	}

	public CityVO getCity(){
		return city;
	}

	public void setCity(CityVO city){
		this.city = city;
	}

}
