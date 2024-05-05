package com.fanglin.communion.vo;

public class HouseLayoutVO implements java.io.Serializable {

	private static final long serialVersionUID = -7238188136462418037L;

	private Long hlid;

	private VillageVO village;

	private String name;

	private String comment;

	private String layout;

	private String houseType;

	private Long area;

	public HouseLayoutVO() {
		super();
	}

	public HouseLayoutVO(Long hlid) {
		super();
		this.hlid = hlid;
	}

	public HouseLayoutVO(VillageVO village) {
		super();
		this.village = village;
	}

	public Long getHlid() {
		return hlid;
	}

	public void setHlid(Long hlid) {
		this.hlid = hlid;
	}

	public VillageVO getVillage() {
		return village;
	}

	public void setVillage(VillageVO village) {
		this.village = village;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getLayout() {
		return layout;
	}

	public void setLayout(String layout) {
		this.layout = layout;
	}

	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	public Long getArea() {
		return area;
	}

	public void setArea(Long area) {
		this.area = area;
	}

}
