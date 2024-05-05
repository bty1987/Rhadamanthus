package com.fanglin.salary.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.MaterialSalaryDao;
import com.fanglin.salary.po.MaterialSalaryPO;
import com.fanglin.utils.Paging;

@Repository("materialSalaryDao")
public class MaterialSalaryDaoImpl extends DaoImpl<MaterialSalaryPO> implements MaterialSalaryDao {

	public MaterialSalaryDaoImpl() {
		super(MaterialSalaryPO.class);
	}

	@Override
	public List<MaterialSalaryPO> pageMaterialSalary(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<MaterialSalaryPO> query = pagingQuery(paging, MaterialSalaryPO.class);

		queryFilterExcute(query, filters);

		query.desc("msid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("belonger", "belonger");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("userId".equals(field)) {
				query.add(query.getCriterion("belonger.userId", data, op));
			} else if ("userName".equals(field)) {
				query.add(query.getCriterion("belonger.userName", data, op));
			} else if ("orderId".equals(field)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion("decoration.orderId", data, op));
			} else if ("sales.no".equals(field)) {
				query.alias("sales", "sales");
				query.add(query.getCriterion("sales.no", data, op));
			} else if ("stage".equals(field)) {
				query.add(query.getCriterion("stage", Short.valueOf(data), op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			}
		}
	}
}
