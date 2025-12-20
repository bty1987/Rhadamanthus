package com.fanglin.decoration.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.vo.DecorationServiceVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "decorationService", catalog = "decoration")
public class DecorationServiceDO implements Serializable {

	private static final long serialVersionUID = -4568396564651596348L;

	public static final short SERVICESTATUS_INIT_INT = 0; // 初始

	public static final short SERVICESTATUS_FINISH_INT = 1; // 完成

	private long dsid; // 服务ID

	private DecorationPO decoration;

	private String name; // 服务名称

	private String detail; // 服务详述

	private UserPO operater; // 操作人

	private Timestamp operateTime; // 操作时间

	private short status; // 状态

	private String comment; // 备注

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "dsid")
	public long getDsid() {
		return dsid;
	}

	public void setDsid(long dsid) {
		this.dsid = dsid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "orderId", referencedColumnName = "orderId", insertable = false, updatable = false)
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "detail")
	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "dsuid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public DecorationServiceVO ptv(DecorationServiceVO decorationServiceVO) {

		BeanUtil.copyProperties(this, decorationServiceVO, Arrays.asList("decoration", "operater"));

		if (decorationServiceVO.getOperater() != null && this.getOperater() != null) decorationServiceVO.getOperater().setBaseInfo(getOperater());
		if (decorationServiceVO.getDecoration() != null && getDecoration() != null) getDecoration().ptvcascade(decorationServiceVO.getDecoration());

		return decorationServiceVO;
	}
}