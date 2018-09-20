/**
 * Title: UserExprienceDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserExperienceDao;
import com.fanglin.personel.po.UserExperiencePO;

@Repository("userExperienceDao")
public class UserExperienceDaoImpl extends DaoImpl<UserExperiencePO> implements UserExperienceDao {
	
	public UserExperienceDaoImpl(){
		super(UserExperiencePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserExperiencePO> queryUserExperiencesByUid(Integer uid){
		return session().createCriteria(UserExperiencePO.class).add(Restrictions.eq("uid", uid)).list();
	}

}
