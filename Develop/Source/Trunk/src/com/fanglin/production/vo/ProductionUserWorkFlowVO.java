package com.fanglin.production.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class ProductionUserWorkFlowVO implements Serializable{

	private static final long serialVersionUID = 1063970618132213943L;
	
	private Long puwfid;
	
	private ProductionWorkFlowVO productionworkflow;
	
	private UserVO operator;
	
	private Timestamp operateTime;

	public ProductionUserWorkFlowVO() {
		super();
	}

	public ProductionUserWorkFlowVO(ProductionWorkFlowVO productionworkflow,
			UserVO operator) {
		super();
		this.productionworkflow = productionworkflow;
		this.operator = operator;
	}

	public Long getPuwfid() {
		return puwfid;
	}

	public void setPuwfid(Long puwfid) {
		this.puwfid = puwfid;
	}

	public ProductionWorkFlowVO getProductionworkflow() {
		return productionworkflow;
	}

	public void setProductionworkflow(ProductionWorkFlowVO productionworkflow) {
		this.productionworkflow = productionworkflow;
	}

	public UserVO getOperator() {
		return operator;
	}

	public void setOperator(UserVO operator) {
		this.operator = operator;
	}
	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}
	
	


	
	

}
