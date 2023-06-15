package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DecorationAtttypeDao;
import com.fanglin.data.po.DecorationAtttypePO;
import com.fanglin.utils.Paging;

@Repository("decorationAtttypeDao")
public class DecorationAtttypeDaoImpl extends DaoImpl<DecorationAtttypePO> implements DecorationAtttypeDao {

	public DecorationAtttypeDaoImpl() {
		super(DecorationAtttypePO.class);
	}

	@Override
	public List<DecorationAtttypePO> pageDecorationAtttype(Paging paging, List<Filter> filters, int company) {

		PagingQuery<DecorationAtttypePO> query = pagingQuery(paging, DecorationAtttypePO.class);

		query.add(Restrictions.eq("company", company));

		query.asc("daid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationAtttypePO> queryDecorationAtttype(int company) {
		return session().createCriteria(DecorationAtttypePO.class).add(Restrictions.eq("company", company)).list();
	}
}
