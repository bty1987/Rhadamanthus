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
import com.fanglin.data.common.vo.BrandServerVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "brandserver", catalog = "data")
public class BrandServerPO implements java.io.Serializable {

	private static final long serialVersionUID = 804107460416279592L;

	private long bsid;

	private BrandPO brand;

	private String name;

	private ConstructionNodePO constructionNode;

	private int workNum;

	private short status;

	private String comment;

	public BrandServerPO() {
		super();
	}

	public BrandServerPO(BrandPO brand, ConstructionNodePO constructionNode) {
		super();
		this.brand = brand;
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bsid")
	public long getBsid() {
		return bsid;
	}

	public void setBsid(long bsid) {
		this.bsid = bsid;
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

	public BrandServerVO ptv(BrandServerVO brandServerVO) {

		BeanUtil.copyProperties(this, brandServerVO, Arrays.asList("brand", "constructionNode"));

		if (brandServerVO.getBrand() != null && getBrand() != null) BeanUtil.copyProperties(getBrand(), brandServerVO.getBrand());
		if (brandServerVO.getConstructionNode() != null && getConstructionNode() != null) BeanUtil.copyProperties(getConstructionNode(), brandServerVO.getConstructionNode());

		return brandServerVO;
	}
}
