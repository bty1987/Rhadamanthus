/**
 * @FileName	: OrganizationPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2021-9-15
 * @Copyright	: Copyright Creators 2021
 * @Author		: LY
 * @Describing	: 
 */

package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "organization", catalog = "communion")
public class OrganizationPO implements Serializable {

	private static final long serialVersionUID = 8157546327772267001L;

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short STATUS_ENABLE_INT = 0; // 启用

	public static final short STATUS_DISABLE_INT = 1; // 禁用

	private long oid;

	private String no;

	private String name;

	private String pinyin;

	private short status;

	private Integer company;

	public OrganizationPO() {
		super();
	}

	public OrganizationPO(long oid) {
		super();
		this.oid = oid;
	}

	@Id
	@GeneratedValue
	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
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

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
}