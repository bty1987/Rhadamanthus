package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fanglin.core.interceptor.FLException;

import com.fanglin.data.po.NoodsPO;

/**
 * 定额材料明细字段基类(@MappedSuperclass)。
 *
 * 分表映射(镜像 qfai 命名体系): NormoodItemPO(基类) / NormoodItemPO0(@Entity @Table normooditem, index=0)
 * / NormoodItemPO1(@Entity @Table normooditem1) ...
 * 🔴 各 PO0/PO1 是并列根实体, 禁止相互/向基类 extends 之外再叠实体继承 ——
 *   子实体继承 @Entity 父类会被 Hibernate 建为 SingleTableSubclass, 启动即 ClassCastException。
 *
 * 分表路由: normtion.index 决定物理表, 见 tableName / factoryToClazz / factoryToInstance。
 */
@MappedSuperclass
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

	@Id
	@GeneratedValue
	@Column(name = "ngiid")
	public long getNgiid() {
		return ngiid;
	}

	public void setNgiid(long ngiid) {
		this.ngiid = ngiid;
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

	@Column(name = "ngid")
	public long getNgid() {
		return ngid;
	}

	public void setNgid(long ngid) {
		this.ngid = ngid;
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
	@JoinColumn(name = "nid", referencedColumnName = "nid")
	public NoodsPO getNoods() {
		return noods;
	}

	public void setNoods(NoodsPO noods) {
		this.noods = noods;
	}

	@Column(name = "normunit")
	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	@Column(name = "normnum")
	public int getNormnum() {
		return normnum;
	}

	public void setNormnum(int normnum) {
		this.normnum = normnum;
	}

	@Column(name = "storeunit")
	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	@Column(name = "storenum")
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

	public static Class<? extends NormoodItemPO> factoryToClazz(int index) {
		if (index == 0) {
			return NormoodItemPO0.class;
		}
		try {
			return (Class<? extends NormoodItemPO>) Class.forName("com.fanglin.quotation.po.NormoodItemPO" + index);
		} catch (Exception e) {
			throw new FLException(200138, "定额明细分表实体不存在: normooditem" + index, e);
		}
	}

	public static NormoodItemPO factoryToInstance(int index) {
		if (index == 0) {
			return new NormoodItemPO0();
		}
		try {
			return (NormoodItemPO) Class.forName("com.fanglin.quotation.po.NormoodItemPO" + index).newInstance();
		} catch (Exception e) {
			throw new FLException(200138, "定额明细分表实体不存在: normooditem" + index, e);
		}
	}

}
