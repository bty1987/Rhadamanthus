/**
 * @File Name		: ApprovalFormFieldPO.java
 * @Package   		: com.fanglin.approval.po
 * @Version			: 1.0
 * @Description		: 审批表单字段定义(EAV 纵向)。每字段一行,controlType 引用控件类型字典。
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
@Table(name = "approvalFormField", catalog = "approval")
public class ApprovalFormFieldPO implements Serializable {

	private static final long serialVersionUID = 1L;

	/** 控件类型:文本 */
	public static final short CONTROL_TEXT_INT = 1;

	/** 控件类型:文本域 */
	public static final short CONTROL_TEXTAREA_INT = 2;

	/** 控件类型:数字 */
	public static final short CONTROL_NUMBER_INT = 3;

	/** 控件类型:下拉 */
	public static final short CONTROL_SELECT_INT = 4;

	/** 控件类型:日期 */
	public static final short CONTROL_DATE_INT = 5;

	/** 控件类型:用户选择 */
	public static final short CONTROL_USER_SELECT_INT = 6;

	/** 控件类型:部门选择 */
	public static final short CONTROL_DEPT_SELECT_INT = 7;

	/** 控件类型:附件 */
	public static final short CONTROL_ATTACHMENT_INT = 8;

	/** 状态:启用 */
	public static final short STATUS_ENABLED_INT = 0;

	/** 状态:禁用 */
	public static final short STATUS_DISABLED_INT = 1;

	/** 必填:否 */
	public static final short REQUIRED_NO_INT = 0;

	/** 必填:是 */
	public static final short REQUIRED_YES_INT = 1;

	private long fieldId;

	private long formId;

	private String fieldKey;

	private String fieldLabel;

	private short controlType;

	private short required;

	private String defaultValue;

	private String dataSource;

	private String validateRule;

	private int sortOrder;

	private short status;

	public ApprovalFormFieldPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "fieldId")
	public long getFieldId() {
		return fieldId;
	}

	public void setFieldId(long fieldId) {
		this.fieldId = fieldId;
	}

	@Column(name = "formId")
	public long getFormId() {
		return formId;
	}

	public void setFormId(long formId) {
		this.formId = formId;
	}

	@Column(name = "fieldKey")
	public String getFieldKey() {
		return fieldKey;
	}

	public void setFieldKey(String fieldKey) {
		this.fieldKey = fieldKey;
	}

	@Column(name = "fieldLabel")
	public String getFieldLabel() {
		return fieldLabel;
	}

	public void setFieldLabel(String fieldLabel) {
		this.fieldLabel = fieldLabel;
	}

	@Column(name = "controlType")
	public short getControlType() {
		return controlType;
	}

	public void setControlType(short controlType) {
		this.controlType = controlType;
	}

	@Column(name = "required")
	public short getRequired() {
		return required;
	}

	public void setRequired(short required) {
		this.required = required;
	}

	@Column(name = "defaultValue")
	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	@Column(name = "dataSource")
	public String getDataSource() {
		return dataSource;
	}

	public void setDataSource(String dataSource) {
		this.dataSource = dataSource;
	}

	@Column(name = "validateRule")
	public String getValidateRule() {
		return validateRule;
	}

	public void setValidateRule(String validateRule) {
		this.validateRule = validateRule;
	}

	@Column(name = "sortOrder")
	public int getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(int sortOrder) {
		this.sortOrder = sortOrder;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
