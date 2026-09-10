/**
 * @File Name		: QuotationVersionDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.utils.Paging;

@Repository("functionAreaDao")
public class FunctionAreaDaoImpl extends DaoImpl<FunctionAreaPO> implements FunctionAreaDao {

	public FunctionAreaDaoImpl() {
		super(FunctionAreaPO.class);
	}

	@Override
	public List<FunctionAreaPO> pageFunctionArea(Paging paging, List<Filter> filters, int company) {

		PagingQuery<FunctionAreaPO> query = pagingQuery(paging, FunctionAreaPO.class);

		queryFilterExcute(query, filters);

		return query.alias("quotationVersion", "quotationVersion").add(Restrictions.eq("quotationVersion.company", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaPO> queryFunctionArea(String versionId) {
		return createCriteria(FunctionAreaPO.class).add(Restrictions.eq("quotationVersion.no", versionId)).add(Restrictions.eq("status", FunctionAreaPO.STATUS_ENABLE_INT)).addOrder(Order.asc("functionAreaOrder")).list();
	}

	@Override
	public FunctionAreaPO queryFunctionArea(String no, String versionId) {
		return (FunctionAreaPO) session().createCriteria(FunctionAreaPO.class).add(Restrictions.eq("no", no)).add(Restrictions.eq("quotationVersion.no", versionId)).uniqueResult();
	}

	@Override
	public int countFunctionAreaByFunctionAreaType(String functionAreaType) {
		return ((Number) createCriteria(FunctionAreaPO.class).add(Restrictions.eq("functionAreaType", functionAreaType)).setProjection(org.hibernate.criterion.Projections.rowCount()).uniqueResult()).intValue();
	}


	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("versionId".equals(field)) {
				query.add(query.getCriterion("quotationVersion.no", data, op));
			} else if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else {
				query.add(query.getCriterion(field, data, op));
			}
		}
	}

}
