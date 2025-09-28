package com.fanglin.sales.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.vo.SalesDeliveryVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "salesdelivery", catalog = "sales")
public class SalesDeliveryPO implements Serializable {

	private static final long serialVersionUID = 3763032172384805206L;

	private long sdid;

	private SalesPO sales;

	private Timestamp createTime;

	private Timestamp peliveryTime;

	private UserPO creater;

	private short status;

	private String comment;

	private int company;

	public SalesDeliveryPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "sdid")
	public long getSdid() {
		return sdid;
	}

	public void setSdid(long sdid) {
		this.sdid = sdid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sid", referencedColumnName = "sid")
	public SalesPO getSales() {
		return sales;
	}

	public void setSales(SalesPO sales) {
		this.sales = sales;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "peliveryTime")
	public Timestamp getPeliveryTime() {
		return peliveryTime;
	}

	public void setPeliveryTime(Timestamp peliveryTime) {
		this.peliveryTime = peliveryTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
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

	public SalesDeliveryVO ptv(SalesDeliveryVO salesDeliveryVO) {

		BeanUtil.copyPropertie(this, salesDeliveryVO, Arrays.asList("sales", "creater"));

		if (salesDeliveryVO.getCreater() != null && getCreater() != null) salesDeliveryVO.getCreater().setBaseInfo(getCreater());

		if (salesDeliveryVO.getSales() != null) getSales().ptv(salesDeliveryVO.getSales());

		return salesDeliveryVO;
	}
}
