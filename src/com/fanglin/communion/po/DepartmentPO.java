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
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "department", catalog = "communion")
public class DepartmentPO implements Serializable {

	private static final long serialVersionUID = -7371170236257562586L;

	public static final String COLUMN_DEPTNAME_STR = "name";

	public static final String COLUMN_PINYIN_STR = "pinyin";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_ISDET_STR = "isdet"; //

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_TYPE_STR = "type.dtid";

	public static final short STATUS_DISABLE_INT = 0;

	public static final short STATUS_ENABLE_INT = 1;

	public static final short IDENT_NUM_INT = 15;

	public static final short ISDET_DETMENT_INT = 1;

	private int did;

	private String no;

	private String code;

	private String name;

	private String alias;

	private String pinyin;

	private DepartmentTypePO type;

	private DepartmentPO fatherDept;

	private Timestamp createTime;

	private short status;

	private short isdet;

	private String kino;

	private String kiname;

	private int limit;

	private UserPO manager;

	private String comment;

	private int company;

	private int aompany;  // 业绩公司

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

	@Column(name = "alias")
	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
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
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "isdet")
	public short getIsdet() {
		return isdet;
	}

	public void setIsdet(short isdet) {
		this.isdet = isdet;
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

	@Column(name = "limits")
	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "muid", referencedColumnName = "uid")
	public UserPO getManager() {
		return manager;
	}

	public void setManager(UserPO manager) {
		this.manager = manager;
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

	@Column(name = "aompany")
	public int getAompany() {
		return aompany;
	}

	public void setAompany(int aompany) {
		this.aompany = aompany;
	}

	@Column(name = "code")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public DepartmentVO ptv() {

		DepartmentVO departmentVO = new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO());

		BeanUtil.copyProperties(this, departmentVO, Arrays.asList("fatherDept", "type", "manager"));

		if (getType() != null) {
			BeanUtil.copyProperties(getType(), departmentVO.getType());
		}

		if (getFatherDept() != null) {
			BeanUtil.copyProperties(getFatherDept(), departmentVO.getFatherDept(), Arrays.asList("fatherDept", "cityProper", "type", "manager"));
		}

		if (departmentVO.getManager() != null && getManager() != null && getManager().getUid() != 0) departmentVO.getManager().setBaseInfo(getManager());

		return departmentVO;
	}

	public DepartmentVO ptv(DepartmentVO departmentVO) {

		BeanUtil.copyProperties(this, departmentVO, Arrays.asList("fatherDept", "type", "manager"));

		if (getType() != null && departmentVO.getType() != null) getType().ptv(departmentVO.getType());
		if (getFatherDept() != null && departmentVO.getFatherDept() != null) getFatherDept().ptv(departmentVO.getFatherDept());
		if (departmentVO.getManager() != null && getManager() != null && getManager().getUid() != 0) departmentVO.getManager().setBaseInfo(getManager());

		return departmentVO;
	}
}
