package com.fanglin.personel.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;

public class DutmentVO implements Serializable {

	private static final long serialVersionUID = 7905429424434111674L;

	private Long did;
	
	private DepartmentVO dept;
	
	private DutyVO duty;
	
	private Integer limit;
	
	private Integer num;

	public DutmentVO() {
		super();
	}
	
	public DutmentVO(DepartmentVO dept, DutyVO duty) {
		super();
		this.dept = dept;
		this.duty = duty;
	}
	
	public Long getDid() {
		return did;
	}

	public void setDid(Long did) {
		this.did = did;
	}

	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}

	public DutyVO getDuty() {
		return duty;
	}

	public void setDuty(DutyVO duty) {
		this.duty = duty;
	}

	public Integer getLimit() {
		return limit;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

}
