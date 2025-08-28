package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "supplierContractService", catalog = "communion")
public class SupplierContractServicePO implements java.io.Serializable {

	private static final long serialVersionUID = -9073486016937854511L;

	private long scsid;

	private long sid;
	
	private String name;

	private short type;

	private String servicePrice; // 服务费 , Json结构 , {"TL": "2016-01-01", "UV": 0, "DV": 0, "SR": 0}

	public SupplierContractServicePO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "scsid")
	public long getScsid() {
		return scsid;
	}

	public void setScsid(long scsid) {
		this.scsid = scsid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "servicePrice")
	public String getServicePrice() {
		return servicePrice;
	}

	public void setServicePrice(String servicePrice) {
		this.servicePrice = servicePrice;
	}
	
	
	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
