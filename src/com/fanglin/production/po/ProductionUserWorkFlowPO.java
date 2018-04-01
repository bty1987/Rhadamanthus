package com.fanglin.production.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "productionuserworkflow", catalog = "production")
public class ProductionUserWorkFlowPO implements Serializable {

	private static final long serialVersionUID = -7296398551060429237L;

	private long puwfid;

	private ProductionWorkFlowPO productionworkflow;

	private UserPO operator;

	private Timestamp operateTime;

	public ProductionUserWorkFlowPO() {
		super();
	}

	public ProductionUserWorkFlowPO(ProductionWorkFlowPO productionworkflow, UserPO operator) {
		super();
		this.productionworkflow = productionworkflow;
		this.operator = operator;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "puwfid")
	public long getPuwfid() {
		return puwfid;
	}

	public void setPuwfid(long puwfid) {
		this.puwfid = puwfid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pwfid", referencedColumnName = "pwfid")
	public ProductionWorkFlowPO getProductionworkflow() {
		return productionworkflow;
	}

	public void setProductionworkflow(ProductionWorkFlowPO productionworkflow) {
		this.productionworkflow = productionworkflow;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperator() {
		return operator;
	}

	public void setOperator(UserPO operator) {
		this.operator = operator;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

}
