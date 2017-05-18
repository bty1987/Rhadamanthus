/**
 * Title: UserApprovePO
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: 
 * @author bty1987
 *
 */

package com.fanglin.approval.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "approveUser", catalog = "approval")
public class ApproveUserPO implements Serializable{

    private static final long serialVersionUID = 950904568941125216L;

    private Integer auid;
    
    private UserPO  user;
   
    private Short  type;
    
    public ApproveUserPO(){
        super();
    }
    
    public ApproveUserPO(UserPO user){
        super();
        this.user = user;
    }

    @Id
    @GeneratedValue
    @Column(name = "auid")
    public Integer getAuid(){
        return auid;
    }

    public void setAuid(Integer auid){
        this.auid = auid;
    }

    @javax.persistence.ManyToOne(fetch=FetchType.LAZY)
    @javax.persistence.JoinColumn(nullable=false, name="userId", referencedColumnName="userId")
    public UserPO getUser(){
        return user;
    }

    public void setUser(UserPO user){
        this.user = user;
    }
    
    @Column(name = "type")
    public Short getType(){
        return type;
    }

    public void setType(Short type){
        this.type = type;
    }

}
