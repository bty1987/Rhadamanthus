package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.FunctionAreaFormatPO;
import com.fanglin.data.quotation.dao.FunctionAreaFormatDao;

@Repository("functionAreaFormatDao")
public class FunctionAreaFormatDaoImpl extends DaoImpl<FunctionAreaFormatPO> implements FunctionAreaFormatDao {

	public FunctionAreaFormatDaoImpl() {
		super(FunctionAreaFormatPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaFormatPO> queryFunctionAreaFormatByFacid(long facid) {
		return createCriteria(FunctionAreaFormatPO.class).add(Restrictions.eq("functionAreaCategory.fcid", facid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaFormatPO> queryFunctionAreaFormatByFacids(List<Long> facids) {
		return createCriteria(FunctionAreaFormatPO.class).add(Restrictions.in("functionAreaCategory.fcid", facids)).list();
	}

	@Override
	public int deleteFunctionAreaFormatByFacid(long facid) {
		String sql = "delete from quotation.functionareaformat where facid = :facid";
		return session().createSQLQuery(sql).setLong("facid", facid).executeUpdate();
	}

}
