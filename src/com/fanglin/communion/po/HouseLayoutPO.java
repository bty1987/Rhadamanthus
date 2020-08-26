package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "houselayout", catalog = "communion")
public class HouseLayoutPO implements Serializable {


	private static final long serialVersionUID = -5367362944770937052L;

	private long hlid;
	
	private long vid;
	
	private String name;
	
	private String comment;
	
	private long area;
	
	public HouseLayoutPO() {
		super();
	}
	
	public HouseLayoutPO(long hlid) {
		super();
		this.hlid = hlid;
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

	@Column(name = "vid")
	public long getVid() {
		return vid;
	}

	public void setVid(long vid) {
		this.vid = vid;
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

	@Column(name = "area")
	public long getArea() {
		return area;
	}

	public void setArea(long area) {
		this.area = area;
	}
	
}
