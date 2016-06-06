package com.fanglin.data.common.vo;

import java.io.Serializable;

import com.fanglin.common.vo.BuildingNameRuleVO;
import com.fanglin.system.vo.CityProperVO;

public class VillageVO implements Serializable {

	private static final long serialVersionUID = 6573242903839888845L;
	
	private int vId;

	private String villageId;

	private String villageName;

	private String villagePinYinAB;

	private String villagePinYinAll;

	private CityProperVO cityProper;

	private BuildingNameRuleVO buildingNameRule;

	private String developer;

	private String salesPhone;

	private String deliveryTime;

	private String villageContent;
	
	private Double x;
	
	private Double y;
	
	private Integer count;
	
	private Short status;

	public VillageVO() {
		super();
	}

	public VillageVO(String villageId) {
		super();
		this.villageId = villageId;
	}

	public int getvId() {
		return vId;
	}

	public void setvId(int vId) {
		this.vId = vId;
	}

	public String getVillageId(){
		return villageId;
	}

	public String getVillageName(){
		return villageName;
	}

	public void setVillageName(String villageName){
		this.villageName = villageName;
	}

	public String getVillagePinYinAB(){
		return villagePinYinAB;
	}

	public void setVillagePinYinAB(String villagePinYinAB){
		this.villagePinYinAB = villagePinYinAB;
	}

	public String getVillagePinYinAll(){
		return villagePinYinAll;
	}

	public void setVillagePinYinAll(String villagePinYinAll){
		this.villagePinYinAll = villagePinYinAll;
	}

	public CityProperVO getCityProper(){
		return cityProper;
	}

	public void setCityProper(CityProperVO cityProper){
		this.cityProper = cityProper;
	}

	public BuildingNameRuleVO getBuildingNameRule(){
		return buildingNameRule;
	}

	public void setBuildingNameRule(BuildingNameRuleVO buildingNameRule){
		this.buildingNameRule = buildingNameRule;
	}

	public String getDeveloper(){
		return developer;
	}

	public void setDeveloper(String developer){
		this.developer = developer;
	}

	public String getSalesPhone(){
		return salesPhone;
	}

	public void setSalesPhone(String salesPhone){
		this.salesPhone = salesPhone;
	}

	public String getDeliveryTime(){
		return deliveryTime;
	}

	public void setDeliveryTime(String deliveryTime){
		this.deliveryTime = deliveryTime;
	}

	public String getVillageContent(){
		return villageContent;
	}

	public void setVillageContent(String villageContent){
		this.villageContent = villageContent;
	}

	public void setVillageId(String villageId){
		this.villageId = villageId;
	}

	public Double getX(){
		return x;
	}

	public void setX(Double x){
		this.x = x;
	}

	public Double getY(){
		return y;
	}

	public void setY(Double y){
		this.y = y;
	}

	public Integer getCount(){
		return count;
	}

	public void setCount(Integer count){
		this.count = count;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
