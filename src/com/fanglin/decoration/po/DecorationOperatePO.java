package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "decorationoperate", catalog = "decoration")
public class DecorationOperatePO implements java.io.Serializable {

	private static final long serialVersionUID = 5505808285022334255L;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_DISABLED_INT = 1;

	public static final short TYPE_CREATE_DECORATION_ORDER_INT = 1;

	public static final short TYPE_WASTE_DECORATION_ORDER_INT = 2;

	public static final short TYPE_TERMINATION_DECORATION_ORDER_INT = 3;

	public static final short TYPE_SUB_DECORATION_QUOTATION_NUM_INT = 4;

	public static final short TYPE_SIGN_DECORATION_ORDER_INT = 5;

	public static final short TYPE_RESIGN_DECORATION_ORDER_INT = 6;

	public static final short TYPE_SIGNED_DECORATION_ORDER_INT = 7;

	public static final short TYPE_BELONG_DECORATION_ORDER_INT = 8;

	public static final short TYPE_SALESMAN_DECORATION_ORDER_INT = 9;

	public static final short TYPE_CONTRACT_DECORATION_ORDER_INT = 10;

	public static final short TYPE_ACCOUNT_DECORATION_ORDER_INT = 11;

	public static final short TYPE_PROSIGN_DECORATION_ORDER_INT = 12;// 预签

	public static final short TYPE_HIDDEN_DECORATION_ORDER_INT = 13;// 隐藏/显示

	public static final short ATTTYPE_CURRENCY_INT = 0; // 通用

	public static final short ATTTYPE_DESIGN_INT = 1;// 设计

	public static final short ATTTYPE_BUSINESS_INT = 2;// 业务

	private long doid;

	private String orderId;

	private UserPO operater;

	private Timestamp operateTime;

	private long value;

	private short type;

	private short status;

	private short atttype;// 业务类型

	private long buid;// 归属人id

	private long bdid;// 归属部门id

	private long brid;// 归属分区id

	private int rate;// 比例

	private String comment;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "doid")
	public long getDoid() {
		return this.doid;
	}

	public void setDoid(long doid) {
		this.doid = doid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ouid", referencedColumnName = "uId")
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

	@Column(name = "value")
	public long getValue() {
		return value;
	}

	public void setValue(long value) {
		this.value = value;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "buid")
	public long getBuid() {
		return buid;
	}

	public void setBuid(long buid) {
		this.buid = buid;
	}

	@Column(name = "bdid")
	public long getBdid() {
		return bdid;
	}

	public void setBdid(long bdid) {
		this.bdid = bdid;
	}

	@Column(name = "brid")
	public long getBrid() {
		return brid;
	}

	public void setBrid(long brid) {
		this.brid = brid;
	}

	@Column(name = "rate")
	public int getRate() {
		return rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
	}

	public DecorationOperatePO belong(long buid, long bdid, long brid, short atttype, int rate) {

		setBuid(buid);
		setBdid(bdid);
		setBrid(brid);

		setAtttype(atttype);
		setRate(rate);

		return this;
	}

	public DecorationOperatePO create(String orderId, UserPO operater) {

		setOrderId(orderId);
		setOperater(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setType(DecorationOperatePO.TYPE_CREATE_DECORATION_ORDER_INT);
		setStatus(DecorationOperatePO.STATUS_INIT_INT);
		setComment("Create");

		return this;
	}

	public DecorationOperatePO sign(String orderId, UserPO operater, Long value) {

		setOrderId(orderId);
		setOperater(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setType(DecorationOperatePO.TYPE_SIGN_DECORATION_ORDER_INT);
		setStatus(DecorationOperatePO.STATUS_INIT_INT);
		setValue(value);

		setComment("Sign");

		return this;
	}

	public DecorationOperatePO resign(String orderId, UserPO operater, Long value) {

		setOrderId(orderId);
		setOperater(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setType(DecorationOperatePO.TYPE_RESIGN_DECORATION_ORDER_INT);
		setStatus(DecorationOperatePO.STATUS_INIT_INT);
		setValue(value);

		setComment("Resign");

		return this;
	}

	public DecorationOperatePO obsolete(String orderId, UserPO operater) {

		setOrderId(orderId);
		setOperater(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setType(DecorationOperatePO.TYPE_WASTE_DECORATION_ORDER_INT);
		setStatus(DecorationOperatePO.STATUS_INIT_INT);

		setComment("Obsolete");

		return this;
	}

	public DecorationOperatePO terminal(String orderId, UserPO operater) {

		setOrderId(orderId);
		setOperater(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setType(DecorationOperatePO.TYPE_TERMINATION_DECORATION_ORDER_INT);
		setStatus(DecorationOperatePO.STATUS_INIT_INT);

		setComment("Terminal");

		return this;
	}

	public DecorationOperatePO account(String orderId, UserPO operater) {

		setOrderId(orderId);
		setOperater(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setType(DecorationOperatePO.TYPE_ACCOUNT_DECORATION_ORDER_INT);
		setStatus(DecorationOperatePO.STATUS_INIT_INT);

		setComment("Account");

		return this;
	}

	public DecorationOperatePO subnum(String orderId, UserPO operater) {

		setOrderId(orderId);
		setOperater(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setType(DecorationOperatePO.TYPE_SUB_DECORATION_QUOTATION_NUM_INT);
		setStatus(DecorationOperatePO.STATUS_INIT_INT);

		setComment("Subnum");

		return this;
	}

	public DecorationOperatePO prosign(String orderId, UserPO operater) {

		setOrderId(orderId);
		setOperater(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setType(DecorationOperatePO.TYPE_PROSIGN_DECORATION_ORDER_INT);
		setStatus(DecorationOperatePO.STATUS_INIT_INT);
		setValue(value);

		setComment("Prosign");

		return this;
	}

}