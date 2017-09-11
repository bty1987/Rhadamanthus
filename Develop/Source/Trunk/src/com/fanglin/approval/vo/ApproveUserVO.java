/**
 * Title: UserApproveVO
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: 
 * @author bty1987
 *
 */

package com.fanglin.approval.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserVO;

public class ApproveUserVO implements Serializable{

    private static final long serialVersionUID = 7304236208034674601L;

    private Integer auid;
    
    private UserVO  user;
    
    private Short  type;

    private String comment;
    
	public ApproveUserVO() {
		super();
	}

	public ApproveUserVO(UserVO user) {
		super();
		this.user = user;
	}

	public Integer getAuid(){
        return auid;
    }

    public void setAuid(Integer auid){
        this.auid = auid;
    }

    public UserVO getUser(){
        return user;
    }

    public void setUser(UserVO user){
        this.user = user;
    }

    public Short getType(){
        return type;
    }

    public void setType(Short type){
        this.type = type;
    }

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
