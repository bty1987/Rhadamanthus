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

import com.fanglin.customer.vo.PointRecordVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "cppointRecord", catalog = "customer")
public class PointRecordPO implements Serializable {

	private static final long serialVersionUID = -720172206554456050L;

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_ACCOUNTID_STR = "cpid";

	public static final short TYPE_ADDUP_INT = 0;

	public static final short TYPE_USERUP_INT = 1;

	public static final short POINTTYPE_DECORATION_INT = 0;

	public static final short POINTTYPE_SALES_INT = 1;

	public static final short POINTTYPE_OPOINT_INT = 2;

	public static final short STATUS_ABLE_SHORT = 0; // 有效

	public static final short STATUS_DISABLE_SHORT = 1; // 失效

	private long recordId;

	private long cid;

	private long accountId;

	private short type;

	private short pointType;

	private short status;

	private long balance;

	private long decorationPoint;

	private long materialPoint;

	private long operatePoint;

	private long point;

	private String no;

	private String orderId;

	private UserPO operater;

	private Timestamp operateTime;

	public PointRecordPO() {
		super();
	}

	public PointRecordPO(UserPO operater) {
		super();
		this.operater = operater;
	}

	@Id
	@GeneratedValue
	@Column(name = "cprid")
	public long getRecordId() {
		return recordId;
	}

	public void setRecordId(long recordId) {
		this.recordId = recordId;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "cpid")
	public long getAccountId() {
		return accountId;
	}

	public void setAccountId(long accountId) {
		this.accountId = accountId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "pointType")
	public short getPointType() {
		return pointType;
	}

	public void setPointType(short pointType) {
		this.pointType = pointType;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "balance")
	public long getBalance() {
		return balance;
	}

	public void setBalance(long balance) {
		this.balance = balance;
	}

	@Column(name = "dpoint")
	public long getDecorationPoint() {
		return decorationPoint;
	}

	public void setDecorationPoint(long decorationPoint) {
		this.decorationPoint = decorationPoint;
	}

	@Column(name = "spoint")
	public long getMaterialPoint() {
		return materialPoint;
	}

	public void setMaterialPoint(long materialPoint) {
		this.materialPoint = materialPoint;
	}

	@Column(name = "opoint")
	public long getOperatePoint() {
		return operatePoint;
	}

	public void setOperatePoint(long operatePoint) {
		this.operatePoint = operatePoint;
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

	public PointRecordPO init(long cid, long accountId, short type, short pointType, long balance, long decorationPoint, long materialPoint, long operatePoint, long point, String no, String orderId, UserPO operater) {

		this.setCid(cid);
		this.setAccountId(accountId);

		this.setType(type);
		this.setPointType(pointType);

		this.setBalance(balance);
		this.setPoint(point);
		this.setDecorationPoint(decorationPoint);
		this.setMaterialPoint(materialPoint);
		this.setOperatePoint(operatePoint);

		this.setNo(no);
		this.setOrderId(orderId);

		this.setOperater(operater);
		this.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		return this;
	}

	public PointRecordVO ptv(PointRecordVO pointRecordVO) {

		BeanUtil.copyPropertie(this, pointRecordVO, Arrays.asList("operater"));

		if (pointRecordVO.getOperater() != null && getOperater() != null) pointRecordVO.getOperater().setBaseInfo(getOperater());

		return pointRecordVO;
	}
}
