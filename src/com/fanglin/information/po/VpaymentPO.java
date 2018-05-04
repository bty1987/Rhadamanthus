package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "vpayment", catalog = "information")
public class VpaymentPO implements Serializable{

	private static final long serialVersionUID = 2636300918448354861L;
	
	public static final String COLUMN_MNO_STR = "mno";
	
	public static final String COLUMN_BRAND_STR = "brand";

	private long vpid;
	
	private String mno;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private UserPO collecter;
	
	private Timestamp collectTime;
	
	private short type;
	
	private String brand;
	
	private float money;
	
	private short way;
	
	private String receipt;
	
	public VpaymentPO() {
		super();
	}

	public VpaymentPO(UserPO creater, UserPO collecter) {
		super();
		this.creater = creater;
		this.collecter = collecter;
	}
 
	@Id
	@GeneratedValue(strategy = IDENTITY) //主键由数据库自动生成
	@Column(name = "vpid")
	public long getVpid() {
		return vpid;
	}

	public void setVpid(long vpid) {
		this.vpid = vpid;
	}

	@Column(name = "mno")
	public String getMno() {
		return mno;
	}

	public void setMno(String mno) {
		this.mno = mno;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "createrId", referencedColumnName = "uid")
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

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "collecterId", referencedColumnName = "uid")
	public UserPO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserPO collecter) {
		this.collecter = collecter;
	}

	@Column(name = "collectTime")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}
	
	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}
	
	@Column(name = "brand")
	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}
	
	@Column(name = "money")
	public float getMoney() {
		return money;
	}

	public void setMoney(float money) {
		this.money = money;
	}
	
	@Column(name = "way")
	public short getWay() {
		return way;
	}

	public void setWay(short way) {
		this.way = way;
	}
	
	@Column(name = "receipt")
	public String getReceipt() {
		return receipt;
	}

	public void setReceipt(String receipt) {
		this.receipt = receipt;
	}
	
	
}
