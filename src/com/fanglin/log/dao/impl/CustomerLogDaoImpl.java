package com.fanglin.log.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.CustomerLogDao;
import com.fanglin.log.po.CustomerLogPO;
import com.fanglin.utils.Paging;

@Repository("customerLogDao")
public class CustomerLogDaoImpl extends DaoImpl<CustomerLogPO> implements CustomerLogDao {

	public CustomerLogDaoImpl(){
		super(CustomerLogPO.class);
	}

	@Override
	public List<CustomerLogPO> pageCustomerLog(Paging paging, List<Filter> filters){
		PagingQuery<CustomerLogPO> query = pagingQuery(paging, CustomerLogPO.class);

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
			} else if ("cid".equals(field)){
				query.add(getCriterion("cid", Long.valueOf(data), op));
			} else if ("cpid".equals(field)){
				query.add(getCriterion("cpid", Long.valueOf(data), op));
			} else if ("operateUserId".equals(field)){
				query.add(getCriterion("operateUserId", data, op));
			} else if ("type".equals(field)){
				query.add(getCriterion("type", Short.valueOf(data), op));
			} else {
				query.add(query.getCriterion(field, data, op));
			}
		}
	}

}
