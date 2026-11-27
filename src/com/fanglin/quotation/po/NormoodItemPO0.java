package com.fanglin.quotation.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.NoodsPO;
import java.io.Serializable;

/**
 * 定额材料明细实体(NormoodItemPO0, 分表路由 index=0)。
 * 结构照 qfai 正统: extends 字段基类 NormoodItemPO(纯类), 字段与@Id全重声明 —— 各实体独立根实体。
 */
@Entity
@Table(name = "normooditem0", catalog = "quotation")
public class NormoodItemPO0 extends NormoodItemPO implements Serializable {

	private static final long serialVersionUID = -1495497405192428115L;

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