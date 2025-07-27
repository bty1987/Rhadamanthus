package com.fanglin.sales.po;

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

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.vo.SalesProfileItemVO;
import com.fanglin.sales.vo.SalesProfileOptionVO;
import com.fanglin.sales.vo.SalesProfileVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "salesprofile", catalog = "sales")
public class SalesProfilePO implements Serializable {
	private static final long serialVersionUID = -2433385203272562862L;

	public static final short TYPE_DEFAULT_INT = 0;

	private long spid;

	private long tid;

	private String orderId;

	private String name;

	private UserPO creater;

	private Timestamp createTime;

	private short type;

	private short status;

	private long company;

	private List<SalesProfileItemPO> items;

	public SalesProfilePO() {
		super();
	}

	public SalesProfilePO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name = "spid")
	public long getSpid() {
		return spid;
	}

	public void setSpid(long spid) {
		this.spid = spid;
	}

	@Column(name = "tid")
	public long getTid() {
		return tid;
	}

	public void setTid(long tid) {
		this.tid = tid;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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

	@Column(name = "company")
	public long getCompany() {
		return company;
	}

	public void setCompany(long company) {
		this.company = company;
	}

	@OneToMany(mappedBy = "spid", fetch = FetchType.LAZY)
	public List<SalesProfileItemPO> getItems() {
		return items;
	}

	public void setItems(List<SalesProfileItemPO> items) {
		this.items = items;
	}

	public SalesProfileVO ptv(SalesProfileVO salesProfileVO) {

		BeanUtil.copyProperties(this, salesProfileVO, Arrays.asList("items", "creater"));

		if (salesProfileVO.getCreater() != null && getCreater() != null) salesProfileVO.getCreater().setBaseInfo(getCreater());

		if (salesProfileVO.getItems() == null || getItems() == null) return salesProfileVO;

		for (SalesProfileItemPO itemPO : getItems()) {
			salesProfileVO.getItems().add(itemPO.ptv(new SalesProfileItemVO(new ArrayList<SalesProfileOptionVO>())));
		}

		return salesProfileVO;
	}

}
