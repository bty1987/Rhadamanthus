package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Arrays;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.BrandPO;
import com.fanglin.data.common.vo.BrandDeliverVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "branddeliver", catalog = "data")
public class BrandDeliverPO implements java.io.Serializable {

	private static final long serialVersionUID = -7033059894880038259L;

	private long bdid;

	private BrandPO brand;

	private String name;

	private ConstructionNodePO constructionNode;

	private int workNum;

	private short status;

	private String comment;

	public BrandDeliverPO() {
		super();
	}

	public BrandDeliverPO(BrandPO brand, ConstructionNodePO constructionNode) {
		super();
		this.brand = brand;
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bdid")
	public long getBdid() {
		return bdid;
	}

	public void setBdid(long bdid) {
		this.bdid = bdid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cnid", referencedColumnName = "cnid")
	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}

	@Column(name = "workNum")
	public int getWorkNum() {
		return workNum;
	}

	public void setWorkNum(int workNum) {
		this.workNum = workNum;
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

	public BrandDeliverVO ptv(BrandDeliverVO BrandDeliverVO) {

		BeanUtil.copyProperties(this, BrandDeliverVO, Arrays.asList("brand", "constructionNode"));

		if (BrandDeliverVO.getBrand() != null && getBrand() != null) BeanUtil.copyProperties(getBrand(), BrandDeliverVO.getBrand());
		if (BrandDeliverVO.getConstructionNode() != null && getConstructionNode() != null) BeanUtil.copyProperties(getConstructionNode(), BrandDeliverVO.getConstructionNode());

		return BrandDeliverVO;
	}
}
