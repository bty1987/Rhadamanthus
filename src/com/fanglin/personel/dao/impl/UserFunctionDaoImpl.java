package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserFunctionDao;
import com.fanglin.personel.po.UserFunctionPO;

@Repository("userFunctionDao")
public class UserFunctionDaoImpl extends DaoImpl<UserFunctionPO> implements UserFunctionDao {

	public UserFunctionDaoImpl() {
		super(UserFunctionPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserFunctionPO> queryUserFunction(Short type) {

		Criteria criteria = session().createCriteria(UserFunctionPO.class).add(Restrictions.eq("status", UserFunctionPO.STATUS_ENABLE_INT));

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		return criteria.list();
	}

}
