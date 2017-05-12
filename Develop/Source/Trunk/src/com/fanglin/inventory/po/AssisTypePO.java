package com.fanglin.inventory.po;

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

import com.fanglin.data.po.WorkTypePO;
@Entity
@Table(name = "assistype", catalog = "inventory")
public class AssisTypePO implements Serializable{

	private static final long serialVersionUID = 3057953925525624710L;

	public static final String COLUMN_WORKTYPE_ID_STR = "workType.id";
	
	public static final String COLUMN_WORKTYPE_NAME_STR = "workType.name";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	private Long atid;
	
	private String name;
	
	private WorkTypePO workType;
	
	private Short status;
	
	private String comment;
	
	public AssisTypePO() {
		super();
	}
	
	public AssisTypePO(WorkTypePO workType){
		super();
		this.workType = workType;
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY) //主键由数据库自动生成
	@Column(name = "atid")
	public Long getAtid() {
		return atid;
	}

	public void setAtid(Long atid) {
		this.atid = atid;
	}
	
	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wtid", referencedColumnName = "id")
	public WorkTypePO getWorkType() {
		return workType;
	}

	public void setWorkType(WorkTypePO workType) {
		this.workType = workType;
	}
	
	@Column(name = "status")
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
