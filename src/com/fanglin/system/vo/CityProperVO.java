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
	
	private Integer cpid;
	
	private String no;
	
	private String name;
	
	private CityVO city;
	
	private Double x;
	
	private Double y;
	
	public CityProperVO() {
		super();
	}
	
	public CityProperVO(CityVO city) {
	    super();
	    this.city = city;
	}

	public Integer getCpid() {
		return cpid;
	}

	public void setCpid(Integer cpid) {
		this.cpid = cpid;
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

	public CityVO getCity(){
		return city;
	}

	public void setCity(CityVO city){
		this.city = city;
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
