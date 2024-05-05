package com.fanglin.right.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserFunctionPO;

@Entity
@Table(name = "userfunctionright", catalog = "platform")
public class UserFunctionRightPO implements Serializable {

	private static final long serialVersionUID = 1545172508848961555L;

	private long ufrid;

	private String name;

	private UserFunctionPO userFunction;

	private int company;

	public UserFunctionRightPO() {
		super();
	}

	public UserFunctionRightPO(UserFunctionPO userFunction) {
		super();
		this.userFunction = userFunction;
	}

	@Id
	@GeneratedValue
	@Column(name = "ufrid")
	public long getUfrid() {
		return ufrid;
	}

	public void setUfrid(long ufrid) {
		this.ufrid = ufrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "ufid", referencedColumnName = "ufid")
	public UserFunctionPO getUserFunction() {
		return userFunction;
	}

	public void setUserFunction(UserFunctionPO userFunction) {
		this.userFunction = userFunction;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
