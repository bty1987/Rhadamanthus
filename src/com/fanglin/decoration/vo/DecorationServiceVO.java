package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class DecorationServiceVO implements Serializable {

	private static final long serialVersionUID = -721836936860379625L;

	private Long dsid;

	private String orderId;

	private DecorationVO decoration;

	private String name;

	private String detail;

	private UserBaseVO operater;

    private UserBaseVO finisher;

    private Timestamp createTime;

	private Timestamp operateTime;

    private Timestamp planTime;

    private Timestamp finishTime;

	private Short status;

	private String comment;

	private Integer overdueDays;

	private Short type;

	public DecorationServiceVO() {
		super();
	}

	public DecorationServiceVO(UserBaseVO operater) {
		super();
		this.operater = operater;
	}

	public DecorationServiceVO(DecorationVO decoration, UserBaseVO operater) {
		super();
		this.decoration = decoration;
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

	@JSON(format = "yyyy-MM-dd")
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	public UserBaseVO getFinisher() {
		return finisher;
	}

	public void setFinisher(UserBaseVO finisher) {
		this.finisher = finisher;
	}

	public Integer getOverdueDays() {
		return overdueDays;
	}

	public void setOverdueDays(Integer overdueDays) {
		this.overdueDays = overdueDays;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}
