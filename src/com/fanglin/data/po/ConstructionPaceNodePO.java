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

import com.fanglin.data.common.vo.ConstructionPaceNodeVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "constructionpacenode", catalog = "data")
public class ConstructionPaceNodePO implements Serializable {

	private static final long serialVersionUID = -9119246565398803485L;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long cpnid;

	private long cpid;

	private String name;

	private ConstructionNodePO node;

	private int connum;

	private int comnum;

	private int prenum;

	private int postnum;

	private short status; // 0: 启用, 1: 禁用

	private String phase;

	private String material;

	private String period;

	private String content;

	private String comment;

	private int company;

	public ConstructionPaceNodePO() {
		super();
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

	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
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
	public ConstructionNodePO getNode() {
		return node;
	}

	public void setNode(ConstructionNodePO node) {
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

	@Column(name = "prenum")
	public int getPrenum() {
		return prenum;
	}

	public void setPrenum(int prenum) {
		this.prenum = prenum;
	}

	@Column(name = "postnum")
	public int getPostnum() {
		return postnum;
	}

	public void setPostnum(int postnum) {
		this.postnum = postnum;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
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

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public ConstructionPaceNodeVO ptv(ConstructionPaceNodeVO constructionPaceNodeVO) {

		BeanUtil.copyProperties(this, constructionPaceNodeVO, Arrays.asList("node"));

		if (constructionPaceNodeVO.getNode() != null && getNode() != null) getNode().ptv(constructionPaceNodeVO.getNode());

		return constructionPaceNodeVO;
	}

}
