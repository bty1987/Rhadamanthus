package com.fanglin.personel.po;

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

import com.fanglin.personel.vo.UserPartnerVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "userpartner", catalog = "communion")
public class UserPartnerPO implements Serializable {

	private static final long serialVersionUID = -555155618470980611L;

	public static final short STATUS_VALID_INT = 0;

	public static final short STATUS_INVALID_INT = 1;

	public static final short TYPE_BUSI_INT = 0;

	public static final short TYPE_DECO_INT = 1;

	public static final short TYPE_SALES_INT = 2;

	public static final short TYPE_CONT_INT = 3;

	private long upid;

	private int uid;

	private UserPO partner;

	private short type;

	private short status;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "upid")
	public long getUpid() {
		return upid;
	}

	public void setUpid(long upid) {
		this.upid = upid;
	}

	@Column(name = "uid")
	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
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

	public UserPartnerVO ptv(UserPartnerVO userPartnerVO) {

		BeanUtil.copyProperties(this, userPartnerVO, Arrays.asList("partner"));

		if (userPartnerVO.getPartner() != null && getPartner() != null) userPartnerVO.getPartner().setBaseInfo(getPartner());

		return userPartnerVO;
	}
}
