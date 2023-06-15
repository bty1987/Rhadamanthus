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
import com.fanglin.personel.dao.UserContractDao;
import com.fanglin.personel.po.UserContractPO;

@Repository("userContractDao")
public class UserContractDaoImpl extends DaoImpl<UserContractPO> implements UserContractDao {

	public UserContractDaoImpl() {
		super(UserContractPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserContractPO> queryUserContract(Integer uid) {
		return session().createCriteria(UserContractPO.class).add(Restrictions.eq("uid", uid)).list();
	}

}
