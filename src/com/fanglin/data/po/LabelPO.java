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
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final short STATUS_ENABLE_STR = 0;  //启用
	
	public static final short STATUS_ISSHOW_STR = 0;  //显示
	
	private long lid;
	
	private String name;
	
	private short scale;
	
	private short type;
	
	private short status;
	
	private short isShow;

	public  LabelPO() {
		super();
	}
	
	public LabelPO(Long lid) {
		super();
		this.lid = lid;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "lid")
	public long getLid() {
		return lid;
	}

	public void setLid(long lid) {
		this.lid = lid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "scale")
	public short getScale() {
		return scale;
	}

	public void setScale(short scale) {
		this.scale = scale;
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
	@Column(name = "isShow")
	public short getIsShow() {
		return isShow;
	}

	public void setIsShow(short isShow) {
		this.isShow = isShow;
	}

}
