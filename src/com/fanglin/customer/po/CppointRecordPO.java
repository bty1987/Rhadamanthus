package com.fanglin.customer.po;

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

import com.fanglin.customer.vo.CppointRecordVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "cppointRecord", catalog = "customer")
public class CppointRecordPO implements Serializable {

	private static final long serialVersionUID = -720172206554456050L;

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_CPID_STR = "cpid";

	public static final short TYPE_ADDUP_INT = 0;

	public static final short TYPE_USERUP_INT = 1;

	public static final short POINTTYPE_DECORATION_INT = 0;

	public static final short POINTTYPE_SALES_INT = 1;

	public static final short POINTTYPE_OPOINT_INT = 2;

	private long cprid;

	private long cid;

	private long cpid;

	private short type;

	private short pointType;

	private long balance;

	private long point;

	private String no;

	private String orderId;

	private UserPO operater;

	private Timestamp operateTime;

	public CppointRecordPO() {
		super();
	}

	public CppointRecordPO(UserPO operater) {
		super();
		this.operater = operater;
	}

	@Id
	@GeneratedValue
	@Column(name = "cprid")
	public long getCprid() {
		return cprid;
	}

	public void setCprid(long cprid) {
		this.cprid = cprid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}

	@Column(name = "type")
	public long getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "pointType")
	public long getPointType() {
		return pointType;
	}

	public void setPointType(short pointType) {
		this.pointType = pointType;
	}

	@Column(name = "balance")
	public long getBalance() {
		return balance;
	}

	public void setBalance(long balance) {
		this.balance = balance;
	}

	@Column(name = "point")
	public long getPoint() {
		return point;
	}

	public void setPoint(long point) {
		this.point = point;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public CppointRecordPO init(long cid, long cpid, short type, short pointType, long balance, long point, String no, String orderId, UserPO operater) {

		this.setCid(cid);
		this.setCpid(cpid);

		this.setType(type);
		this.setPointType(pointType);

		this.setBalance(balance);
		this.setPoint(point);
		
		this.setNo(no);
		this.setOrderId(orderId);

		this.setOperater(operater);
		this.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		return this;
	}

	public CppointRecordVO ptv(CppointRecordVO cppointRecordVO) {

		BeanUtil.copyPropertie(this, cppointRecordVO, Arrays.asList("operater"));

		if (cppointRecordVO.getOperater() != null && getOperater() != null) cppointRecordVO.getOperater().setBaseInfo(getOperater());

		return cppointRecordVO;
	}
}
