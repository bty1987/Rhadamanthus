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

import com.fanglin.customer.vo.CustomerAfterSalesRefVO;
import com.fanglin.customer.vo.CustomerAfterSalesVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "customeraftersalesref", catalog = "customer")
public class CustomerAfterSalesRefPO implements Serializable {

	private static final long serialVersionUID = 4752641705427107040L;

	public static final short TYPE_FEEDBACK_INT = 0;

	public static final short TYPE_FEEDBACK_COMPLAINT_INT = 1;

	public static final short TYPE_FEEDBACK_GUARANTEE_INT = 2;

	public static final short TYPE_AEPAIR_INT = 3;

	public static final short TYPE_REPAIR_INT = 4;

	public static final short TYPE_COMPLAIN_INT = 5;

	public static final short TYPE_COMPLAINT_INT = 6;

	public static final short TYPE_REVISIT_INT = 7;

	public static final short TYPE_SURVEY_INT = 8;

	private long asfid;

	private CustomerAfterSalesPO customerAfterSales;

	private short type;

	private long refId;

	private Timestamp createTime;

	@Id
	@GeneratedValue
	@Column(name = "asfid")
	public long getAsfid() {
		return asfid;
	}

	public void setAsfid(long asfid) {
		this.asfid = asfid;
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

	@Column(name = "refId")
	public long getRefId() {
		return refId;
	}

	public void setRefId(long refId) {
		this.refId = refId;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public CustomerAfterSalesRefPO init(CustomerAfterSalesPO customerAfterSales, short type, long refId) {

		setCustomerAfterSales(customerAfterSales);
		setType(type);
		setRefId(refId);
		setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		return this;
	}

	public CustomerAfterSalesRefVO ptv(CustomerAfterSalesRefVO customerAfterSalesRefVO) {

		BeanUtil.copyProperties(this, customerAfterSalesRefVO, Arrays.asList("customerAfterSales"));

		if (customerAfterSalesRefVO.getCustomerAfterSales() != null && getCustomerAfterSales() != null) getCustomerAfterSales().ptv(customerAfterSalesRefVO.getCustomerAfterSales());

		return customerAfterSalesRefVO;
	}

	public CustomerAfterSalesRefVO ptv() {
		return ptv(new CustomerAfterSalesRefVO(new CustomerAfterSalesVO(new UserBaseVO(), new UserBaseVO())));
	}

}
