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

import com.fanglin.communion.vo.CityProperPartnerVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "cityproperpartner", catalog = "communion")
public class CityProperPartnerPO implements Serializable {

	private static final long serialVersionUID = -2063756086297436936L;

	public static final short STATUS_VALID_INT = 0;

	public static final short STATUS_INVALID_INT = 1;

	public static final short TYPE_BUSI_INT = 0;

	public static final short TYPE_DESIGN_INT = 1;

	public static final short TYPE_SALES_INT = 2;

	public static final short TYPE_ENGIN_INT = 3;

	public static final short TYPE_SERV_INT = 4;

	private long cppid;

	private int cpid;

	private UserPO partner;

	private short type;

	private short status;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "cppid")
	public long getCppid() {
		return cppid;
	}

	public void setCppid(long cppid) {
		this.cppid = cppid;
	}

	@Column(name = "cpid")
	public int getCpid() {
		return cpid;
	}

	public void setCpid(int cpid) {
		this.cpid = cpid;
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

	public CityProperPartnerVO ptv(CityProperPartnerVO cityProperPartnerVO) {

		BeanUtil.copyProperties(this, cityProperPartnerVO, Arrays.asList("partner"));

		if (cityProperPartnerVO.getPartner() != null && getPartner() != null) cityProperPartnerVO.getPartner().setBaseInfo(getPartner());

		return cityProperPartnerVO;
	}
}
