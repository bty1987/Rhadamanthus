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

    public static final String COLUMN_TYPE_STR = "type";
    
    private int auid;
    
    private UserPO  user;
   
    private short  type;
    
    private String comment;
    
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
    public int getAuid(){
        return auid;
    }

    public void setAuid(int auid){
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
    public short getType(){
        return type;
    }

    public void setType(short type){
        this.type = type;
    }

    @Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
