package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.common.po.BuildingNameRulePO;
import com.fanglin.system.po.CityProperPO;

@Entity
@Table(name = "village", catalog = "communion")
public class VillagePO implements Serializable {

	private static final long serialVersionUID = -6088354807004872639L;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	private int vId;

	private String villageId;

	private String villageName;

	private String villageNamePinYinAB;

	private String villageNamePinYinAll;

	private CityProperPO cityProper;

	private BuildingNameRulePO buildingNameRule;

	private String developer;

	private String salesPhone;

	private String deliveryTime;

	private String villageContent;
	
	private double x;
	
	private double y;
	
	private int count;
	
	private short status;

	public VillagePO(){
		super();
	}

	public VillagePO(String villageId){
		this.villageId = villageId;
	}

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "vId") 
	public int getvId() {
		return vId;
	}

	public void setvId(int vId) {
		this.vId = vId;
	}

	@Id
	@Column(name = "villageId")
	public String getVillageId(){
		return villageId;
	}

	public void setVillageId(String villageId){
		this.villageId = villageId;
	}

	@Column(name = "villageName")
	public String getVillageName(){
		return villageName;
	}

	public void setVillageName(String villageName){
		this.villageName = villageName;
	}

	@Column(name = "villageNamePinYinAll")
	public String getVillageNamePinYinAll(){
		return villageNamePinYinAll;
	}

	public void setVillageNamePinYinAll(String villageNamePinYinAll){
		this.villageNamePinYinAll = villageNamePinYinAll;
	}

	@Column(name = "villageNamePinYinAB")
	public String getVillageNamePinYinAB(){
		return villageNamePinYinAB;
	}

	public void setVillageNamePinYinAB(String villageNamePinYinAB){
		this.villageNamePinYinAB = villageNamePinYinAB;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "cityProperId", referencedColumnName = "cityProperId")
	public CityProperPO getCityProper(){
		return cityProper;
	}

	public void setCityProper(CityProperPO cityProper){
		this.cityProper = cityProper;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "buildingNameRuleId", referencedColumnName = "id")
	public BuildingNameRulePO getBuildingNameRule(){
		return buildingNameRule;
	}

	public void setBuildingNameRule(BuildingNameRulePO buildingNameRule){
		this.buildingNameRule = buildingNameRule;
	}

	@Column(name = "developer")
	public String getDeveloper(){
		return developer;
	}

	public void setDeveloper(String developer){
		this.developer = developer;
	}

	@Column(name = "salesPhone")
	public String getSalesPhone(){
		return salesPhone;
	}

	public void setSalesPhone(String salesPhone){
		this.salesPhone = salesPhone;
	}

	@Column(name = "deliveryTime")
	public String getDeliveryTime(){
		return deliveryTime;
	}

	public void setDeliveryTime(String deliveryTime){
		this.deliveryTime = deliveryTime;
	}

	@Column(name = "villageContent")
	public String getVillageContent(){
		return villageContent;
	}

	public void setVillageContent(String villageContent){
		this.villageContent = villageContent;
	}

	@Column(name = "x")
	public double getX(){
		return x;
	}

	public void setX(double x){
		this.x = x;
	}

	@Column(name = "y")
	public double getY(){
		return y;
	}

	public void setY(double y){
		this.y = y;
	}

	@Column(name = "count")
	public int getCount(){
		return count;
	}

	public void setCount(int count){
		this.count = count;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
