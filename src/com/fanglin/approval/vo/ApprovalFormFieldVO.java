/**
 * @File Name		: ApprovalFormFieldVO.java
 * @Package   		: com.fanglin.approval.vo
 * @Version			: 1.0
 * @Description		: 审批表单字段定义 VO
 */

package com.fanglin.approval.vo;

import java.io.Serializable;

public class ApprovalFormFieldVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long fieldId;

	private Long formId;

	private String fieldKey;

	private String fieldLabel;

	private Short controlType;

	private Short required;

	private String defaultValue;

	private String dataSource;

	private String validateRule;

	private Integer sortOrder;

	private Short status;

	public ApprovalFormFieldVO() {
		super();
	}

	public Long getFieldId() {
		return fieldId;
	}

	public void setFieldId(Long fieldId) {
		this.fieldId = fieldId;
	}

	public Long getFormId() {
		return formId;
	}

	public void setFormId(Long formId) {
		this.formId = formId;
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

	public Short getControlType() {
		return controlType;
	}

	public void setControlType(Short controlType) {
		this.controlType = controlType;
	}

	public Short getRequired() {
		return required;
	}

	public void setRequired(Short required) {
		this.required = required;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public String getDataSource() {
		return dataSource;
	}

	public void setDataSource(String dataSource) {
		this.dataSource = dataSource;
	}

	public String getValidateRule() {
		return validateRule;
	}

	public void setValidateRule(String validateRule) {
		this.validateRule = validateRule;
	}

	public Integer getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(Integer sortOrder) {
		this.sortOrder = sortOrder;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
