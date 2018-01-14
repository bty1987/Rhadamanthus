/**
 * @FileName	: ResionVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */

package com.fanglin.system.vo;

import java.io.Serializable;

public class RegionVO implements Serializable {

	private static final long serialVersionUID = -8574387881119439555L;
	
	private Integer rId;

	private String regionId;
	
	private String regionName;

	private Double x;
	
	private Double y;

	public Integer getrId() {
		return rId;
	}

	public void setrId(Integer rId) {
		this.rId = rId;
	}

	public String getRegionId(){
		return regionId;
	}

	public void setRegionId(String regionId){
		this.regionId = regionId;
	}

	public String getRegionName(){
		return regionName;
	}

	public void setRegionName(String regionName){
		this.regionName = regionName;
	}

	public Double getX() {
		return x;
	}

	public void setX(Double x) {
		this.x = x;
	}

	public Double getY() {
		return y;
	}

	public void setY(Double y) {
		this.y = y;
	}

}
