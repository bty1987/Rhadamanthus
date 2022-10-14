/**
 * @File Name	: CustypeDaoImpl.java
 * @Package   	: com.fanglin.data.dao.impl
 * @Version		: 1.0
 * @Date			: 2022-06-14
 * @Copyright	: Copyright Creators 2022
 * @Author		: LY
 */

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CustypeDao;
import com.fanglin.communion.po.CustypePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("custypeDao")
public class CustypeDaoImpl extends DaoImpl<CustypePO> implements CustypeDao {

	public CustypeDaoImpl() {
		super(CustypePO.class);
	}

	@Override
	public List<CustypePO> pageCustype(Paging paging, List<Filter> filters, int company) {

		PagingQuery<CustypePO> query = pagingQuery(paging, CustypePO.class);
		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public CustypePO queryCustype(int company, String dgrade, String sgrade, Short atttype) {
		Criteria criteria = session().createCriteria(CustypePO.class).add(Restrictions.eq(CustypePO.COLUMN_STATUS_STR, CustypePO.STATUS_ENABLE_INT)).add(Restrictions.eq(CustypePO.COLUMN_COMPANY_STR, company));

		if (dgrade != null) {
			criteria.add(Restrictions.eq(CustypePO.COLUMN_DGRADE_STR, dgrade));
		}

		if (sgrade != null) {
			criteria.add(Restrictions.eq(CustypePO.COLUMN_SGRADE_STR, sgrade));
		}

		if (atttype != null) {
			criteria.add(Restrictions.eq(CustypePO.COLUMN_ATTTYPE_STR, atttype));
		}

		return (CustypePO) criteria.setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		if (filters == null) return;

		for (Filter filter : filters) {
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (CustypePO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (CustypePO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}
