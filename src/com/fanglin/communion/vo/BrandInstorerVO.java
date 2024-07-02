package com.fanglin.communion.vo;

import com.fanglin.personel.vo.UserVO;

public class BrandInstorerVO implements java.io.Serializable {

	private static final long serialVersionUID = 2256407770063106295L;

	private Long biid;

	private UserVO instorer;

	private BrandVO brand;

	private String agentName;

	private String agentPhone;

	public BrandInstorerVO() {
		super();
	}

	public BrandInstorerVO(UserVO instorer, BrandVO brand) {
		super();
		this.instorer = instorer;
		this.brand = brand;
	}

	public Long getBiid() {
		return biid;
	}

	public void setBiid(Long biid) {
		this.biid = biid;
	}

	public UserVO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserVO instorer) {
		this.instorer = instorer;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
		this.brand = brand;
	}

	public String getAgentName() {
		return agentName;
	}

	public void setAgentName(String agentName) {
		this.agentName = agentName;
	}

	public String getAgentPhone() {
		return agentPhone;
	}

	public void setAgentPhone(String agentPhone) {
		this.agentPhone = agentPhone;
	}

}