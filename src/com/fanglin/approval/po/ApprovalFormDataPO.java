/**
 * @File Name		: ApprovalFormDataPO.java
 * @Package   		: com.fanglin.approval.po
 * @Version			: 1.0
 * @Description		: 审批表单填写数据(运行时)。每次提交/审批产生的填写值,每值一行。
 * 					  (aid, fieldId) 联合索引支持按字段精确查询。
 */

package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalFormData", catalog = "approval")
public class ApprovalFormDataPO implements Serializable {

	private static final long serialVersionUID = 1L;

	private long dataId;

	private long aid;

	private long fieldId;

	private String fieldValue;

	private Long taskId;

	public ApprovalFormDataPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dataId")
	public long getDataId() {
		return dataId;
	}

	public void setDataId(long dataId) {
		this.dataId = dataId;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "fieldId")
	public long getFieldId() {
		return fieldId;
	}

	public void setFieldId(long fieldId) {
		this.fieldId = fieldId;
	}

	@Column(name = "fieldValue")
	public String getFieldValue() {
		return fieldValue;
	}

	public void setFieldValue(String fieldValue) {
		this.fieldValue = fieldValue;
	}

	@Column(name = "taskId")
	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

}
