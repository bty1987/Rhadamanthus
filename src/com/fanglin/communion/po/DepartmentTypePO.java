package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "departmenttype", catalog = "communion")
public class DepartmentTypePO implements Serializable {

	private static final long serialVersionUID = -6761713384057901062L;

	private int dtid;

	private String name;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dtid")
	public int getDtid() {
		return dtid;
	}

	public void setDtid(int dtid) {
		this.dtid = dtid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
