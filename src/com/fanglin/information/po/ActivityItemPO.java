package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "activityitem", catalog = "information")
public class ActivityItemPO implements java.io.Serializable {
	
	private static final long serialVersionUID = -7540185816527717351L;
	
	public static final short TYPE_COUPON_INT = 0;
	
	public static final short TYPE_THING_INT = 1;
	
	public static final String COLUMN_AID_STR = "aid";

	private long aiid;
	
	private long aid;
	
	private String activityName;
	
	private String name;
	
	private int num;
	
	private short type;
	
	private float money;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aiid")
	public long getAiid() {
		return aiid;
	}

	public void setAiid(long aiid) {
		this.aiid = aiid;
	}

	@Column(name = "aId")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "activityName")
	public String getActivityName() {
		return this.activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "num")
	public int getNum() {
		return this.num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "money")
	public float getMoney() {
		return this.money;
	}

	public void setMoney(float money) {
		this.money = money;
	}

}