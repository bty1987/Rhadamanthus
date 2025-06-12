package com.fanglin.data.po;

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

import com.fanglin.data.common.vo.ConstructionPeriodNodeVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "constructionPeriodNode", catalog = "data")
public class ConstructionPeriodNodePO implements Serializable {

	private static final long serialVersionUID = 7434364138129555699L;

	private long cpnid;

	private long cpid;

	private String name;

	private int period;

	private ConstructionNodePO constructionNode;

	public ConstructionPeriodNodePO() {
		super();
	}

	public ConstructionPeriodNodePO(long cpnid) {
		super();
		this.cpnid = cpnid;
	}

	public ConstructionPeriodNodePO(ConstructionNodePO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpnid")
	public long getCpnid() {
		return cpnid;
	}

	public void setCpnid(long cpnid) {
		this.cpnid = cpnid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}

	@Column(name = "period")
	public int getPeriod() {
		return period;
	}

	public void setPeriod(int period) {
		this.period = period;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cnid", referencedColumnName = "cnid")
	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public ConstructionPeriodNodeVO ptv(ConstructionPeriodNodeVO constructionPeriodNodeVO) {

		BeanUtil.copyProperties(this, constructionPeriodNodeVO, Arrays.asList("constructionNode"));

		if (constructionPeriodNodeVO.getConstructionNode() != null && getConstructionNode() != null) getConstructionNode().ptv(constructionPeriodNodeVO.getConstructionNode());

		return constructionPeriodNodeVO;
	}
}
