/**
 * @FileName	: OrganizationVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2021-9-15
 * @Copyright	: Copyright Creators 2021
 * @Author		: LY
 * @Describing	: 
 */
package com.fanglin.system.vo;

import java.io.Serializable;

public class OrganizationVO implements Serializable {
	
	private static final long serialVersionUID = -4157191376799023013L;
	
	private Long oid;

	private String no;

	private String name;
	
	private String pinyin;
	
	private Short status;

	public OrganizationVO() {
		super();
	}

	public OrganizationVO(Long oid) {
		super();
		this.oid = oid;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
