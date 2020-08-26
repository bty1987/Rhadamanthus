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
import com.fanglin.personel.dao.UserOperationDao;
import com.fanglin.personel.po.UserOperationPO;

@Repository("userOperationDao")
public class UserOperationDaoImpl extends DaoImpl<UserOperationPO> implements UserOperationDao {

	public UserOperationDaoImpl() {
		super(UserOperationPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserOperationPO> queryUserOperation(Long uid) {
		return session().createCriteria(UserOperationPO.class).add(Restrictions.eq("uid", uid)).list();
	}

}
