package com.fanglin.decoration.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserBaseVO;

public class DecorationUserVO implements Serializable{

	private static final long serialVersionUID = 7968648685999434039L;
	
	private Long duid;
	
	private String orderId;
	
	private UserBaseVO user;
	
	private String content;
	
	public DecorationUserVO(){
		super();
	}
	
	public DecorationUserVO(UserBaseVO user){
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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
}
