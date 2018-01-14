package com.fanglin.building.vo;

public class BuildingNodeVO implements java.io.Serializable {

	private static final long serialVersionUID = -3166787653062252962L;
	
	private Long bnid;
	
	private String name;
	
	private Short type;
	
	private Short sore;
	
	private Short status;
	
	public BuildingNodeVO() {
		super();
	}

	public BuildingNodeVO(Long bnid, String name, Short type, Short sore, Short status) {
		super();
		this.bnid = bnid;
		this.name = name;
		this.type = type;
		this.sore = sore;
		this.status = status;
	}

	public Long getBnid() {
		return bnid;
	}

	public void setBnid(Long bnid) {
		this.bnid = bnid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getSore() {
		return sore;
	}

	public void setSore(Short sore) {
		this.sore = sore;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
}
