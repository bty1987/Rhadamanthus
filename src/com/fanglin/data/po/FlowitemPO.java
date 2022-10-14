package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "flowitem", catalog = "data")
public class FlowitemPO implements Serializable {

	private static final long serialVersionUID = 6877799217685897166L;

	private long fiid;

	private long fpid;

	private String name;

	private String content;

	private short type;

	private int x;

	private int y;

	private long pfiid;

	private long nfiid;

	public FlowitemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "fiid")
	public long getFiid() {
		return fiid;
	}

	public void setFiid(long fiid) {
		this.fiid = fiid;
	}

	@Column(name = "fpid")
	public long getFpid() {
		return fpid;
	}

	public void setFpid(long fpid) {
		this.fpid = fpid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "x")
	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	@Column(name = "y")
	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	@Column(name = "pfiid")
	public long getPfiid() {
		return pfiid;
	}

	public void setPfiid(long pfiid) {
		this.pfiid = pfiid;
	}

	@Column(name = "nfiid")
	public long getNfiid() {
		return nfiid;
	}

	public void setNfiid(long nfiid) {
		this.nfiid = nfiid;
	}

}
