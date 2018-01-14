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

import com.fanglin.personel.vo.UserBaseVO;

public class ApproverVO implements Serializable{

    private static final long serialVersionUID = 7304236208034674601L;

    private Integer auid;
    
    private UserBaseVO  userBase;
    
    private Short  type;

    private String comment;
    
	public ApproverVO() {
		super();
	}

	public ApproverVO(UserBaseVO userBase) {
		super();
		this.userBase = userBase;
	}

	public Integer getAuid(){
        return auid;
    }

    public void setAuid(Integer auid){
        this.auid = auid;
    }


    public UserBaseVO getUserBase() {
		return userBase;
	}

	public void setUserBase(UserBaseVO userBase) {
		this.userBase = userBase;
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
