package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fanglin.customer.vo.CustomerProfileItemVO;
import com.fanglin.customer.vo.CustomerProfileOptionVO;
import com.fanglin.customer.vo.CustomerProfileVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customerprofile", catalog = "customer")
public class CustomerProfilePO implements Serializable {

	private static final long serialVersionUID = 5457073619229274833L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final short STATUS_SEND_INT = 1;

	public static final short STATUS_INIT_INT = 0;

	private long cpid;

	private long tid;

	private long cid;

	private String orderId;

	private String name;

	private UserPO creater;

	private Timestamp createTime;

	private short status;

	private int company;

	private List<CustomerProfileItemPO> items;

	public CustomerProfilePO() {
		super();
	}

	public CustomerProfilePO(UserPO creater) {
		super();
		this.creater = creater;
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

	@Column(name = "tid")
	public long getTid() {
		return tid;
	}

	public void setTid(long tid) {
		this.tid = tid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@OneToMany(mappedBy = "cpid", fetch = FetchType.LAZY)
	public List<CustomerProfileItemPO> getItems() {
		return items;
	}

	public void setItems(List<CustomerProfileItemPO> items) {
		this.items = items;
	}

	public CustomerProfileVO ptv(CustomerProfileVO customerProfileVO) {

		BeanUtil.copyProperties(this, customerProfileVO, Arrays.asList("items", "creater"));

		if (customerProfileVO.getCreater() != null && getCreater() != null) customerProfileVO.getCreater().setBaseInfo(getCreater());

		if (customerProfileVO.getItems() == null || getItems() == null) return customerProfileVO;

		for (CustomerProfileItemPO itemPO : getItems()) {
			customerProfileVO.getItems().add(itemPO.ptv(new CustomerProfileItemVO(new ArrayList<CustomerProfileOptionVO>())));
		}

		return customerProfileVO;
	}
}
