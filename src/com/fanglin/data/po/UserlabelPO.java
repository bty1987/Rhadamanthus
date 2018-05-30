package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "userlabel", schema = "communion")
public class UserlabelPO implements Serializable {

	private static final long serialVersionUID = 4609938318464178918L;
	
	public static final String COLUMN_USER_STR = "user.uid";
	
	public static final String COLUMN_LABEL_STR = "lable.lid";
	
	private int ulid;
	
	private UserPO user;
	
	private LabelPO lable;
	
	private String value;
	
	public UserlabelPO() {
		super();
	}

	public UserlabelPO(UserPO user, LabelPO lable) {
		super();
		this.user = user;
		this.lable = lable;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ulid")
	public int getUlid() {
		return ulid;
	}

	public void setUlid(int ulid) {
		this.ulid = ulid;
	}

	@ManyToOne
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}
	
	public void setUser(UserPO user) {
		this.user = user;
	}

	@ManyToOne
	@JoinColumn(name = "lid", referencedColumnName = "lid")
	public LabelPO getLable() {
		return lable;
	}
	
	public void setLable(LabelPO lable) {
		this.lable = lable;
	}

	@Column(name = "value")
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
}
