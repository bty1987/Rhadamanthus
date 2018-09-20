package com.fanglin.customer.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.GroupUserDao;
import com.fanglin.customer.po.GroupUserPO;

@Repository("groupUserDao")
public class GroupUserDaoImpl extends DaoImpl<GroupUserPO> implements GroupUserDao{

	public GroupUserDaoImpl(){
		super(GroupUserPO.class);
	}

}
