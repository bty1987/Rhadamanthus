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
@Table(name = "buildingrecord", catalog = "building")
public class BuildingRecordPO implements java.io.Serializable{

	private static final long serialVersionUID = -8309508914055593961L;
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_CSID_STR = "customerSource.csid";
	
	public static final String COLUMN_HSID_STR = "houseSource.hsid";
	
	public static final short COLUMN_TYPE_SHORT_THR = 3;
	
	public static final short COLUMN_PATTERN_SHORT_FOUR = 4;
	
	private long brid;
	
	private HouseSourcePO houseSource;
	
	private CustomerSourcePO customerSource;
	
	private String comment;
	
	private short type;
	
	private short pattern;
	
	private UserPO operater;
	
	private Timestamp operatTime;
	
	public BuildingRecordPO() {
		super();
	}
	
	public BuildingRecordPO(HouseSourcePO houseSource, CustomerSourcePO customerSource, UserPO operater) {
		super();
		this.houseSource = houseSource;
		this.customerSource = customerSource;
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
	public HouseSourcePO getHouseSource() {
		return houseSource;
	}

	public void setHouseSource(HouseSourcePO houseSource) {
		this.houseSource = houseSource;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "csid", referencedColumnName = "csid")
	public CustomerSourcePO getCustomerSource() {
		return customerSource;
	}

	public void setCustomerSource(CustomerSourcePO customerSource) {
		this.customerSource = customerSource;
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

}
