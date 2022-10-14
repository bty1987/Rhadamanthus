package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "paymentType", catalog = "data")
public class PaymentTypePO implements java.io.Serializable {

	private static final long serialVersionUID = 1075827583513157078L;

	public static final String COLUMN_PTID_STR = "ptid";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_PAYTYPE_STR = "paytype";

	public static final String COLUMN_BUSTYPE_STR = "bustype";

	public static final String COLUMN_ATTTYPE_STR = "atttype";

	public static final String COLUMN_KINAME_STR = "kiname";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long ptid;

	private String name;

	private short type;

	private short paytype;

	private short bustype;

	private short atttype;

	private int payScale;

	private int saleScale;

	private int code;

	private short taxrate;

	private String kino;

	private String kiname;

	private String kibalance;

	private String billType;

	private short status;

	private int company;

	public PaymentTypePO() {
		super();
	}

	public PaymentTypePO(long ptid) {
		super();
		this.ptid = ptid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ptid")
	public long getPtid() {
		return ptid;
	}

	public void setPtid(long ptid) {
		this.ptid = ptid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "paytype")
	public short getPaytype() {
		return paytype;
	}

	public void setPaytype(short paytype) {
		this.paytype = paytype;
	}

	@Column(name = "bustype")
	public short getBustype() {
		return bustype;
	}

	public void setBustype(short bustype) {
		this.bustype = bustype;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "payScale")
	public int getPayScale() {
		return payScale;
	}

	public void setPayScale(int payScale) {
		this.payScale = payScale;
	}

	@Column(name = "saleScale")
	public int getSaleScale() {
		return saleScale;
	}

	public void setSaleScale(int saleScale) {
		this.saleScale = saleScale;
	}

	@Column(name = "code")
	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	@Column(name = "taxrate")
	public short getTaxrate() {
		return taxrate;
	}

	public void setTaxrate(short taxrate) {
		this.taxrate = taxrate;
	}

	@Column(name = "kino")
	public String getKino() {
		return kino;
	}

	public void setKino(String kino) {
		this.kino = kino;
	}

	@Column(name = "kiname")
	public String getKiname() {
		return kiname;
	}

	public void setKiname(String kiname) {
		this.kiname = kiname;
	}

	@Column(name = "kibalance")
	public String getKibalance() {
		return kibalance;
	}

	public void setKibalance(String kibalance) {
		this.kibalance = kibalance;
	}

	@Column(name = "billType")
	public String getBillType() {
		return billType;
	}

	public void setBillType(String billType) {
		this.billType = billType;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}