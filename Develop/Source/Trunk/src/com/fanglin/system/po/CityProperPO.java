package com.fanglin.system.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cityproper", catalog = "communion")
public class CityProperPO implements Serializable {

	private static final long serialVersionUID = -187946615003407460L;
	
	public static final String CITY_PROPER_ID ="cityProperId";
	
	public static final String CITY_PROPER_NAME = "cityProperName";
	
	private int cpId;
	
	private String cityProperId;
	
	private String cityProperName;
	
	private CityPO city;
	
	public CityProperPO(){
	}
	
	public CityProperPO(String cityProperId){
		this.cityProperId = cityProperId;
	}

	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpId") 
	public int getCpId() {
		return cpId;
	}

	public void setCpId(int cpId) {
		this.cpId = cpId;
	}

	@Id
	@Column(name=CITY_PROPER_ID)
	public String getCityProperId(){
		return cityProperId;
	}

	public void setCityProperId(String cityProperId){
		this.cityProperId = cityProperId;
	}

	@Column(name=CITY_PROPER_NAME)
	public String getCityProperName(){
		return cityProperName;
	}

	public void setCityProperName(String cityProperName){
		this.cityProperName = cityProperName;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="cityId", referencedColumnName="cityId")
	public CityPO getCity(){
		return city;
	}

	public void setCity(CityPO city){
		this.city = city;
	}
	
}
