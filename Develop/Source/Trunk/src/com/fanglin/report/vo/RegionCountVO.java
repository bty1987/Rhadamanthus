package com.fanglin.report.vo;

import com.fanglin.system.vo.RegionVO;

public class RegionCountVO implements java.io.Serializable {

	private static final long serialVersionUID = 3683931898065821333L;

	private Long rcId;
	
	private RegionVO region;
	
	private Integer newOrderNum;
	
	private Integer signOrderNum;

	public RegionCountVO() {
		super();
	}

	public RegionCountVO(RegionVO region) {
		super();
		this.region = region;
	}

	public Long getRcId() {
		return rcId;
	}

	public void setRcId(Long rcId) {
		this.rcId = rcId;
	}

	public RegionVO getRegion() {
		return region;
	}

	public void setRegion(RegionVO region) {
		this.region = region;
	}

	public Integer getNewOrderNum() {
		return newOrderNum;
	}

	public void setNewOrderNum(Integer newOrderNum) {
		this.newOrderNum = newOrderNum;
	}

	public Integer getSignOrderNum() {
		return signOrderNum;
	}

	public void setSignOrderNum(Integer signOrderNum) {
		this.signOrderNum = signOrderNum;
	}

}