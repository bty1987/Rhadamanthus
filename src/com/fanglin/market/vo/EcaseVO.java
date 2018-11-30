package com.fanglin.market.vo;

import java.io.Serializable;

public class EcaseVO implements Serializable{
	
	private static final long serialVersionUID = 6882544033926035322L;
	
	private Long cid;
	
	private Long cityId;
	
	private String villageName;
	
	private EpersonVO designer;
	
	private EpersonVO supervisor;
	
	private String style;
	
	private Short type;
	
	private String houseType;
	
	private Float area;
	
	private Short cycle;
	
	private String defaultUrl;
	
	private Short status;
	
	private String comment;

	public EcaseVO() {
		super();
	}

	public EcaseVO(EpersonVO designer, EpersonVO supervisor) {
		super();
		this.designer = designer;
		this.supervisor = supervisor;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getCityId() {
		return cityId;
	}

	public void setCityId(Long cityId) {
		this.cityId = cityId;
	}

	public String getVillageName() {
		return villageName;
	}

	public void setVillageName(String villageName) {
		this.villageName = villageName;
	}

	public EpersonVO getDesigner() {
		return designer;
	}

	public void setDesigner(EpersonVO designer) {
		this.designer = designer;
	}

	public EpersonVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(EpersonVO supervisor) {
		this.supervisor = supervisor;
	}

	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	public Float getArea() {
		return area;
	}

	public void setArea(Float area) {
		this.area = area;
	}

	public Short getCycle() {
		return cycle;
	}

	public void setCycle(Short cycle) {
		this.cycle = cycle;
	}

	public String getDefaultUrl() {
		return defaultUrl;
	}

	public void setDefaultUrl(String defaultUrl) {
		this.defaultUrl = defaultUrl;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
