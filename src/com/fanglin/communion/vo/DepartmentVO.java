/**
 * Title: DepartmentVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.vo;

import java.io.Serializable;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.personel.vo.UserVO;

public class DepartmentVO implements Serializable {

	private static final long serialVersionUID = -7371170236257562586L;

	private Integer did;

	private String no;

	private String name;

	private DepartmentTypeVO type;

	private DepartmentVO fatherDept;

	private String createTime;

	private Short isdet;

	private Short status;

	private String kino;

	private String kiname;

	private Integer limit;

	private UserVO manager;

	private String comment;

	private Integer company;

	private String code;

	public DepartmentVO() {
		super();
	}

	public DepartmentVO(DepartmentTypeVO type, DepartmentVO fatherDept) {
		super();
		this.type = type;
		this.fatherDept = fatherDept;
	}

	public DepartmentVO(DepartmentTypeVO type, DepartmentVO fatherDept, UserVO manager) {
		super();
		this.type = type;
		this.fatherDept = fatherDept;
		this.manager = manager;
	}

	public Integer getDid() {
		return did;
	}

	public void setDid(Integer did) {
		this.did = did;
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

	public DepartmentTypeVO getType() {
		return type;
	}

	public void setType(DepartmentTypeVO type) {
		this.type = type;
	}

	public DepartmentVO getFatherDept() {
		return fatherDept;
	}

	public void setFatherDept(DepartmentVO fatherDept) {
		this.fatherDept = fatherDept;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getKino() {
		return kino;
	}

	public void setKino(String kino) {
		this.kino = kino;
	}

	public String getKiname() {
		return kiname;
	}

	public void setKiname(String kiname) {
		this.kiname = kiname;
	}

	public Integer getLimit() {
		return limit;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

	public UserVO getManager() {
		return manager;
	}

	public void setManager(UserVO manager) {
		this.manager = manager;
	}

	public Short getIsdet() {
		return isdet;
	}

	public void setIsdet(Short isdet) {
		this.isdet = isdet;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public DepartmentVO setBaseInfo(DepartmentPO departmentPO) {

		this.did = departmentPO.getDid();
		this.no = departmentPO.getNo();
		this.name = departmentPO.getNo();

		return this;
	}

}
