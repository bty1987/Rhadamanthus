package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import org.apache.struts2.json.annotations.JSON;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.personel.vo.UserVO;

public class ServicePaymentVO   implements Serializable{

	private static final long serialVersionUID = -2013773082913342258L;

	private Long spid;
	
	private DecorationOrderVO decorationOrder;
	
	private Short type; 
	
	private Integer pid;
	
	private Short status;
	
	private UserVO creater;
	
	private UserVO collecter;
	
	private UserVO confirmer;
	
	private String createrName;           
	
	private String collecterName;         
	
	private String confirmerName;         
	
	private Timestamp createTime;
	
	private Timestamp collcetTime;
	
	private Timestamp confirmTime;
	
	private Float serviceMoney;
	
	private Float advanceMoney;
	
	private String des;
	
	private Float referMoney;
	
	private ServiceReceiptVO serviceReceipt;
	
	public ServicePaymentVO() {
		super();
	}
	
	public ServicePaymentVO(UserVO creater,DecorationOrderVO decorationOrder) {
		super();
		this.creater = creater;
		this.decorationOrder = decorationOrder;
	}
	
	public ServicePaymentVO(UserVO creater,UserVO collecter,UserVO confirmer,DecorationOrderVO decorationOrder,ServiceReceiptVO serviceReceipt) {
		super();
		this.creater = creater;
		this.collecter = collecter;
		this.confirmer = confirmer;
		this.decorationOrder = decorationOrder;
		this.serviceReceipt = serviceReceipt;
	}
	
	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
	}

	public DecorationOrderVO getDecorationOrder() {
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderVO decorationOrder) {
		this.decorationOrder = decorationOrder;
	}
	
	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getPid() {
		return pid;
	}

	public void setPid(Integer pid) {
		this.pid = pid;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public UserVO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserVO collecter) {
		this.collecter = collecter;
	}

	public UserVO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserVO confirmer) {
		this.confirmer = confirmer;
	}

	public String getCreaterName() {
		return createrName;
	}

	public void setCreaterName(String createrName) {
		this.createrName = createrName;
	}

	public String getCollecterName() {
		return collecterName;
	}

	public void setCollecterName(String collecterName) {
		this.collecterName = collecterName;
	}

	public String getConfirmerName() {
		return confirmerName;
	}

	public void setConfirmerName(String confirmerName) {
		this.confirmerName = confirmerName;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCollcetTime() {
		return collcetTime;
	}

	public void setCollcetTime(Timestamp collcetTime) {
		this.collcetTime = collcetTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	public Float getServiceMoney() {
		return serviceMoney;
	}

	public void setServiceMoney(Float serviceMoney) {
		this.serviceMoney = serviceMoney;
	}

	public Float getAdvanceMoney() {
		return advanceMoney;
	}

	public void setAdvanceMoney(Float advanceMoney) {
		this.advanceMoney = advanceMoney;
	}

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

	public Float getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Float referMoney) {
		this.referMoney = referMoney;
	}
	
	public ServiceReceiptVO getServiceReceipt() {
		return serviceReceipt;
	}

	public void setServiceReceipt(ServiceReceiptVO serviceReceipt) {
		this.serviceReceipt = serviceReceipt;
	}
	
}
