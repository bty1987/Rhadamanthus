/**
 * @File Name		: ApprovalFormDataVO.java
 * @Package   		: com.fanglin.approval.vo
 * @Version			: 1.0
 * @Description		: 审批表单填写数据 VO
 */

package com.fanglin.approval.vo;

import java.io.Serializable;

public class ApprovalFormDataVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long dataId;

	private Long aid;

	private Long fieldId;

	private String fieldValue;

	private Long taskId;

	/** 字段键(联表查询时填充,非表字段) */
	private String fieldKey;

	/** 字段标签(联表查询时填充,非表字段) */
	private String fieldLabel;

	public ApprovalFormDataVO() {
		super();
	}

	public Long getDataId() {
		return dataId;
	}

	public void setDataId(Long dataId) {
		this.dataId = dataId;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getFieldId() {
		return fieldId;
	}

	public void setFieldId(Long fieldId) {
		this.fieldId = fieldId;
	}

	public String getFieldValue() {
		return fieldValue;
	}

	public void setFieldValue(String fieldValue) {
		this.fieldValue = fieldValue;
	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public String getFieldKey() {
		return fieldKey;
	}

	public void setFieldKey(String fieldKey) {
		this.fieldKey = fieldKey;
	}

	public String getFieldLabel() {
		return fieldLabel;
	}

	public void setFieldLabel(String fieldLabel) {
		this.fieldLabel = fieldLabel;
	}

}
