package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "label", catalog = "communion")
public class LabelPO implements Serializable {

	private static final long serialVersionUID = -2511786598073046330L;

	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_STR = 0;  //启用
	
	private int lid;
	
	private String name;
	
	private String proportion;
	
	private short type;
	
	private short status;

	public  LabelPO() {
		super();
	}
	
	public LabelPO(int lid) {
		super();
		this.lid = lid;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "lid")
	public int getLid() {
		return lid;
	}

	public void setLid(int lid) {
		this.lid = lid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "proportion")
	public String getProportion() {
		return proportion;
	}

	public void setProportion(String proportion) {
		this.proportion = proportion;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
