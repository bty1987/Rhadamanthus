package com.fanglin.sales.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.vo.SalesOperateVO;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "salesoperate", catalog = "sales")
public class SalesOperatePO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final short TYPE_TERMINAL_INT = 1; // 废单

	public static final short TYPE_ADVANCE_INT = 2; // 恢复(预结前恢复初始)

	public static final short TYPE_FINISH_INT = 3; // 完结

	public static final short TYPE_UNPAY_INT = 4; // 反付款

	public static final short TYPE_BELONG_INT = 5; // 归属变更

	public static final short TYPE_ACTIVITY_INT = 6; // 活动标记变更

	public static final short TYPE_DELETE_ITEM_INT = 7; // 删除销售明细

	public static final short TYPE_ITEM_BALANCE_INT = 8; // 明细结算值修改

	public static final String COLUMN_SID_STR = "sid";

	private long soid;

	private long sid;

	private String no;

	private String orderId;

	private short type;

	private UserPO operater;

	private Timestamp operateTime;

	private String comment;

	private int company;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "soid")
	public long getSoid() {
		return soid;
	}

	public void setSoid(long soid) {
		this.soid = soid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
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

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public SalesOperateVO ptv(SalesOperateVO salesOperateVO) {

		salesOperateVO.setSoid(getSoid());
		salesOperateVO.setSid(getSid());
		salesOperateVO.setNo(getNo());
		salesOperateVO.setOrderId(getOrderId());
		salesOperateVO.setType(getType());
		salesOperateVO.setOperateTime(getOperateTime());
		salesOperateVO.setComment(getComment());
		salesOperateVO.setCompany(getCompany());

		if (getOperater() != null) {
			salesOperateVO.getOperater().setUid(getOperater().getUid());
			salesOperateVO.getOperater().setUserId(getOperater().getUserId());
			salesOperateVO.getOperater().setUserName(getOperater().getUserName());
			salesOperateVO.getOperater().setCurrentName(getOperater().getCurrentName());
		}

		return salesOperateVO;
	}

	public SalesOperatePO init(SalesPO salesPO, short type, String comment, UserPO operater) {

		setSid(salesPO.getSid());
		setNo(salesPO.getNo());
		setOrderId(salesPO.getOrderId());
		setType(type);
		setOperater(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setComment(comment);
		setCompany(salesPO.getCompany());

		return this;
	}
}
