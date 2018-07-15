package com.fanglin.personel.vo;

import java.io.Serializable;

import com.fanglin.data.common.vo.LabelVO;

public class UserLabelVO implements Serializable {

	private static final long serialVersionUID = 5977340486036732834L;
	
	private Long ulid;
	
	private UserBaseVO user;
	
	private LabelVO label;
	
	private String scope;

	public UserLabelVO(){
		super();
	}
	
	public UserLabelVO(UserBaseVO user){
		super();
		this.user = user;
	}

	public UserLabelVO(UserBaseVO user, LabelVO label) {
		super();
		this.user = user;
		this.label = label;
	}

	public Long getUlid() {
		return ulid;
	}

	public void setUlid(Long ulid) {
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

	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}
	
}
