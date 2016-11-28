package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "dusercountdetail", catalog = "report")
public class DUserCountDetailPO implements java.io.Serializable {

	private static final long serialVersionUID = 2273639497474419489L;
	
	public static final String COLUMN_DESIGNER_USERID_STR = "designer.userId";
	
	public static final String COLUMN_SALEMSNA_USERID_STR = "salesman.userId";
	
	public static final String COLUMN_CREATEDATE_STR = "createDate";

	private long ducdId;
	
	private UserPO designer;
	
	private UserPO salesman;
	
	private float createNum;
	
	private float signNum;
	
	private float contractPrice;
	
	private Date createDate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ducdId")
	public long getDucdId() {
		return this.ducdId;
	}

	public void setDucdId(long ducdId) {
		this.ducdId = ducdId;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "duId", referencedColumnName="uId")
	public UserPO getDesigner() {
		return designer;
	}

	public void setDesigner(UserPO designer) {
		this.designer = designer;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "suId", referencedColumnName="uId")
	public UserPO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserPO salesman) {
		this.salesman = salesman;
	}

	@Column(name = "createNum")
	public float getCreateNum() {
		return this.createNum;
	}

	public void setCreateNum(float createNum) {
		this.createNum = createNum;
	}

	@Column(name = "signNum")
	public float getSignNum() {
		return this.signNum;
	}

	public void setSignNum(float signNum) {
		this.signNum = signNum;
	}

	@Column(name = "contractPrice")
	public float getContractPrice() {
		return this.contractPrice;
	}

	public void setContractPrice(float contractPrice) {
		this.contractPrice = contractPrice;
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