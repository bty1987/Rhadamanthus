package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.core.interceptor.FLException;

import com.fanglin.data.po.ConstructionNodePO;

/**
 * 定额工费明细字段基类(纯字段载体, 零JPA注解 —— 映射注解在各分表实体上, 照qfai正统: QuotationFunctionAreaItemPO基类同为纯类)。
 *
 * 分表实体: NormriceItemPO0(@Entity @Table normriceitem, 原表/index=0) 与 NormriceItemPO1(@Entity @Table normriceitem1, index=1) ...
 * 各实体字段与@Id全重声明, 相互并列根实体, 禁止实体间extends(启动SingleTableSubclass炸已实证)。
 *
 * 分表路由: normtion.index 决定物理表, 见 tableName / factoryToClazz / factoryToInstance。
 */
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

	public long getNpiid() {
		return npiid;
	}

	public void setNpiid(long npiid) {
		this.npiid = npiid;
	}

	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	public long getAreald() {
		return areald;
	}

	public void setAreald(long areald) {
		this.areald = areald;
	}

	public long getQuoteld() {
		return quoteld;
	}

	public void setQuoteld(long quoteld) {
		this.quoteld = quoteld;
	}

	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}

	public long getNpid() {
		return npid;
	}

	public void setNpid(long npid) {
		this.npid = npid;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public short getNormtype() {
		return normtype;
	}

	public void setNormtype(short normtype) {
		this.normtype = normtype;
	}

	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public int getTrannum() {
		return trannum;
	}

	public void setTrannum(int trannum) {
		this.trannum = trannum;
	}

	public int getSalary() {
		return salary;
	}

	public void setSalary(int salary) {
		this.salary = salary;
	}

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

	public String getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(String confirmer) {
		this.confirmer = confirmer;
	}

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

	public static Class<?> factoryToClazz(int index) {
		if (index == 0) {
			return NormriceItemPO0.class;
		}
		try {
			return Class.forName("com.fanglin.quotation.po.NormriceItemPO" + index);
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
