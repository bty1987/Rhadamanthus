package com.fanglin.decoration.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserBaseVO;

public class DecorationUserVO implements Serializable {

	private static final long serialVersionUID = 7968648685999434039L;

	private Long duid;

	private String orderId;

	private UserBaseVO user;

	private Short isShow;

	private Short isPay;

	private Short type;

	private String content;

	public DecorationUserVO() {
		super();
	}

	public DecorationUserVO(UserBaseVO user) {
		super();
		this.user = user;
	}

	public Long getDuid() {
		return duid;
	}

	public void setDuid(Long duid) {
		this.duid = duid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public Short getIsShow() {
		return isShow;
	}

	public void setIsShow(Short isShow) {
		this.isShow = isShow;
	}

	public Short getIsPay() {
		return isPay;
	}

	public void setIsPay(Short isPay) {
		this.isPay = isPay;
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

}
