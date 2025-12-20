package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class DecorationServiceVO implements Serializable{

	private static final long serialVersionUID = -721836936860379625L;

	private Long dsid;
	
	private String orderId;
	
	private String name;
	
	private String detail;
	
	private UserBaseVO operater;
	
	private Timestamp operateTime;
	
	private Short status;

	private String comment;

	private DecorationVO decoration;

	private String statusText;

	public DecorationServiceVO(){
		super();
	}
	
	public DecorationServiceVO(UserBaseVO operater){
		super();
		this.operater = operater;
	}
	
	public Long getDsid() {
		return dsid;
	}

	public void setDsid(Long dsid) {
		this.dsid = dsid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public String getStatusText() {
		return statusText;
	}

	public void setStatusText(String statusText) {
		this.statusText = statusText;
	}

}
