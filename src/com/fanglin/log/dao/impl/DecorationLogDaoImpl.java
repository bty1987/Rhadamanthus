package com.fanglin.log.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.DecorationLogDao;
import com.fanglin.log.po.DecorationLogPO;
import com.fanglin.utils.Paging;

@Repository("decorationLogDao")
public class DecorationLogDaoImpl extends DaoImpl<DecorationLogPO> implements DecorationLogDao {

	public DecorationLogDaoImpl(){
		super(DecorationLogPO.class);
	}

	@Override
	public List<DecorationLogPO> pageDecorationLog(Paging paging, List<Filter> filters){
		PagingQuery<DecorationLogPO> query = pagingQuery(paging, DecorationLogPO.class);

		queryFilterExcute(query, filters);

		query.desc("operateTime");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){

		if (filters == null) return;

		for (Filter filter : filters){
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (!StringUtils.isNotEmpty(data)) continue;

			if ("operateTime".equals(field) && "between".equals(op)){
				query.timeranges("operateTime", "operateTime", data);
			} else if ("operateTime".equals(field)){
				query.add(getCriterion("operateTime", data, op));
			} else if ("dpId".equals(field)){
				query.add(getCriterion("dpId", Long.valueOf(data), op));
			} else if ("orderId".equals(field)){
				query.add(getCriterion("orderId", data, op));
			} else if ("operateUserId".equals(field)){
				query.add(getCriterion("operateUserId", data, op));
			} else {
				query.add(query.getCriterion(field, data, op));
			}
		}
	}

}
