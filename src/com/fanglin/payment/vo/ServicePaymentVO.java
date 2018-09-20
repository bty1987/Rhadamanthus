package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import org.apache.struts2.json.annotations.JSON;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class ServicePaymentVO   implements Serializable{

	private static final long serialVersionUID = -2013773082913342258L;

	private Long spid;
	
	private ServiceReceiptVO serviceReceipt;
	
	private DecorationVO decoration;
	
	private Integer pid;
	
	private Short type; 
	
	private Short status;
	
	private UserBaseVO creater;
	
	private UserBaseVO collecter;
	
	private UserBaseVO confirmer;
	
	private String createrName;           
	
	private String collecterName;         
	
	private String confirmerName;         
	
	private Timestamp createTime;
	
	private Timestamp collcetTime;
	
	private Timestamp confirmTime;
	
	private Float serviceMoney;
	
	private Float advanceMoney;
	
	private Float referMoney;
	
	private String comment;
	
	private Integer company;
	
	public ServicePaymentVO() {
		super();
	}
	
	public ServicePaymentVO(UserBaseVO creater,DecorationVO decoration) {
		super();
		this.creater = creater;
		this.decoration = decoration;
	}
	
	public ServicePaymentVO(UserBaseVO creater,UserBaseVO collecter,UserBaseVO confirmer,DecorationVO decoration,ServiceReceiptVO serviceReceipt) {
		super();
		this.creater = creater;
		this.collecter = collecter;
		this.confirmer = confirmer;
		this.decoration = decoration;
		this.serviceReceipt = serviceReceipt;
	}
	
	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
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

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserBaseVO collecter) {
		this.collecter = collecter;
	}

	public UserBaseVO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserBaseVO confirmer) {
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollcetTime() {
		return collcetTime;
	}

	public void setCollcetTime(Timestamp collcetTime) {
		this.collcetTime = collcetTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
}
