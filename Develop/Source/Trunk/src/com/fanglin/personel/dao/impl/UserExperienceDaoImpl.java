/**
 * Title: UserExprienceDaoImpl
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
import com.fanglin.personel.dao.UserExperienceDao;
import com.fanglin.personel.po.UserExperiencePO;
import com.fanglin.utils.Paging;

@Repository("userExperienceDao")
public class UserExperienceDaoImpl extends DaoImpl<UserExperiencePO> implements UserExperienceDao {
	
	public UserExperienceDaoImpl(){
		super(UserExperiencePO.class);
	}

	@Override
	public List<UserExperiencePO> pageUserExperiencesByUserId(Paging paging, String userId){
		PagingQuery<UserExperiencePO> query = pagingQuery(paging, UserExperiencePO.class);
		
		if(StringUtils.isNotEmpty(userId)){
			query.add(Restrictions.eq("userId", userId));
		}
		
		query.desc("createTime");
		
		return query.list();
	}

}
