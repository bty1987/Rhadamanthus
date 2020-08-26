package com.fanglin.personel.po;

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

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;

@Entity
@Table(name = "dutment", catalog = "communion")
public class DutmentPO implements Serializable {

	private static final long serialVersionUID = 529955556862632545L;

	private long did;

	private DepartmentPO dept;

	private DutyPO duty;

	private int limit;

	private int num;

	public DutmentPO() {
		super();
	}

	public DutmentPO(DepartmentPO dept, DutyPO duty) {
		super();
		this.dept = dept;
		this.duty = duty;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deptId", referencedColumnName = "did")
	public DepartmentPO getDept() {
		return dept;
	}

	public void setDept(DepartmentPO dept) {
		this.dept = dept;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "dutyId", referencedColumnName = "did")
	public DutyPO getDuty() {
		return duty;
	}

	public void setDuty(DutyPO duty) {
		this.duty = duty;
	}

	@Column(name = "limits")
	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

}
