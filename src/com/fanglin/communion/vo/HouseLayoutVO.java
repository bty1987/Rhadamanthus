package com.fanglin.communion.vo;

public class HouseLayoutVO implements java.io.Serializable {

	private static final long serialVersionUID = -7238188136462418037L;

	private Long hlid;
	
	private Long vid;
	
	private String name;
	
	private String comment;
	
	private Long area;
	
	public HouseLayoutVO() {
		super();
	}

	public HouseLayoutVO(Long hlid) {
		super();
		this.hlid = hlid;
	}

	public Long getHlid() {
		return hlid;
	}

	public void setHlid(Long hlid) {
		this.hlid = hlid;
	}

	public Long getVid() {
		return vid;
	}

	public void setVid(Long vid) {
		this.vid = vid;
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

	public Long getArea() {
		return area;
	}

	public void setArea(Long area) {
		this.area = area;
	}
	
}
