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
import com.fanglin.data.common.vo.BrandInstallVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "brandinstall", catalog = "data")
public class BrandInstallPO implements java.io.Serializable {

	private static final long serialVersionUID = -8036668729115730303L;

	private long biid;

	private String name;

	private BrandPO brand;

	private ConstructionNodePO constructionNode;

	private int workNum;

	private short status;

	private String comment;

	public BrandInstallPO() {
		super();
	}

	public BrandInstallPO(BrandPO brand, ConstructionNodePO constructionNode) {
		super();
		this.brand = brand;
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "biid")
	public long getBiid() {
		return biid;
	}

	public void setBiid(long biid) {
		this.biid = biid;
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

	public BrandInstallVO ptv(BrandInstallVO brandInstallVO) {

		BeanUtil.copyProperties(this, brandInstallVO, Arrays.asList("brand", "constructionNode"));

		if (brandInstallVO.getBrand() != null && getBrand() != null) BeanUtil.copyProperties(getBrand(), brandInstallVO.getBrand());
		if (brandInstallVO.getConstructionNode() != null && getConstructionNode() != null) BeanUtil.copyProperties(getConstructionNode(), brandInstallVO.getConstructionNode());

		return brandInstallVO;
	}
}
