package com.fanglin.building.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class BuildingScheduleVO implements java.io.Serializable {

	private static final long serialVersionUID = -718705016597107301L;
	
	private Long bsid;
	
	private BuildingNodeVO buildingNode;
	
	private BuildingVO building;
	
	private String name;
	
	private Timestamp planTime;
	
	private short status;
	
	private UserBaseVO operater;
	
	private Timestamp operatTime;
	
	private String comment;
	
	public BuildingScheduleVO(BuildingNodeVO buildingNode, BuildingVO building, UserBaseVO operater) {
		super();
		this.buildingNode = buildingNode;
		this.building = building;
		this.operater = operater;
	}

	public BuildingScheduleVO() {
		super();
	}

	public Long getBsid() {
		return bsid;
	}

	public void setBsid(Long bsid) {
		this.bsid = bsid;
	}

	public BuildingNodeVO getBuildingNode() {
		return buildingNode;
	}

	public void setBuildingNode(BuildingNodeVO buildingNode) {
		this.buildingNode = buildingNode;
	}

	public BuildingVO getBuilding() {
		return building;
	}

	public void setBuilding(BuildingVO building) {
		this.building = building;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperatTime() {
		return operatTime;
	}

	public void setOperatTime(Timestamp operatTime) {
		this.operatTime = operatTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
