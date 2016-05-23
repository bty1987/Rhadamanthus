/**
 * Title: UserApproveVO
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: YunFeng Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.personel.vo;

import java.io.Serializable;

public class UserApproveVO implements Serializable{

    private static final long serialVersionUID = 7304236208034674601L;

    private Integer approveId;
    
    private UserVO  user;
    
    private String  type;

    public Integer getApproveId(){
        return approveId;
    }

    public void setApproveId(Integer approveId){
        this.approveId = approveId;
    }

    public UserVO getUser(){
        return user;
    }

    public void setUser(UserVO user){
        this.user = user;
    }

    public String getType(){
        return type;
    }

    public void setType(String type){
        this.type = type;
    }

}
