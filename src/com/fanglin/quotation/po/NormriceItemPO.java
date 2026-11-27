package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fanglin.core.interceptor.FLException;

import com.fanglin.data.po.ConstructionNodePO;

/**
 * 定额工费明细字段基类(@MappedSuperclass)。
 *
 * 分表映射(镜像 qfai 命名体系): NormriceItemPO(基类) / NormriceItemPO0(@Entity @Table normriceitem, index=0)
 * / NormriceItemPO1(@Entity @Table normriceitem1) ...
 * 🔴 各 PO0/PO1 是并列根实体, 禁止相互/向基类 extends 之外再叠实体继承 ——
 *   子实体继承 @Entity 父类会被 Hibernate 建为 SingleTableSubclass, 启动即 ClassCastException。
 *
 * 分表路由: normtion.index 决定物理表, 见 tableName / factoryToClazz / factoryToInstance。
 */
@MappedSuperclass
public class NormriceItemPO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final short TYPE_OFFER_INT = 0;

	public static final short TYPE_EXPAND_INT = 1;

	public static final short TYPE_ADDCUT_INT = 2;

	public static final short TYPE_QUOTA_INT = 3;

	public static final short NORMTYPE_WORKFEE_INT = 0;

	public static final short NORMTYPE_ADD_INT = 1;

	public static final short ATTTYPE_COLLECTION_INT = 0;

	public static final short ATTTYPE_SUB_INT = 1;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_DISABLED_INT = 1;

	public static final short STATUS_CONFIRMED_INT = 2;

	public static final short STATUS_REJECTED_INT = 3;

	private long npiid;

	private long qid;

	private long sid;

	private long areald;

	private long quoteld;

	private long qiid;

	private long npid;

	private short type;

	private short normtype;

	private short atttype;

	private ConstructionNodePO constructionNode;

	private String name;

	private String unit;

	private int trannum;

	private int salary;

	private int num;

	private short status;

	private String confirmer; // 确认人(userId)

	private Timestamp confirmTime; // 确认时间

	@Id
	@GeneratedValue
	@Column(name = "npiid")
	public long getNpiid() {
		return npiid;
	}

	public void setNpiid(long npiid) {
		this.npiid = npiid;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "areald")
	public long getAreald() {
		return areald;
	}

	public void setAreald(long areald) {
		this.areald = areald;
	}

	@Column(name = "quoteld")
	public long getQuoteld() {
		return quoteld;
	}

	public void setQuoteld(long quoteld) {
		this.quoteld = quoteld;
	}

	@Column(name = "qiid")
	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}

	@Column(name = "npid")
	public long getNpid() {
		return npid;
	}

	public void setNpid(long npid) {
		this.npid = npid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "normtype")
	public short getNormtype() {
		return normtype;
	}

	public void setNormtype(short normtype) {
		this.normtype = normtype;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cnid", referencedColumnName = "cnid")
	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "unit")
	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@Column(name = "trannum")
	public int getTrannum() {
		return trannum;
	}

	public void setTrannum(int trannum) {
		this.trannum = trannum;
	}

	@Column(name = "salary")
	public int getSalary() {
		return salary;
	}

	public void setSalary(int salary) {
		this.salary = salary;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "confirmer")
	public String getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(String confirmer) {
		this.confirmer = confirmer;
	}

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	// 定额明细分表路由(normtion.index 决定): index=0 → normriceitem(原表), >0 → normriceitem{index} 分表
	public static String tableName(int index) {
		return index == 0 ? "normriceitem" : "normriceitem" + index;
	}

	public static Class<? extends NormriceItemPO> factoryToClazz(int index) {
		if (index == 0) {
			return NormriceItemPO0.class;
		}
		try {
			return (Class<? extends NormriceItemPO>) Class.forName("com.fanglin.quotation.po.NormriceItemPO" + index);
		} catch (Exception e) {
			throw new FLException(200138, "定额明细分表实体不存在: normriceitem" + index, e);
		}
	}

	public static NormriceItemPO factoryToInstance(int index) {
		if (index == 0) {
			return new NormriceItemPO0();
		}
		try {
			return (NormriceItemPO) Class.forName("com.fanglin.quotation.po.NormriceItemPO" + index).newInstance();
		} catch (Exception e) {
			throw new FLException(200138, "定额明细分表实体不存在: normriceitem" + index, e);
		}
	}

}
