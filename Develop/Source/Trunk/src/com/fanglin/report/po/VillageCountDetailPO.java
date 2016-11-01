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
@Table(name = "villagecountdetail", catalog = "report")
public class VillageCountDetailPO implements java.io.Serializable {

	private static final long serialVersionUID = -3452814158587780349L;

	private long vcdId;
	
	private int vid;
	
	private int newOrderNum;
	
	private int signOrderNum;
	
	private Date createDate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vcdId")
	public long getVcdId() {
		return this.vcdId;
	}

	public void setVcdId(long vcdId) {
		this.vcdId = vcdId;
	}

	@Column(name = "vId")
	public int getVid() {
		return this.vid;
	}

	public void setVid(int vid) {
		this.vid = vid;
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