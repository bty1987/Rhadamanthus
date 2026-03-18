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
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.personel.vo.UserBaseVO;

public class DepartmentVO implements Serializable {

	private static final long serialVersionUID = -7371170236257562586L;

	private Integer did;

	private String no;

	private String code;

	private String name;

	private String alias;

	private DepartmentTypeVO type;

	private DecorationBusitypeVO busitype;

	private DepartmentVO fatherDept;

	private Timestamp createTime;

	private Short isdet;

	private Short status;

	private String kino;

	private String kiname;

	private Integer limit;

	private UserBaseVO manager;

	private String comment;

	private Integer company;

	private Integer aompany;  // 业绩公司

	public DepartmentVO() {
		super();
	}

	public DepartmentVO(DepartmentVO fatherDept) {
		super();
		this.fatherDept = fatherDept;
	}

	public DepartmentVO(DepartmentTypeVO type, DepartmentVO fatherDept) {
		super();
		this.type = type;
		this.fatherDept = fatherDept;
	}

	public DepartmentVO(DepartmentTypeVO type, DepartmentVO fatherDept, UserBaseVO manager) {
		super();
		this.type = type;
		this.fatherDept = fatherDept;
		this.manager = manager;
	}

	public DepartmentVO(DepartmentTypeVO type, DepartmentVO fatherDept, UserBaseVO manager, DecorationBusitypeVO busitype) {
		super();
		this.type = type;
		this.fatherDept = fatherDept;
		this.manager = manager;
		this.busitype = busitype;
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

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public DepartmentTypeVO getType() {
		return type;
	}

	public void setType(DepartmentTypeVO type) {
		this.type = type;
	}

	public DecorationBusitypeVO getBusitype() {
		return busitype;
	}

	public void setBusitype(DecorationBusitypeVO busitype) {
		this.busitype = busitype;
	}

	public DepartmentVO getFatherDept() {
		return fatherDept;
	}

	public void setFatherDept(DepartmentVO fatherDept) {
		this.fatherDept = fatherDept;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
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

	public Integer getAompany() {
		return aompany;
	}

	public void setAompany(Integer aompany) {
		this.aompany = aompany;
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

	public UserBaseVO getManager() {
		return manager;
	}

	public void setManager(UserBaseVO manager) {
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
