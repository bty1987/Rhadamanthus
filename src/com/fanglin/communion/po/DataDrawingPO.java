package com.fanglin.communion.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "datadrawing", catalog = "communion")
public class DataDrawingPO implements Serializable {

	private static final long serialVersionUID = -632788118629488880L;

	public static final String COLUMN_SID_STR = "sid";

	public static final String COLUMN_TYPE_STR = "type";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	public static final short TYPE_GOODS_SHORT = 2;

	public static final short TYPE_GOODSPOOL_SHORT = 5;

	private long ddid;

	private long sid;

	private String name;

	private String drawingUrl;

	private short drawingType;

	private short type;

	private UserPO creater;

	private Timestamp createTime;

	private short status;

	public DataDrawingPO() {
		super();
	}

	public DataDrawingPO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name = "ddid")
	public long getDdid() {
		return ddid;
	}

	public void setDdid(long ddid) {
		this.ddid = ddid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "drawingUrl")
	public String getDrawingUrl() {
		return drawingUrl;
	}

	public void setDrawingUrl(String drawingUrl) {
		this.drawingUrl = drawingUrl;
	}

	@Column(name = "drawingType")
	public short getDrawingType() {
		return drawingType;
	}

	public void setDrawingType(short drawingType) {
		this.drawingType = drawingType;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
