package com.fanglin.dingding.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "dingtalkapprovalconfig", catalog = "hades")
public class DingTalkApprovalConfigPO implements java.io.Serializable {

	private static final long serialVersionUID = -4567890123456789012L;

	public static final short TYPE_GENERIC = 0; // 通用审批：走 approve/refuse 逻辑
	public static final short TYPE_SPECIALIZED = 1; // 专用审批：走反射调用

	public static final String COLUMN_PROCESSCODE_STR = "processCode";
	public static final String COLUMN_ENABLED_STR = "enabled";
	public static final String COLUMN_COMPANYID_STR = "companyId";
	public static final String COLUMN_TYPE_STR = "type";

	private long id;
	private String processCode;
	private String name;
	private String fieldId;
	private String beanClass;
	private String methodName;
	private String voClass;
	private Short handleAgreeOnly;
	private Short enabled;
	private Short type;
	private Integer companyId;
	private Timestamp createTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "id")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Column(name = "processCode", nullable = false, length = 100)
	public String getProcessCode() {
		return processCode;
	}

	public void setProcessCode(String processCode) {
		this.processCode = processCode;
	}

	@Column(name = "name", nullable = false, length = 100)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "fieldId", length = 100)
	public String getFieldId() {
		return fieldId;
	}

	public void setFieldId(String fieldId) {
		this.fieldId = fieldId;
	}

	@Column(name = "beanClass", length = 200)
	public String getBeanClass() {
		return beanClass;
	}

	public void setBeanClass(String beanClass) {
		this.beanClass = beanClass;
	}

	@Column(name = "methodName", length = 100)
	public String getMethodName() {
		return methodName;
	}

	public void setMethodName(String methodName) {
		this.methodName = methodName;
	}

	@Column(name = "voClass", length = 200)
	public String getVoClass() {
		return voClass;
	}

	public void setVoClass(String voClass) {
		this.voClass = voClass;
	}

	@Column(name = "handleAgreeOnly", nullable = false)
	public Short getHandleAgreeOnly() {
		return handleAgreeOnly;
	}

	public void setHandleAgreeOnly(Short handleAgreeOnly) {
		this.handleAgreeOnly = handleAgreeOnly;
	}

	@Column(name = "enabled", nullable = false)
	public Short getEnabled() {
		return enabled;
	}

	public void setEnabled(Short enabled) {
		this.enabled = enabled;
	}

	@Column(name = "type", nullable = false)
	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	@Column(name = "companyId", nullable = false)
	public Integer getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Integer companyId) {
		this.companyId = companyId;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
