package com.fanglin.salary.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.DecorationSalaryDao;
import com.fanglin.salary.po.DecorationSalaryPO;
import com.fanglin.utils.Paging;

@Repository("decorationSalaryDao")
public class DecorationSalaryDaoImol extends DaoImpl<DecorationSalaryPO> implements DecorationSalaryDao {

	private DecorationSalaryDaoImol() {
		super(DecorationSalaryPO.class);
	}

	@Override
	public List<DecorationSalaryPO> pageDecorationSalary(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<DecorationSalaryPO> query = pagingQuery(paging, DecorationSalaryPO.class);

		queryFilterExcute(query, filters);

		query.desc("dsid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		query.alias("belonger", "belonger");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("userId".equals(field)) {
				query.add(query.getCriterion(DecorationSalaryPO.COLUMN_BELONGER_USERID_STR, data, op));
			} else if ("userName".equals(field)) {
				query.add(query.getCriterion(DecorationSalaryPO.COLUMN_BELONGER_USERNAME_STR, data, op));
			} else if ("orderId".equals(field)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion(DecorationSalaryPO.COLUMN_ORDERID_STR, data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion(DecorationSalaryPO.COLUMN_TYPE_STR, Short.valueOf(data), op));
			} else if ("atttype".equals(field)) {
				query.add(query.getCriterion(DecorationSalaryPO.ATTTYPE_INIT_STRA, Short.valueOf(data), op));
			} else if ("stage".equals(field)) {
				query.add(query.getCriterion(DecorationSalaryPO.STAGE_INIT_STRA, Short.valueOf(data), op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			}
		}
	}
}