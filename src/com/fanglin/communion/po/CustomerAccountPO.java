package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.communion.vo.CustomerAccountVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customeraccount", catalog = "communion")
public class CustomerAccountPO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_DEFAULTS_STR = "defaults";

	public static final String COLUMN_BANKNO_STR = "bankno";

	public static final String COLUMN_CONTENTHASH_STR = "contentHash";

	public static final short TYPE_PRIVATE = 0;  // 对私

	public static final short TYPE_PUBLIC = 1;    // 对公

	public static final short STATUS_ENABLE = 0;  // 启用

	public static final short STATUS_DISABLE = 1; // 停用

	public static final short DEFAULTS_NO = 0;    // 非默认

	public static final short DEFAULTS_YES = 1;   // 默认

	private long caid;

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

	private String contentHash;

	public CustomerAccountPO() {
		super();
	}

	public CustomerAccountPO(long caid) {
		super();
		this.caid = caid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "caid")
	public long getCaid() {
		return caid;
	}

	public void setCaid(long caid) {
		this.caid = caid;
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

	@Column(name = "contentHash", length = 32)
	public String getContentHash() {
		return contentHash;
	}

	public void setContentHash(String contentHash) {
		this.contentHash = contentHash;
	}

	/**
	 * 根据6个业务字段计算 MD5 摘要
	 */
	public static String computeContentHash(String no, String name, String address, String phone, String bank, String bankno) {

		StringBuilder sb = new StringBuilder();
		sb.append(no != null ? no : "").append('|');
		sb.append(name != null ? name : "").append('|');
		sb.append(address != null ? address : "").append('|');
		sb.append(phone != null ? phone : "").append('|');
		sb.append(bank != null ? bank : "").append('|');
		sb.append(bankno != null ? bankno : "");

		return com.fanglin.core.security.MD5Helper.MD5(sb.toString());
	}

	public CustomerAccountVO ptv(CustomerAccountVO customerAccountVO) {

		BeanUtil.copyPropertie(this, customerAccountVO);

		return customerAccountVO;
	}

}
