package com.fanglin.data.common.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserBaseVO;

public class UserlabelVO implements Serializable {

	private static final long serialVersionUID = 5977340486036732834L;
	
	private int ulid;
	
	private UserBaseVO user;
	
	private LabelVO label;
	
	private String value;

	public UserlabelVO(){
		super();
	}
	
	public UserlabelVO(UserBaseVO user){
		super();
		this.user = user;
	}

	public UserlabelVO(UserBaseVO user, LabelVO label) {
		super();
		this.user = user;
		this.label = label;
	}

	public int getUlid() {
		return ulid;
	}

	public void setUlid(int ulid) {
		this.ulid = ulid;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public LabelVO getLabel() {
		return label;
	}

	public void setLabel(LabelVO label) {
		this.label = label;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
}
