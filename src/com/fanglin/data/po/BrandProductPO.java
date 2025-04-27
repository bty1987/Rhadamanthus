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
import com.fanglin.data.common.vo.BrandProductVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "brandproduct", catalog = "data")
public class BrandProductPO implements java.io.Serializable {

	private static final long serialVersionUID = -5702992772429273699L;

	private long bpid;

	private String name;

	private BrandPO brand;

	private ConstructionNodePO constructionNode;

	private int workNum;

	private short status;

	private String comment;

	public BrandProductPO() {
		super();
	}

	public BrandProductPO(BrandPO brand, ConstructionNodePO constructionNode) {
		super();
		this.brand = brand;
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bpid")
	public long getBpid() {
		return bpid;
	}

	public void setBpid(long bpid) {
		this.bpid = bpid;
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

	public BrandProductVO ptv(BrandProductVO brandProductVO) {

		BeanUtil.copyProperties(this, brandProductVO, Arrays.asList("brand", "constructionNode"));

		if (brandProductVO.getBrand() != null && getBrand() != null) BeanUtil.copyProperties(getBrand(), brandProductVO.getBrand());
		if (brandProductVO.getConstructionNode() != null && getConstructionNode() != null) BeanUtil.copyProperties(getConstructionNode(), brandProductVO.getConstructionNode());

		return brandProductVO;
	}
}
