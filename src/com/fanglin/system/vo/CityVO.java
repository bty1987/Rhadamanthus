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

public class CityVO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private Integer cid;

	private String no;
	
	private String name;
	
	private RegionVO region;
	
	private Double x;
	
	private Double y;
	
	public CityVO() {
		super();
	}
	
	public CityVO(String no) {
		super();
		this.no = no;
	}
	
	public Integer getCid() {
		return cid;
	}

	public void setCid(Integer cid) {
		this.cid = cid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public RegionVO getRegion(){
		return region;
	}

	public void setRegion(RegionVO region){
		this.region = region;
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
