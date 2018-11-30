package com.fanglin.market.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="ecase", catalog = "market")
public class EcasePO implements Serializable{
	
	private static final long serialVersionUID = 8110709617957003009L;
	
	public static final String COLUMN_CITYID_STR = "cityId";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_STATUS_STR = "status";

	private long cid;
	
	private long cityId;
	
	private String villageName;
	
	private EpersonPO designer;
	
	private EpersonPO supervisor;
	
	private String style;
	
	private short type;
	
	private String houseType;
	
	private float area;
	
	private short cycle;
	
	private String defaultUrl;
	
	private short status;
	
	private String comment;
	
	public EcasePO() {
		super();
	}

	public EcasePO(EpersonPO designer, EpersonPO supervisor) {
		super();
		this.designer = designer;
		this.supervisor = supervisor;
	}

	@Id
	@GeneratedValue
	@Column(name="cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name="cityId")
	public long getCityId() {
		return cityId;
	}

	public void setCityId(long cityId) {
		this.cityId = cityId;
	}

	@Column(name="villageName")
	public String getVillageName() {
		return villageName;
	}

	public void setVillageName(String villageName) {
		this.villageName = villageName;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "duid", referencedColumnName="euid")
	public EpersonPO getDesigner() {
		return designer;
	}

	public void setDesigner(EpersonPO designer) {
		this.designer = designer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "suid", referencedColumnName="euid")
	public EpersonPO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(EpersonPO supervisor) {
		this.supervisor = supervisor;
	}

	@Column(name="style")
	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	@Column(name="type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name="houseType")
	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	@Column(name="area")
	public float getArea() {
		return area;
	}

	public void setArea(float area) {
		this.area = area;
	}

	@Column(name="cycle")
	public short getCycle() {
		return cycle;
	}

	public void setCycle(short cycle) {
		this.cycle = cycle;
	}

	@Column(name="defaultUrl")
	public String getDefaultUrl() {
		return defaultUrl;
	}

	public void setDefaultUrl(String defaultUrl) {
		this.defaultUrl = defaultUrl;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
