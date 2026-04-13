package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.communion.vo.CustomerBankVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customer_bank", catalog = "communion")
public class CustomerBankPO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_DEFAULTS_STR = "defaults";

	public static final String COLUMN_BANKNO_STR = "bankno";

	public static final short TYPE_PRIVATE = 0;  // 对私

	public static final short TYPE_PUBLIC = 1;    // 对公

	public static final short STATUS_ENABLE = 0;  // 启用

	public static final short STATUS_DISABLE = 1; // 停用

	public static final short DEFAULTS_NO = 0;    // 非默认

	public static final short DEFAULTS_YES = 1;   // 默认

	private long cbid;

	private long cid;

	private short type;

	private String no;

	private String name;

	private String phone;

	private String address;

	private String bank;

	private String bankno;

	private short status;

	private short defaults;

	private String createTime;

	private String updateTime;

	public CustomerBankPO() {
		super();
	}

	public CustomerBankPO(long cbid) {
		super();
		this.cbid = cbid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cbid")
	public long getCbid() {
		return cbid;
	}

	public void setCbid(long cbid) {
		this.cbid = cbid;
	}

	@Column(name = "cid", nullable = false)
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "type", nullable = false)
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name", nullable = false)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "bank", nullable = false)
	public String getBank() {
		return bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	@Column(name = "bankno", nullable = false)
	public String getBankno() {
		return bankno;
	}

	public void setBankno(String bankno) {
		this.bankno = bankno;
	}

	@Column(name = "status", nullable = false)
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "defaults", nullable = false)
	public short getDefaults() {
		return defaults;
	}

	public void setDefaults(short defaults) {
		this.defaults = defaults;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "updateTime")
	public String getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}

	public CustomerBankVO ptv(CustomerBankVO customerBankVO) {

		BeanUtil.copyPropertie(this, customerBankVO);

		return customerBankVO;
	}

}
