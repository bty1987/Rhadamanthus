/**
 * Title: UserApprovePO
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: 
 * @author bty1987
 *
 */

package com.fanglin.personel.po;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "userApprove", catalog = "platform")
public class UserApprovePO implements Serializable{

    private static final long serialVersionUID = 950904568941125216L;

    private Integer approveId;
    
    private UserPO  user;
   
    private String  type;
    
    public UserApprovePO(){
        super();
    }

    @Id
    @GeneratedValue
    public Integer getApproveId(){
        return approveId;
    }

    public void setApproveId(Integer approveId){
        this.approveId = approveId;
    }

    @javax.persistence.ManyToOne(fetch=FetchType.LAZY)
    @javax.persistence.JoinColumn(nullable=false, name="userId", referencedColumnName="userId")
    public UserPO getUser(){
        return user;
    }

    public void setUser(UserPO user){
        this.user = user;
    }

    public String getType(){
        return type;
    }

    public void setType(String type){
        this.type = type;
    }

}
