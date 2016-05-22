/**
 * Title: UserContractDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.personel.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserContractDao;
import com.fanglin.personel.po.UserContractPO;
import com.fanglin.utils.Paging;

@Repository("userContractDao")
public class UserContractDaoImpl extends DaoImpl<UserContractPO> implements UserContractDao {
	
	public UserContractDaoImpl(){
		super(UserContractPO.class);
	}

	@Override
	public List<UserContractPO> pageUserContractByUserId(Paging paging, String userId){
		PagingQuery<UserContractPO> query = pagingQuery(paging, UserContractPO.class);
		
		if(StringUtils.isNotEmpty(userId)){
			query.add(Restrictions.eq("userId", userId));
		}
		
		query.desc("createTime");
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserContractPO> queryUserContractByUserId(String userId){
		return session().createCriteria(UserContractPO.class).add(Restrictions.eq("userId", userId)).list();
	}
}
