package com.fanglin.customer.po;

import java.io.Serializable;

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
@Table(name = "groupuser", catalog = "customer")
public class GroupUserPO implements Serializable{

	private static final long serialVersionUID = 5579421111848704875L;
	
	public static final String COLUMN_OPENGID_STR = "opengid";
	
	public static final String COLUMN_UNIONID_STR = "unionId";
	
	private long guid;
	
	private String opengid;
	
	private UserPO user;

	@Id
	@GeneratedValue
	@Column(name="guid")
	public long getGuid() {
		return guid;
	}

	public void setGuid(long guid) {
		this.guid = guid;
	}

	@Column(name="opengid")
	public String getOpengid() {
		return opengid;
	}

	public void setOpengid(String opengid) {
		this.opengid = opengid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "uid", referencedColumnName="uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}
	
}
