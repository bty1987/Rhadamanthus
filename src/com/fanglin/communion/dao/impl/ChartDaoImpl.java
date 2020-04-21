package com.fanglin.communion.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.ChartDao;
import com.fanglin.communion.po.ChartPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("chartDao")
public class ChartDaoImpl extends DaoImpl<ChartPO> implements ChartDao {

	public ChartDaoImpl() {
		super(ChartPO.class);
	}

	@Override
	public List<ChartPO> pageChart(Paging paging, List<Filter> filters) {
		PagingQuery<ChartPO> query = pagingQuery(paging, ChartPO.class);

		queryFilterExcute(query, filters);
		
		query.desc("cid");

		return query.list();
	}
	

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if (field.equals("no")) {
					query.add(query.getCriterion(field, data, op));
				} else if (field.equals("name")) {
					query.add(query.getCriterion(field, data, op));
				}
			}
		}

	}

}
