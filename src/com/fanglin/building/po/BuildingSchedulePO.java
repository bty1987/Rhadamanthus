package com.fanglin.building.po;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "buildingschedule", catalog = "building")
public class BuildingSchedulePO implements java.io.Serializable {

	private static final long serialVersionUID = -6825561633675570876L;
	
	public static final String COLUMN_BOID_STR = "building.boid";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_INIT_SHORT  = 0;
	
	public static final short STATUS_DISABLE_SHORT  = 1;
	
	public static final short STATUS_END_SHORT  = 2;
	
	private long bsid;
	
	private BuildingNodePO buildingNode;
	
	private BuildingPO building;
	
	private String name;
	
	private Timestamp planTime;
	
	private short status;
	
	private UserPO operater;
	
	private Timestamp operatTime;
	
	private String comment;
	
	public BuildingSchedulePO() {
		super();
	}

	public BuildingSchedulePO(BuildingNodePO buildingNode, BuildingPO building, UserPO operater) {
		super();
		this.buildingNode = buildingNode;
		this.building = building;
		this.operater = operater;
	}

	@Id
	@GeneratedValue
	@Column(name = "bsid")
	public long getBsid() {
		return bsid;
	}

	public void setBsid(long bsid) {
		this.bsid = bsid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bnid", referencedColumnName = "bnid")
	public BuildingNodePO getBuildingNode() {
		return buildingNode;
	}

	public void setBuildingNode(BuildingNodePO buildingNode) {
		this.buildingNode = buildingNode;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "boid", referencedColumnName = "boid")
	public BuildingPO getBuilding() {
		return building;
	}
	
	public void setBuilding(BuildingPO building) {
		this.building = building;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "planTime")
	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@Column(name = "operatTime")
	public Timestamp getOperatTime() {
		return operatTime;
	}

	public void setOperatTime(Timestamp operatTime) {
		this.operatTime = operatTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
