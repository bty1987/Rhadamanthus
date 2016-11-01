package com.fanglin.report.po;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "citycountdetail", catalog = "report")
public class CityCountDetailPO implements java.io.Serializable {

	private static final long serialVersionUID = -7454101664023525444L;

	private long ccdId;
	
	private int cid;
	
	private int newOrderNum;
	
	private int signOrderNum;
	
	private Date createDate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ccdId")
	public long getCcdId() {
		return this.ccdId;
	}

	public void setCcdId(long ccdId) {
		this.ccdId = ccdId;
	}

	@Column(name = "cId")
	public int getCid() {
		return this.cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}

	@Column(name = "newOrderNum")
	public int getNewOrderNum() {
		return this.newOrderNum;
	}

	public void setNewOrderNum(int newOrderNum) {
		this.newOrderNum = newOrderNum;
	}

	@Column(name = "signOrderNum")
	public int getSignOrderNum() {
		return this.signOrderNum;
	}

	public void setSignOrderNum(int signOrderNum) {
		this.signOrderNum = signOrderNum;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "createDate")
	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

}