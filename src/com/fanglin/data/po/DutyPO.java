package com.fanglin.data.po;

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

import com.fanglin.department.po.DepartmentTypePO;

@Entity
@Table(name = "duty", catalog = "communion")
public class DutyPO implements Serializable {

	private static final long serialVersionUID = -5885986511194210020L;
	
	public static final String COLUMN_DID_STR = "did";

	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short COLUMN_STATUS_INT = 0;
	
	private long did;

	private String name;

	private short status;
	
	//2017.11.8新增字段
	
	private DepartmentTypePO departmentType;
	
	private int type;
	
	private short lead;


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

	public DutyPO(long did, DepartmentTypePO departmentType) {
		super();
		this.did = did;
		this.departmentType = departmentType;
	}

	public void setDid(long did) {
		this.did = did;
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

}
