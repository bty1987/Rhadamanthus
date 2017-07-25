package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.personel.vo.UserVO;

public class AuditVO implements Serializable{

	private static final long serialVersionUID = 1638493750901554171L;
	
	private Long aid;
	
	private DecorationOrderVO decorationOrder;
	
	private UserVO auditer;
	
	private Timestamp auditTime;
	
	private Integer deptDutyUId;
	
	private String deptDutyName;
	
	private String deptId;

	private Integer designerId;

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public DecorationOrderVO getDecorationOrder() {
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderVO decorationOrder) {
		this.decorationOrder = decorationOrder;
	}
	
	public UserVO getAuditer() {
		return auditer;
	}

	public void setAuditer(UserVO auditer) {
		this.auditer = auditer;
	}
	
	@JSON(format="yyyy-MM-dd")
	public Timestamp getAuditTime() {
		return auditTime;
	}

	public void setAuditTime(Timestamp auditTime) {
		this.auditTime = auditTime;
	}
	
	public Integer getDeptDutyUId() {
		return deptDutyUId;
	}

	public void setDeptDutyUId(Integer deptDutyUId) {
		this.deptDutyUId = deptDutyUId;
	}

	public String getDeptDutyName() {
		return deptDutyName;
	}

	public void setDeptDutyName(String deptDutyName) {
		this.deptDutyName = deptDutyName;
	}

	
	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public AuditVO() {
		super();
	}

	public Integer getDesignerId() {
		return designerId;
	}

	public void setDesignerId(Integer designerId) {
		this.designerId = designerId;
	}

	public AuditVO(DecorationOrderVO decorationOrder, UserVO auditer) {
		super();
		this.decorationOrder = decorationOrder;
		this.auditer = auditer;
	}
}
