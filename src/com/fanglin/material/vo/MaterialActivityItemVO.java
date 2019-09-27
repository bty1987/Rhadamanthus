package com.fanglin.material.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class MaterialActivityItemVO implements Serializable {

	private static final long serialVersionUID = -7804245287518487074L;

	private Long maiid;

	private Long aid;
	
	private Long asid;

	private String orderId;

	private String activity;

	private String name;

	private Integer num;

	private Integer money;
	
	private Short state;
	
	private Short isStock;

	private Short type;

	private String content;
	
	private UserBaseVO receiveUserId;
	
	private String receiveUserName;
	
	private Timestamp receiveTime;
	
	public MaterialActivityItemVO(){
		super();
	}

	public Long getMaiid() {
		return maiid;
	}

	public void setMaiid(Long maiid) {
		this.maiid = maiid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getAsid() {
		return asid;
	}

	public void setAsid(Long asid) {
		this.asid = asid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Integer getMoney() {
		return money;
	}

	public void setMoney(Integer money) {
		this.money = money;
	}

	public Short getState() {
		return state;
	}

	public void setState(Short state) {
		this.state = state;
	}

	public Short getIsStock() {
		return isStock;
	}

	public void setIsStock(Short isStock) {
		this.isStock = isStock;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public UserBaseVO getReceiveUserId() {
		return receiveUserId;
	}

	public void setReceiveUserId(UserBaseVO receiveUserId) {
		this.receiveUserId = receiveUserId;
	}

	public String getReceiveUserName() {
		return receiveUserName;
	}

	public void setReceiveUserName(String receiveUserName) {
		this.receiveUserName = receiveUserName;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Timestamp receiveTime) {
		this.receiveTime = receiveTime;
	}

}
