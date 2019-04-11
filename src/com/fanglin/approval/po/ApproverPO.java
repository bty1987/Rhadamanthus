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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "approver", catalog = "approval")
public class ApproverPO implements Serializable{

    private static final long serialVersionUID = 950904568941125216L;

    public static final String COLUMN_TYPE_STR = "type";
    
	private long aid;
    
    private UserPO  user;
   
    private short  type;
    
    private String comment;
    
    public ApproverPO(){
        super();
    }
    
    public ApproverPO(UserPO user){
        super();
        this.user = user;
    }

    @Id
    @GeneratedValue
    @Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(nullable=false, name="auid", referencedColumnName="uid")
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
