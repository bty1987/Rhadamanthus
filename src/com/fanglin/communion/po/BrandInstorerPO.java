package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

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
@Table(name = "brandInstorer", catalog = "communion")
public class BrandInstorerPO implements Serializable {

	private static final long serialVersionUID = -7208765021675938693L;

	public static final String COLUMN_BID_STR = "brand.bid";

	public static final String COLUMN_IUID_STR = "instorer.uid";

	private long biid;

	private UserPO instorer;

	private BrandPO brand;

	private String agentName;

	private String agentPhone;

	public BrandInstorerPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "biid")
	public long getBiid() {
		return biid;
	}

	public void setBiid(long biid) {
		this.biid = biid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "iuid", referencedColumnName = "uid")
	public UserPO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserPO instorer) {
		this.instorer = instorer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	@Column(name = "agentName")
	public String getAgentName() {
		return agentName;
	}

	public void setAgentName(String agentName) {
		this.agentName = agentName;
	}

	@Column(name = "agentPhone")
	public String getAgentPhone() {
		return agentPhone;
	}

	public void setAgentPhone(String agentPhone) {
		this.agentPhone = agentPhone;
	}

}
