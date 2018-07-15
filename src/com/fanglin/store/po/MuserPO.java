package com.fanglin.store.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="muser", catalog = "store")
public class MuserPO implements Serializable{
	
	private static final long serialVersionUID = -4319485591492418004L;

	public static final String COLUMN_UID_STR = "uid";
	
	public static final String COLUMN_UNIONID_STR = "unionId";
	
	private long uid;
	
	private String unionId;
	
	private String name;
	
	private String phone;
	
	private short gender;
	
	private String birthday;

	public MuserPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name="uid")
	public long getUid() {
		return uid;
	}

	public void setUid(long uid) {
		this.uid = uid;
	}

	@Column(name="unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name="name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name="phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name="gender")
	public short getGender() {
		return gender;
	}

	public void setGender(short gender) {
		this.gender = gender;
	}

	@Column(name="birthday")
	public String getBirthday() {
		return birthday;
	}

	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	
}
