package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.FunctionAreaTypePO;
import com.fanglin.data.quotation.dao.FunctionAreaTypeDao;
import com.fanglin.utils.Paging;

@Repository("functionAreaTypeDao")
public class FunctionAreaTypeDaoImpl extends DaoImpl<FunctionAreaTypePO> implements FunctionAreaTypeDao {

	public FunctionAreaTypeDaoImpl() {
		super(FunctionAreaTypePO.class);
	}

	@Override
	public List<FunctionAreaTypePO> pageFunctionAreaType(Paging paging, List<Filter> filters) {

		PagingQuery<FunctionAreaTypePO> query = pagingQuery(paging, FunctionAreaTypePO.class);

		query.asc("fatId");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaTypePO> queryFunctionAreaType() {
		return session().createCriteria(FunctionAreaTypePO.class).add(Restrictions.eq("status", FunctionAreaTypePO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public FunctionAreaTypePO queryFunctionAreaTypeByName(String name) {
		return (FunctionAreaTypePO) session().createCriteria(FunctionAreaTypePO.class).add(Restrictions.eq("name", name)).setMaxResults(1).uniqueResult();
	}

}
