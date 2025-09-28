package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.vo.SupplierContractCategoryVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "supplierContractCategory", catalog = "communion")
public class SupplierContractCategoryPO implements java.io.Serializable {

	private static final long serialVersionUID = -9073486016937854511L;

	private long sccid;

	private long scbid;

	private String name;

	private short ctype; // 结算类型 , 0: 底价 , 1: 点位

	private String cvalue; // 结算值

	public SupplierContractCategoryPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sccid")
	public long getSccid() {
		return sccid;
	}

	public void setSccid(long sccid) {
		this.sccid = sccid;
	}

	@Column(name = "scbid")
	public long getScbid() {
		return scbid;
	}

	public void setScbid(long scbid) {
		this.scbid = scbid;
	}

	@Column(name = "ctype")
	public short getCtype() {
		return ctype;
	}

	public void setCtype(short ctype) {
		this.ctype = ctype;
	}

	@Column(name = "cvalue")
	public String getCvalue() {
		return cvalue;
	}

	public void setCvalue(String cvalue) {
		this.cvalue = cvalue;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public SupplierContractCategoryVO ptv(SupplierContractCategoryVO supplierContractCategoryVO) {

		BeanUtil.copyPropertie(this, supplierContractCategoryVO, "");

		return supplierContractCategoryVO;
	}
}
