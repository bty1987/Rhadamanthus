package com.fanglin.customer.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "customerdeptrule", catalog = "customer")
public class CustomerDeptRulePO implements Serializable {

	private static final long serialVersionUID = -8946288827140055077L;

	private long cdrid;

	private long did;

	private short type;

	private short atttype;

	private long busitype;

	private UserPO creater;

	private Timestamp createTime;

	private int company;

	public CustomerDeptRulePO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "cdrid")
	public long getCdrid() {
		return cdrid;
	}

	public void setCdrid(long cdrid) {
		this.cdrid = cdrid;
	}

	@Column(name = "did")
	public long getDid() {
		return did;
	}

	public void setDid(long did) {
		this.did = did;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "busitype")
	public long getBusitype() {
		return busitype;
	}

	public void setBusitype(long busitype) {
		this.busitype = busitype;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
