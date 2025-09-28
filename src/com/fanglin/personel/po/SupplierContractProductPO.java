package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.vo.SupplierContractProductVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "suppliercontractproduct", catalog = "communion")
public class SupplierContractProductPO implements java.io.Serializable {

	private static final long serialVersionUID = -9073486016937854510L;

	private long scpid;

	private long scid;

	private String name;

	private String category;

	private String brand;

	private String warranTime; // 质保期

	public SupplierContractProductPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "scpid")
	public long getScpid() {
		return scpid;
	}

	public void setScpid(long scpid) {
		this.scpid = scpid;
	}

	@Column(name = "scid")
	public long getScid() {
		return scid;
	}

	public void setScid(long scid) {
		this.scid = scid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "category")
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Column(name = "brand")
	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	@Column(name = "warranTime")
	public String getWarranTime() {
		return warranTime;
	}

	public void setWarranTime(String warranTime) {
		this.warranTime = warranTime;
	}

	public SupplierContractProductVO ptv(SupplierContractProductVO supplierContractProductVO) {

		BeanUtil.copyPropertie(this, supplierContractProductVO, "");

		return supplierContractProductVO;
	}

}
