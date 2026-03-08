package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "duty", catalog = "communion")
public class DutyPO implements Serializable {

	private static final long serialVersionUID = -5885986511194210020L;

	public static final String COLUMN_DID_STR = "did";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_CODE_STR = "code";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_INIT_INT = 0;

	private long did;

	private String name;

	private String code;

	private short status;

	private DepartmentTypePO departmentType;

	private int type;

	private short lead;

	private String pinYin;

	public DutyPO() {
		super();
	}

	public DutyPO(long did) {
		super();
		this.did = did;
	}

	public DutyPO(DepartmentTypePO departmentType) {

		this.departmentType = departmentType;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "did")
	public long getDid() {
		return did;
	}

	public void setDid(long did) {
		this.did = did;
	}

	public DutyPO(long did, DepartmentTypePO departmentType) {
		super();
		this.did = did;
		this.departmentType = departmentType;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "code")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "departmentType", referencedColumnName = "dtid")
	public DepartmentTypePO getDepartmentType() {
		return departmentType;
	}

	public void setDepartmentType(DepartmentTypePO departmentType) {
		this.departmentType = departmentType;
	}

	@Column(name = "type")
	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	@Column(name = "lead")
	public short getLead() {
		return lead;
	}

	public void setLead(short lead) {
		this.lead = lead;
	}

	@Column(name = "pinYin")
	public String getPinYin() {
		return pinYin;
	}

	public void setPinYin(String pinYin) {
		this.pinYin = pinYin;
	}

	public DutyVO ptv(DutyVO dutyVO) {

		BeanUtil.copyPropertie(this, dutyVO, Arrays.asList("departmentType"));

		if (dutyVO.getDepartmentType() != null && getDepartmentType() != null) getDepartmentType().ptv(dutyVO.getDepartmentType());

		return dutyVO;
	}

}
