package com.fanglin.production.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.personel.vo.UserVO;

public class ProductionUserWorkFlowVO implements Serializable{

	private static final long serialVersionUID = 1063970618132213943L;
	
	private Long puwfid;
	
	private ProductionWorkFlowVO pwfid;
	
	private UserVO ouid;
	
	private Timestamp operateTime;

	public ProductionUserWorkFlowVO() {
		super();

	}

	public ProductionUserWorkFlowVO(ProductionWorkFlowVO pwfid, UserVO ouid) {
		super();
		this.pwfid = pwfid;
		this.ouid = ouid;
	}

	public Long getPuwfid() {
		return puwfid;
	}

	public void setPuwfid(Long puwfid) {
		this.puwfid = puwfid;
	}

	public ProductionWorkFlowVO getPwfid() {
		return pwfid;
	}

	public void setPwfid(ProductionWorkFlowVO pwfid) {
		this.pwfid = pwfid;
	}

	public UserVO getOuid() {
		return ouid;
	}

	public void setOuid(UserVO ouid) {
		this.ouid = ouid;
	}

	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}
	
	

}
