/**
 * Title: DepartmentPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "department", catalog = "communion")
public class DepartmentPO implements Serializable {

	private static final long serialVersionUID = -7371170236257562586L;

	public static final String COLUMN_DEPTNAME_STR = "name";

	public static final String COLUMN_PINYIN_STR = "pinyin";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_TYPE_STR = "type.dtid";

	public static final short STATUS_DISABLE_INT = 0;

	public static final short STATUS_ENABLE_INT = 1;

	public static final short IDENT_NUM_INT = 15;

	private int did;

	private String no;

	private String name;

	private String pinyin;

	private DepartmentTypePO type;

	private DepartmentPO fatherDept;

	private String createTime;

	private String comment;

	private int company;

	private short status;

	private String kino;

	private String kiname;

	private UserPO manager;

	public DepartmentPO() {
		super();
	}

	public DepartmentPO(int did) {
		super();
		this.did = did;
	}

	public DepartmentPO(String no) {
		super();
		this.no = no;
	}

	public DepartmentPO(DepartmentTypePO type, DepartmentPO fatherDept) {
		super();
		this.type = type;
		this.fatherDept = fatherDept;
	}

	public DepartmentPO(DepartmentTypePO type, DepartmentPO fatherDept, UserPO manager) {
		super();
		this.type = type;
		this.fatherDept = fatherDept;
		this.manager = manager;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dId")
	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "type", referencedColumnName = "dtid")
	public DepartmentTypePO getType() {
		return type;
	}

	public void setType(DepartmentTypePO type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fdid", referencedColumnName = "did")
	public DepartmentPO getFatherDept() {
		return fatherDept;
	}

	public void setFatherDept(DepartmentPO fatherDept) {
		this.fatherDept = fatherDept;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "kino")
	public String getKino() {
		return kino;
	}

	public void setKino(String kino) {
		this.kino = kino;
	}

	@Column(name = "kiname")
	public String getKiname() {
		return kiname;
	}

	public void setKiname(String kiname) {
		this.kiname = kiname;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "muid", referencedColumnName = "uid")
	public UserPO getManager() {
		return manager;
	}

	public void setManager(UserPO manager) {
		this.manager = manager;
	}

}
