
package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.VillagePO;

@Entity
@Table(name="house", catalog = "communion")
public class HousePO implements Serializable{

	private static final long serialVersionUID = -4319485351492418004L;
	
	public static final String COLUMN_HID_STR = "hid";
	
	public static final String COLUMN_VILLAGE_NO_STR = "village.no";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_HOUSENUMBER_STR = "houseNumber";
	
    public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	private  long hid;
	
	private VillagePO village;
	
	private String houseNumber;
	
	private String built;
	
	private String unit;
	
	private int floor;
	
	private int door;
	
	private short type;
	
	private float buildArea;
	
	private short maxFloor;
	
	private short through;
	
	private int roomNum;
	
	private String houseType;
	
	private short orientation;
	
	private String feature;
	
	private short waterVapour;
	
	private short parlourType;
	
	private short heatingType;
	
	private short status;
	
	public HousePO() {
		super();
	}
	
	public HousePO(long hid) {
		super();
		this.hid = hid;
	}
	
	public HousePO(VillagePO village) {
		super();
		this.village = village;
	}
	
	@Id
	@GeneratedValue
	@Column(name="hid")
	public long getHid() {
		return hid;
	}

	public void setHid(long hid) {
		this.hid = hid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "no", referencedColumnName="no")
	public VillagePO getVillage() {
		return village;
	}

	public void setVillage(VillagePO village) {
		this.village = village;
	}

	@Column(name="houseNumber")
	public String getHouseNumber() {
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber) {
		this.houseNumber = houseNumber;
	}

	@Column(name="built")
	public String getBuilt() {
		return built;
	}

	public void setBuilt(String built) {
		this.built = built;
	}

	@Column(name="unit")
	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@Column(name="floor")
	public int getFloor() {
		return floor;
	}

	public void setFloor(int floor) {
		this.floor = floor;
	}

	@Column(name="door")
	public int getDoor() {
		return door;
	}

	public void setDoor(int door) {
		this.door = door;
	}

	@Column(name="type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name="buildArea")
	public float getBuildArea() {
		return buildArea;
	}

	public void setBuildArea(float buildArea) {
		this.buildArea = buildArea;
	}

	@Column(name="maxFloor")
	public short getMaxFloor() {
		return maxFloor;
	}

	public void setMaxFloor(short maxFloor) {
		this.maxFloor = maxFloor;
	}

	@Column(name="through")
	public short getThrough() {
		return through;
	}

	public void setThrough(short through) {
		this.through = through;
	}

	@Column(name="roomNum")
	public int getRoomNum() {
		return roomNum;
	}

	public void setRoomNum(int roomNum) {
		this.roomNum = roomNum;
	}

	@Column(name="houseType")
	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	@Column(name="orientation")
	public short getOrientation() {
		return orientation;
	}

	public void setOrientation(short orientation) {
		this.orientation = orientation;
	}

	@Column(name="feature")
	public String getFeature() {
		return feature;
	}

	public void setFeature(String feature) {
		this.feature = feature;
	}

	@Column(name="waterVapour")
	public short getWaterVapour() {
		return waterVapour;
	}

	public void setWaterVapour(short waterVapour) {
		this.waterVapour = waterVapour;
	}

	@Column(name="parlourType")
	public short getParlourType() {
		return parlourType;
	}

	public void setParlourType(short parlourType) {
		this.parlourType = parlourType;
	}

	@Column(name="heatingType")
	public short getHeatingType() {
		return heatingType;
	}

	public void setHeatingType(short heatingType) {
		this.heatingType = heatingType;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	public String address(){
		return String.format("%s %s", this.village.getName(), this.houseNumber);
	}
	
	
}
