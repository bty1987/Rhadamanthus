/**
 * @File Name	: Rework.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

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

import com.fanglin.construction.vo.ConstructionPlanVO;
import com.fanglin.data.po.ConstructionPaceNodePO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "constructionplan", catalog = "construction")
public class ConstructionPlanPO implements Serializable {

	private static final long serialVersionUID = -420481503968375195L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	private long cpid;

	private long cid;

	private String orderId;

	private String name;

	private ConstructionPaceNodePO node;

	private int connum;

	private int comnum;

	private String phase;

	private String material;

	private String period;

	private Timestamp createTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private int sort;

	private String content;

	private String comment;

	public ConstructionPlanPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cpnid", referencedColumnName = "cpnid")
	public ConstructionPaceNodePO getNode() {
		return node;
	}

	public void setNode(ConstructionPaceNodePO node) {
		this.node = node;
	}

	@Column(name = "connum")
	public int getConnum() {
		return connum;
	}

	public void setConnum(int connum) {
		this.connum = connum;
	}

	@Column(name = "comnum")
	public int getComnum() {
		return comnum;
	}

	public void setComnum(int comnum) {
		this.comnum = comnum;
	}

	@Column(name = "phase")
	public String getPhase() {
		return phase;
	}

	public void setPhase(String phase) {
		this.phase = phase;
	}

	@Column(name = "material")
	public String getMaterial() {
		return material;
	}

	public void setMaterial(String material) {
		this.material = material;
	}

	@Column(name = "period")
	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "startTime")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	@Column(name = "sort")
	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public ConstructionPlanVO ptv(ConstructionPlanVO constructionPlanVO) {

		BeanUtil.copyProperties(this, constructionPlanVO, Arrays.asList("node"));

		if (constructionPlanVO.getNode() != null && getNode() != null) getNode().ptv(constructionPlanVO.getNode());

		return constructionPlanVO;
	}
}
