/**
 * @File Name		: CompanyPO.java
 * @Package   	: com.fanglin.system.po
 * @Version		: 1.0
 * @Date			: 2015-8-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "company", catalog = "communion")
public class CompanyPO implements Serializable {

	private static final long serialVersionUID = -5885986511194210020L;

	public static final int TYPE_HEADQUARTER_INT = 0;//总部
	
	public static final String COLUMN_CID_STR = "cid";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	private int cid;
	
	private int no;

	private String name;
	
	private String fullname;
	
	private String address;
	
	private String corporation;
	
	private String phone;
	
	private short status;

	public CompanyPO() {
		super();
	}

	public CompanyPO(int cid) {
		super();
		this.cid = cid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cid")
	public int getCid() {
		return cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}
	
	@Column(name = "no")
	public int getNo() {
		return no;
	}

	public void setNo(int no) {
		this.no = no;
	}
	
	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	@Column(name = "fullname")
	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}
	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	@Column(name = "corporation")
	public String getCorporation() {
		return corporation;
	}

	public void setCorporation(String corporation) {
		this.corporation = corporation;
	}
	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	
}
