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
@Table(name="productionuserworkflow",catalog= "production")
public class ProductionUserWorkFlowPO implements Serializable{

	private static final long serialVersionUID = -7296398551060429237L;
	
	private long puwfid;
	
	private ProductionWorkFlowPO pwfid;
	
	private UserPO ouid;
	
	private Timestamp operateTime;

	public ProductionUserWorkFlowPO() {
		super();
	}

	public ProductionUserWorkFlowPO(ProductionWorkFlowPO pwfid, UserPO ouid) {
		super();
		this.pwfid = pwfid;
		this.ouid = ouid;
	}
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="puwfid")
	public long getPuwfid() {
		return puwfid;
	}

	public void setPuwfid(long puwfid) {
		this.puwfid = puwfid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pwfid", referencedColumnName = "pwfid")
	public ProductionWorkFlowPO getPwfid() {
		return pwfid;
	}

	public void setPwfid(ProductionWorkFlowPO pwfid) {
		this.pwfid = pwfid;
	}
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOuid() {
		return ouid;
	}

	public void setOuid(UserPO ouid) {
		this.ouid = ouid;
	}
	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}
	
	
	

}
