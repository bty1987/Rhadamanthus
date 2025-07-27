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
import com.fanglin.customer.vo.CppointVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "cppoint", catalog = "customer")
public class CppointPO implements Serializable {

	private static final long serialVersionUID = 6028304136209275173L;

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_ORDERID_STR = "orderId";

	private long cpid;

	private CustomerPO customer;

	private String orderId;

	private long dpoint;

	private long spoint;

	private long opoint;

	private long point;

	private int company;

	public CppointPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
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
	public long getDpoint() {
		return dpoint;
	}

	public void setDpoint(long dpoint) {
		this.dpoint = dpoint;
	}

	@Column(name = "spoint")
	public long getSpoint() {
		return spoint;
	}

	public void setSpoint(long spoint) {
		this.spoint = spoint;
	}

	@Column(name = "opoint")
	public long getOpoint() {
		return opoint;
	}

	public void setOpoint(long opoint) {
		this.opoint = opoint;
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

	public CppointVO ptv(CppointVO cppointVO) {

		BeanUtil.copyProperties(this, cppointVO, Arrays.asList("customer"));

		if (cppointVO.getCustomer() != null && getCustomer() != null) getCustomer().ptv(cppointVO.getCustomer());

		return cppointVO;
	}
}
