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
@Table(name = "citypropercountdetail", catalog = "report")
public class CityProperCountDetailPO implements java.io.Serializable {

	private static final long serialVersionUID = 9052972049501516562L;

	private long cpcdId;
	
	private int cpId;
	
	private int newOrderNum;
	
	private int signOrderNum;
	
	private Date createDate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpcdId")
	public long getCpcdId() {
		return this.cpcdId;
	}

	public void setCpcdId(long cpcdId) {
		this.cpcdId = cpcdId;
	}

	@Column(name = "cpId")
	public int getCpId() {
		return this.cpId;
	}

	public void setCpId(int cpId) {
		this.cpId = cpId;
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