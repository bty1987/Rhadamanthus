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
import java.util.Arrays;

import com.fanglin.personel.po.UserPO;
import com.fanglin.building.vo.BuildingHouseVO;
import com.fanglin.building.vo.BuildingCustomerVO;
import com.fanglin.building.vo.BuildingRecordVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "buildingrecord", catalog = "building")
public class BuildingRecordPO implements java.io.Serializable {

	private static final long serialVersionUID = -8309508914055593961L;

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_CSID_STR = "buildingCustomer.csid";

	public static final String COLUMN_HSID_STR = "buildingHouse.hsid";

	public static final short COLUMN_TYPE_SHORT_THR = 3;

	public static final short COLUMN_PATTERN_SHORT_FOUR = 4;

	private long brid;

	private BuildingHousePO buildingHouse;

	private BuildingCustomerPO buildingCustomer;

	private String comment;

	private short type;

	private short pattern;

	private UserPO operater;

	private Timestamp operatTime;

	public BuildingRecordPO() {
		super();
	}

	public BuildingRecordPO(BuildingHousePO buildingHouse, BuildingCustomerPO buildingCustomer, UserPO operater) {
		super();
		this.buildingHouse = buildingHouse;
		this.buildingCustomer = buildingCustomer;
		this.operater = operater;
	}

	@Id
	@GeneratedValue
	@Column(name = "brid")
	public long getBrid() {
		return brid;
	}

	public void setBrid(long brid) {
		this.brid = brid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hsid", referencedColumnName = "hsid")
	public BuildingHousePO getBuildingHouse() {
		return buildingHouse;
	}

	public void setBuildingHouse(BuildingHousePO buildingHouse) {
		this.buildingHouse = buildingHouse;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "csid", referencedColumnName = "csid")
	public BuildingCustomerPO getBuildingCustomer() {
		return buildingCustomer;
	}

	public void setBuildingCustomer(BuildingCustomerPO buildingCustomer) {
		this.buildingCustomer = buildingCustomer;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "pattern")
	public short getPattern() {
		return pattern;
	}

	public void setPattern(short pattern) {
		this.pattern = pattern;
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

	public BuildingRecordVO ptv() {

		BuildingHouseVO buildingHouseVO = new BuildingHouseVO(new HouseVO(new VillageVO()));

		BuildingCustomerVO buildingCustomerVO = new BuildingCustomerVO(new CustomerVO(), new UserBaseVO());

		BuildingRecordVO buildingRecordVO = new BuildingRecordVO(buildingHouseVO, buildingCustomerVO, new UserBaseVO());

		BeanUtil.copyProperties(this, buildingRecordVO, Arrays.asList("buildingHouse", "buildingCustomer", "operater"));

		BuildingHousePO buildingHousePO = getBuildingHouse();
		if (buildingHousePO != null) {
			BeanUtil.copyProperties(buildingHousePO, buildingHouseVO, Arrays.asList("house", "customer", "create", "followUser", "keyer", "department", "region"));
			if (buildingHousePO.getHouse() != null) buildingHousePO.getHouse().ptv(buildingHouseVO.getHouse());
		}

		BuildingCustomerPO buildingCustomerPO = getBuildingCustomer();
		if (buildingCustomerPO != null) {
			BeanUtil.copyProperties(buildingCustomerPO, buildingCustomerVO, Arrays.asList("customer", "create"));
			BeanUtil.copyProperties(buildingCustomerPO.getCustomer(), buildingCustomerVO.getCustomer());
		}

		// operater
		BeanUtil.copyProperties(getOperater(), buildingRecordVO.getOperater(), Arrays.asList("dept", "duty"));

		return buildingRecordVO;
	}
}
