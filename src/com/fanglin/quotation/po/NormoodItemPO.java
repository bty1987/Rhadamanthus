package com.fanglin.quotation.po;

import java.io.Serializable;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.NoodsPO;

/**
 * 定额材料明细字段基类(纯字段载体, 零JPA注解 —— 映射注解在各分表实体上, 照qfai正统: QuotationFunctionAreaItemPO基类同为纯类)。
 * 
 * 分表实体: NormoodItemPO0(@Entity @Table normooditem, 原表/index=0) 与 NormoodItemPO1(@Entity @Table normooditem1, index=1) ... 各实体字段与@Id全重声明, 相互并列根实体, 禁止实体间extends(启动SingleTableSubclass炸已实证)。
 * 
 * 分表路由: normtion.index 决定物理表, 见 tableName / factoryToClazz / factoryToInstance。
 */
public class NormoodItemPO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final short TYPE_OFFER_INT = 0;

	public static final short TYPE_EXPAND_INT = 1;

	public static final short TYPE_ADDCUT_INT = 2;

	public static final short TYPE_QUOTA_INT = 3;

	public static final short NORMTYPE_MATERIAL_INT = 0;

	public static final short NORMTYPE_PACK_INT = 1;

	public static final short ATTTYPE_COLLECTION_INT = 0;

	public static final short ATTTYPE_SUB_INT = 1;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_DISABLED_INT = 1;

	private long ngiid;

	private long qid;

	private long sid;

	private long areald;

	private long quoteld;

	private long qiid;

	private long ngid;

	private short type;

	private short normtype;

	private short atttype;

	private NoodsPO noods;

	private String normunit;

	private int normnum;

	private String storeunit;

	private int storenum;

	private short status;

	public long getNgiid() {
		return ngiid;
	}

	public void setNgiid(long ngiid) {
		this.ngiid = ngiid;
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

	public long getNgid() {
		return ngid;
	}

	public void setNgid(long ngid) {
		this.ngid = ngid;
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

	public NoodsPO getNoods() {
		return noods;
	}

	public void setNoods(NoodsPO noods) {
		this.noods = noods;
	}

	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	public int getNormnum() {
		return normnum;
	}

	public void setNormnum(int normnum) {
		this.normnum = normnum;
	}

	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	public int getStorenum() {
		return storenum;
	}

	public void setStorenum(int storenum) {
		this.storenum = storenum;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	// 定额明细分表路由(normtion.index 决定): index=0 → normooditem(原表), >0 → normooditem{index} 分表
	public static String tableName(int index) {
		return index == 0 ? "normooditem" : "normooditem" + index;
	}

	public static Class<?> factoryToClazz(int index) {

		if (index == 0) {
			return NormoodItemPO0.class;
		}

		try {
			return Class.forName("com.fanglin.quotation.po.NormoodItemPO" + index);
		} catch (Exception e) {
			throw new FLException(200138, "定额项存储对象错误");
		}
	}

	public static NormoodItemPO factoryToInstance(int index) {

		if (index == 0) {
			return new NormoodItemPO0();
		}

		try {
			return (NormoodItemPO) Class.forName("com.fanglin.quotation.po.NormoodItemPO" + index).newInstance();
		} catch (Exception e) {
			throw new FLException(200138, "定额项存储对象错误");
		}
	}

}
