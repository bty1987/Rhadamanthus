/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.decoration.vo.DecorationBelongVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "decorationbelong", catalog = "decoration")
public class DecorationBelongPO implements Serializable {

	private static final long serialVersionUID = -9133628832037246531L;

	public static final short BELONGTYPE_DESIGN_INT = 0;

	public static final short BELONGTYPE_SALESMAN_INT = 1;

	public static final short BELONGTYPE_ALL_INT = 2;

	public static final short STATUS_INVALID_INT = 0;

	public static final short STATUS_EFFCTIVE_INT = 1;

	public static final short STATUS_CONFIRM_INT = 2;

	public static final short STATUS_APPROVE_INT = 3;

	public static final short DEFAULTFLAG_TRUE_INT = 1;

	public static final short DEFAULTFLAG_FALSE_INT = 0;

	public static final short TYPE_RATE_INT = 1; // 默认比例为1

	private long dbid;

	private String orderId;

	private short type;

	private UserPO belonger;

	private DepartmentPO department;

	private DepartmentPO region;

	private DecorationBusitypePO busitype;

	private int rate;

	private UserPO operater;

	private Timestamp operateTime;

	private Timestamp updateTime;

	private short status;

	private short defaultFlag;

	public DecorationBelongPO() {
		super();
	}

	public DecorationBelongPO(String orderId, UserPO belonger, DepartmentPO department, DepartmentPO region, UserPO operater) {

		super();

		this.orderId = orderId;
		this.belonger = belonger;
		this.department = department;
		this.region = region;
		this.operater = operater;
	}

	@Id
	@GeneratedValue
	@Column(name = "dbid")
	public long getDbid() {
		return dbid;
	}

	public void setDbid(long dbid) {
		this.dbid = dbid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@JoinColumn(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "buid", referencedColumnName = "uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rid", referencedColumnName = "did")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "busitype", referencedColumnName = "dbid")
	public DecorationBusitypePO getBusitype() {
		return busitype;
	}

	public void setBusitype(DecorationBusitypePO busitype) {
		this.busitype = busitype;
	}

	@JoinColumn(name = "rate")
	public int getRate() {
		return rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
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

	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public void setDefaultFlag(short defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

	public short getDefaultFlag() {
		return defaultFlag;
	}

	public DecorationBelongPO designer(String orderId, UserPO designer, UserPO operater) {

		setOrderId(orderId);

		setBelonger(designer);
		setDepartment(designer.getDept());
		setRegion(designer.getDept().getFatherDept());

		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setOperater(operater);

		setRate(1000);
		setDefaultFlag(DecorationBelongPO.DEFAULTFLAG_TRUE_INT);
		setType(DecorationBelongPO.BELONGTYPE_DESIGN_INT);
		setStatus(DecorationBelongPO.STATUS_INVALID_INT);

		setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		if (designer.getDept().getBusitype() != null) setBusitype(designer.getDept().getBusitype());

		return this;
	}

	public DecorationBelongPO salesman(String orderId, UserPO salesman, UserPO operater) {

		setOrderId(orderId);

		setBelonger(salesman);
		setDepartment(salesman.getDept());
		setRegion(salesman.getDept().getFatherDept());

		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setOperater(operater);

		setRate(1000);
		setDefaultFlag(DecorationBelongPO.DEFAULTFLAG_TRUE_INT);
		setType(DecorationBelongPO.BELONGTYPE_SALESMAN_INT);
		setStatus(DecorationBelongPO.STATUS_INVALID_INT);

		setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		if (salesman.getDept().getBusitype() != null) setBusitype(salesman.getDept().getBusitype());

		return this;
	}

	public DecorationBelongVO ptv(DecorationBelongVO decorationBelongVO) {

		BeanUtil.copy(this, decorationBelongVO, Arrays.asList("belonger", "department", "region", "operater"));

		if (decorationBelongVO.getBelonger() != null) decorationBelongVO.getBelonger().setBaseInfo(getBelonger());
		if (decorationBelongVO.getDepartment() != null) decorationBelongVO.setDepartment(getDepartment().ptv());
		if (decorationBelongVO.getRegion() != null) decorationBelongVO.setRegion(getRegion().ptv());

		if (decorationBelongVO.getOperater() != null) decorationBelongVO.getOperater().setBaseInfo(getOperater());

		return decorationBelongVO;
	}
}
