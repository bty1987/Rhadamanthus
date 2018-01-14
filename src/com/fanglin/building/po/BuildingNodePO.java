package com.fanglin.building.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "buildingnode", catalog = "building")
public class BuildingNodePO implements java.io.Serializable {

	private static final long serialVersionUID = -33335088324855672L;
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final Short COLUMN_SORE_ONE = 1;
	
	private long bnid;
	
	private String name;
	
	private short type;
	
	private short sore;
	
	private short status;
	
	public BuildingNodePO() {
		super();
	}

	public BuildingNodePO(long bnid, String name, short type, short sore, short status) {
		super();
		this.bnid = bnid;
		this.name = name;
		this.type = type;
		this.sore = sore;
		this.status = status;
	}

	@Id
	@GeneratedValue
	@Column(name = "bnid")
	public long getBnid() {
		return bnid;
	}

	public void setBnid(long bnid) {
		this.bnid = bnid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "sore")
	public short getSore() {
		return sore;
	}

	public void setSore(short sore) {
		this.sore = sore;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	

}
