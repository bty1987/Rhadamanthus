package com.fanglin.balance.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ComcostVO  implements	java.io.Serializable {


	private static final long serialVersionUID = -5425335442700282891L;
   
    private Long  cid;
    
    private Short type;
    
    private String orderId;
   
	private Long ident;
    
    private Long money;
    
    private UserBaseVO creater;
    
    private Timestamp createTime;
    
    private Short status;
    
    private String comment;
    
    private Integer company;

    
    @JSON(format = "yyyy-MM-dd")
    public Timestamp getCreateTime() {
  		return createTime;
  	}

  	public void setCreateTime(Timestamp createTime) {
  		this.createTime = createTime;
  	}
    
    
	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}



	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getIdent() {
		return ident;
	}

	public void setIdent(Long ident) {
		this.ident = ident;
	}

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
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

	public ComcostVO() {
		super();
	}

	public ComcostVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}
	
    
    
}
