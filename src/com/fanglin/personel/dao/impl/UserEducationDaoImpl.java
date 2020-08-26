/**
 * Title: UserContractDaoImpl
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
import com.fanglin.personel.dao.UserEducationDao;
import com.fanglin.personel.po.UserEducationPO;

@Repository("userEducationDao")
public class UserEducationDaoImpl extends DaoImpl<UserEducationPO> implements UserEducationDao {

	public UserEducationDaoImpl() {
		super(UserEducationPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserEducationPO> queryUserEducation(Long uid) {
		return session().createCriteria(UserEducationPO.class).add(Restrictions.eq("uid", uid)).list();
	}

}
