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

import com.fanglin.customer.vo.CustomerAfterSalesRecordVO;
import com.fanglin.customer.vo.CustomerAfterSalesVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "customeraftersalesrecord", catalog = "customer")
public class CustomerAfterSalesRecordPO implements Serializable {

	private static final long serialVersionUID = -2212815339044686115L;

	public static final short TYPE_CREATE_INT = 0;

	public static final short TYPE_RECEIVE_INT = 1;

	public static final short TYPE_DISPATCH_INT = 2;

	public static final short TYPE_HANDLE_INT = 3;

	public static final short TYPE_TRAN_INT = 4;

	public static final short TYPE_FINISH_INT = 5;

	public static final short TYPE_CLOSE_INT = 6;

	public static final short TYPE_CANCEL_INT = 7;

	public static final short TYPE_HOLD_INT = 8;

	public static final short TYPE_UPGRADE_INT = 9;

	public static final short TYPE_REOPEN_INT = 10;

	public static final short TYPE_COMMENT_INT = 11;

	private long asrid;

	private CustomerAfterSalesPO customerAfterSales;

	private short type;

	private UserPO operator;

	private Timestamp operateTime;

	private short oldStatus;

	private short newStatus;

	private String comment;

	@Id
	@GeneratedValue
	@Column(name = "asrid")
	public long getAsrid() {
		return asrid;
	}

	public void setAsrid(long asrid) {
		this.asrid = asrid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "asid", referencedColumnName = "asid")
	public CustomerAfterSalesPO getCustomerAfterSales() {
		return customerAfterSales;
	}

	public void setCustomerAfterSales(CustomerAfterSalesPO customerAfterSales) {
		this.customerAfterSales = customerAfterSales;
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
	public UserPO getOperator() {
		return operator;
	}

	public void setOperator(UserPO operator) {
		this.operator = operator;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "oldStatus")
	public short getOldStatus() {
		return oldStatus;
	}

	public void setOldStatus(short oldStatus) {
		this.oldStatus = oldStatus;
	}

	@Column(name = "newStatus")
	public short getNewStatus() {
		return newStatus;
	}

	public void setNewStatus(short newStatus) {
		this.newStatus = newStatus;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public CustomerAfterSalesRecordPO init(CustomerAfterSalesPO customerAfterSales, short type, UserPO operator, short oldStatus, short newStatus, String comment) {

		setCustomerAfterSales(customerAfterSales);
		setType(type);
		setOperator(operator);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setOldStatus(oldStatus);
		setNewStatus(newStatus);
		setComment(comment);

		return this;
	}

	public CustomerAfterSalesRecordVO ptv(CustomerAfterSalesRecordVO customerAfterSalesRecordVO) {

		BeanUtil.copyProperties(this, customerAfterSalesRecordVO, Arrays.asList("customerAfterSales", "operator"));

		if (customerAfterSalesRecordVO.getOperator() != null && getOperator() != null) customerAfterSalesRecordVO.getOperator().setBaseInfo(getOperator());
		if (customerAfterSalesRecordVO.getCustomerAfterSales() != null && getCustomerAfterSales() != null) getCustomerAfterSales().ptv(customerAfterSalesRecordVO.getCustomerAfterSales());

		return customerAfterSalesRecordVO;
	}

	public CustomerAfterSalesRecordVO ptv() {
		return ptv(new CustomerAfterSalesRecordVO(new CustomerAfterSalesVO(new UserBaseVO(), new UserBaseVO()), new UserBaseVO()));
	}

}
