package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.customer.vo.PointAccountVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "cppoint", catalog = "customer")
public class PointAccountPO implements Serializable {

	private static final long serialVersionUID = 6028304136209275173L;

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_ORDERID_STR = "orderId";

	private long accountId;

	private CustomerPO customer;

	private String orderId;

	private long decorationPoint;

	private long materialPoint;

	private long operatePoint;

	private long point;

	private int company;

	public PointAccountPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpid")
	public long getAccountId() {
		return accountId;
	}

	public void setAccountId(long accountId) {
		this.accountId = accountId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cid", referencedColumnName = "cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public PointAccountVO ptv(PointAccountVO pointAccountVO) {

		BeanUtil.copyProperties(this, pointAccountVO, Arrays.asList("customer"));

		if (pointAccountVO.getCustomer() != null && getCustomer() != null) getCustomer().ptv(pointAccountVO.getCustomer());

		return pointAccountVO;
	}
}
