package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "houselayout", catalog = "communion")
public class HouseLayoutPO implements Serializable {

	private static final long serialVersionUID = -5367362944770937052L;

	private long hlid;

	private VillagePO village;

	private String name;

	private String comment;

	private String layout;

	private String houseType;

	private long area;

	public HouseLayoutPO() {
		super();
	}

	public HouseLayoutPO(long hlid) {
		super();
		this.hlid = hlid;
	}

	public HouseLayoutPO(VillagePO village) {
		super();
		this.village = village;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hlid")
	public long getHlid() {
		return hlid;
	}

	public void setHlid(long hlid) {
		this.hlid = hlid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vid", referencedColumnName = "vid")
	public VillagePO getVillage() {
		return village;
	}

	public void setVillage(VillagePO village) {
		this.village = village;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "layout")
	public String getLayout() {
		return layout;
	}

	public void setLayout(String layout) {
		this.layout = layout;
	}

	@Column(name = "houseType")
	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	@Column(name = "area")
	public long getArea() {
		return area;
	}

	public void setArea(long area) {
		this.area = area;
	}

}
