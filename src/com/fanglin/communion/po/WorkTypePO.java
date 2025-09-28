package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "worktype", catalog = "communion")
public class WorkTypePO implements Serializable {

	private static final long serialVersionUID = 5519653549914577239L;

	private int id;

	private String name;

	private String workTypeDes;

	public WorkTypePO() {

	}

	public WorkTypePO(int id) {
		this.id = id;
	}

	@Id
	@Column(name = "id")
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "workTypeDes")
	public String getWorkTypeDes() {
		return workTypeDes;
	}

	public void setWorkTypeDes(String workTypeDes) {
		this.workTypeDes = workTypeDes;
	}

	public WorkTypeVO ptv(WorkTypeVO workTypeVO) {

		BeanUtil.copyProperties(this, workTypeVO, "");

		return workTypeVO;
	}

}
