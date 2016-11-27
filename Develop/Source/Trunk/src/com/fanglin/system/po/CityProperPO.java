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
	
	public static final String COLUMN_PINYIN_STR = "pinyin";
	
	private int cpId;
	
	private CityPO city;
	
	private String cityProperId;
	
	private String cityProperName;
	
	private String pinyin;
	
	private double x;
	
	private double y;
	
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
	
	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="cityId", referencedColumnName="cityId")
	public CityPO getCity(){
		return city;
	}

	public void setCity(CityPO city){
		this.city = city;
	}

	@Id
	@Column(name = CITY_PROPER_ID)
	public String getCityProperId(){
		return cityProperId;
	}

	public void setCityProperId(String cityProperId){
		this.cityProperId = cityProperId;
	}

	@Column(name = CITY_PROPER_NAME)
	public String getCityProperName(){
		return cityProperName;
	}

	public void setCityProperName(String cityProperName){
		this.cityProperName = cityProperName;
	}

	@Column(name = COLUMN_PINYIN_STR)
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
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
