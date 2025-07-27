package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CppointDao;
import com.fanglin.customer.po.CppointPO;
import com.fanglin.utils.Paging;

@Repository("cppointDao")
public class CppointDaoImpl extends DaoImpl<CppointPO> implements CppointDao {

	@Override
	public CppointPO queryCppoint(long cid) {
		return (CppointPO) session().createCriteria(CppointPO.class).add(Restrictions.eq(CppointPO.COLUMN_CID_STR, cid)).uniqueResult();
	}

	@Override
	public CppointPO queryCppointByOrderId(String orderId) {
		return (CppointPO) session().createCriteria(CppointPO.class).add(Restrictions.eq(CppointPO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public List<CppointPO> pageCppoint(Paging paging, List<Filter> filters) {
		PagingQuery<CppointPO> query = pagingQuery(paging, CppointPO.class);

		return query.list();
	}

}
