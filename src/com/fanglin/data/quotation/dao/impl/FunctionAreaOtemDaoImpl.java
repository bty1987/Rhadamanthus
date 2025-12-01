package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.FunctionAreaOtemPO;
import com.fanglin.data.quotation.dao.FunctionAreaOtemDao;

@Repository("functionAreaOtemDao")
public class FunctionAreaOtemDaoImpl extends DaoImpl<FunctionAreaOtemPO> implements FunctionAreaOtemDao {

	public FunctionAreaOtemDaoImpl() {
		super(FunctionAreaOtemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaOtemPO> queryFunctionAreaOtemByFaid(long faid) {
		return session().createCriteria(FunctionAreaOtemPO.class).add(Restrictions.eq("faid", faid)).list();
	}

	@Override
	public int deleteFunctionAreaOtemByFaid(long faid) {

		String sql = "delete from data.functionareaotem where faid = :faid";
		session().createSQLQuery(sql).setLong("faid", faid).executeUpdate();

		return 0;
	}

}
