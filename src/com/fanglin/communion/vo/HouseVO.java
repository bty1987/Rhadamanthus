package com.fanglin.communion.vo;

import java.io.Serializable;

public class HouseVO implements Serializable {

	private static final long serialVersionUID = -4319485351492418005L;

	private Long hid;

	private VillageVO village;

	private String houseNumber;

	private String built;

	private String unit;

	private Integer floor;

	private Integer door;

	private Short type;

	private Integer buildArea;

	private Short maxFloor;

	private Short through;

	private Integer roomNum;

	private String houseType;

	private Short orientation;

	private String feature;

	private Short waterVapour;

	private Short parlourType;

	private Short heatingType;

	private Integer company;

	public HouseVO() {
		super();
	}

	public HouseVO(Long hid) {
		super();
		this.hid = hid;
	}

	public HouseVO(VillageVO village) {
		super();
		this.village = village;
	}

	public Long getHid() {
		return hid;
	}

	public void setHid(Long hid) {
		this.hid = hid;
	}

	public VillageVO getVillage() {
		return village;
	}

	public void setVillage(VillageVO village) {
		this.village = village;
	}

	public String getHouseNumber() {
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber) {
		this.houseNumber = houseNumber;
	}

	public String getBuilt() {
		return built;
	}

	public void setBuilt(String built) {
		this.built = built;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Integer getFloor() {
		return floor;
	}

	public void setFloor(Integer floor) {
		this.floor = floor;
	}

	public Integer getDoor() {
		return door;
	}

	public void setDoor(Integer door) {
		this.door = door;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getBuildArea() {
		return buildArea;
	}

	public void setBuildArea(Integer buildArea) {
		this.buildArea = buildArea;
	}

	public Short getMaxFloor() {
		return maxFloor;
	}

	public void setMaxFloor(Short maxFloor) {
		this.maxFloor = maxFloor;
	}

	public Short getThrough() {
		return through;
	}

	public void setThrough(Short through) {
		this.through = through;
	}

	public Integer getRoomNum() {
		return roomNum;
	}

	public void setRoomNum(Integer roomNum) {
		this.roomNum = roomNum;
	}

	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	public Short getOrientation() {
		return orientation;
	}

	public void setOrientation(Short orientation) {
		this.orientation = orientation;
	}

	public String getFeature() {
		return feature;
	}

	public void setFeature(String feature) {
		this.feature = feature;
	}

	public Short getWaterVapour() {
		return waterVapour;
	}

	public void setWaterVapour(Short waterVapour) {
		this.waterVapour = waterVapour;
	}

	public Short getParlourType() {
		return parlourType;
	}

	public void setParlourType(Short parlourType) {
		this.parlourType = parlourType;
	}

	public Short getHeatingType() {
		return heatingType;
	}

	public void setHeatingType(Short heatingType) {
		this.heatingType = heatingType;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
