package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.DecorationFunctionRightDao;
import com.fanglin.right.po.DecorationFunctionRightPO;

@Repository("decorationFunctionRightDao")
public class DecorationFunctionRightDaoImpl extends DaoImpl<DecorationFunctionRightPO> implements DecorationFunctionRightDao {

	public DecorationFunctionRightDaoImpl() {
		super(DecorationFunctionRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationFunctionRightPO> queryDecorationFunctionRightByName(String name, Integer company) {
		return session().createCriteria(DecorationFunctionRightPO.class).add(Restrictions.eq("name", name)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	public int deleteDecorationFunctionRightByName(String name, Integer company) {

		String sql = "delete from platform.decorationfunctionright where name = :name and company = :company";
		session().createSQLQuery(sql).setString("name", name).setInteger("company", company).executeUpdate();

		return 0;
	}

}
