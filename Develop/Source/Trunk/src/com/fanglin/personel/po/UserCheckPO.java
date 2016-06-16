package com.fanglin.personel.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "usercheck", catalog = "platform")
public class UserCheckPO implements java.io.Serializable {

	private static final long serialVersionUID = -3081228509086918182L;
	
	public static final String COLUMN_USERID_STR = "user.userId";
	
	public static final String COLUMN_CHECKTIME_STR = "checkTime";

	private long ucId;
	
	private UserPO user;
	
	private Timestamp checkTime;
	
	private double x;
	
	private double y;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ucId", unique = true, nullable = false)
	public Long getUcId() {
		return this.ucId;
	}

	public void setUcId(Long ucId) {
		this.ucId = ucId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId", referencedColumnName = "userId")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "checkTime", length = 19)
	public Timestamp getCheckTime() {
		return this.checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	@Column(name = "x", nullable = false, precision = 22, scale = 0)
	public double getX() {
		return this.x;
	}

	public void setX(double x) {
		this.x = x;
	}

	@Column(name = "y", nullable = false, precision = 22, scale = 0)
	public double getY() {
		return this.y;
	}

	public void setY(double y) {
		this.y = y;
	}

}