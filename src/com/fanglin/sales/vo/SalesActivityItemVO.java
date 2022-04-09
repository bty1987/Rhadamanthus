package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class SalesActivityItemVO implements Serializable {

	private static final long serialVersionUID = 3217804252527696357L;

	private Long saiid;

	private Long aid;

	private Long asid;

	private String orderId;

	private String activity;

	private String name;

	private Integer num;

	private Integer money;

	private Short state;

	private Short isAffirm;

	private Short isStock;

	private Short type;

	private String content;

	private UserBaseVO creater;

	private Timestamp createTime;

	private UserBaseVO operater;

	private Timestamp operateTime;

	private Integer integral;

	public SalesActivityItemVO(){
		super();
	}

	public Long getSaiid() {
		return saiid;
	}

	public void setSaiid(Long saiid) {
		this.saiid = saiid;
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

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public Integer getIntegral() {
		return integral;
	}

	public void setIntegral(Integer integral) {
		this.integral = integral;
	}

	public Short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(Short isAffirm) {
		this.isAffirm = isAffirm;
	}
	
}
