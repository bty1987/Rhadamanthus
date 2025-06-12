package com.fanglin.communion.po;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.vo.DepartmentPartnerVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "departmentpartner", catalog = "communion")
public class DepartmentPartnerPO implements Serializable {

	private static final long serialVersionUID = -8788538581247592643L;

	public static final short STATUS_VALID_INT = 0;

	public static final short STATUS_INVALID_INT = 1;

	public static final short TYPE_BUSI_INT = 0;

	public static final short TYPE_DECO_INT = 1;

	public static final short TYPE_SALES_INT = 2;

	public static final short TYPE_CONT_INT = 3;

	private long dpid;

	private int did;

	private UserPO partner;

	private short type;

	private short status;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "dpid")
	public long getDpid() {
		return dpid;
	}

	public void setDpid(long dpid) {
		this.dpid = dpid;
	}

	@Column(name = "did")
	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "puid", referencedColumnName = "uid")
	public UserPO getPartner() {
		return partner;
	}

	public void setPartner(UserPO partner) {
		this.partner = partner;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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

	public DepartmentPartnerVO ptv(DepartmentPartnerVO departmentPartnerVO) {

		BeanUtil.copyProperties(this, departmentPartnerVO, Arrays.asList("partner"));

		if (departmentPartnerVO.getPartner() != null && getPartner() != null) departmentPartnerVO.getPartner().setBaseInfo(getPartner());

		return departmentPartnerVO;
	}
}
