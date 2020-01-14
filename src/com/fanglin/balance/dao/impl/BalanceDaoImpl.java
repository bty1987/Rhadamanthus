package com.fanglin.balance.dao.impl;

import java.util.List;


import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceDao")
public class BalanceDaoImpl extends DaoImpl<BalancePO> implements BalanceDao{

	public BalanceDaoImpl() {
		super(BalancePO.class);
	}

	@Override
	public List<BalancePO> pageBalance(Paging paging, List<Filter> filters, int company) {
		
		PagingQuery<BalancePO> query = pagingQuery(paging, BalancePO.class);
		
		query.add(query.getCriterion("company", company, "eq"));
		
		queryFilterExcute(query, filters);
		
		query.desc("bid");
		
		return  query.list();
	}
	
	@Override
	public BalancePO queryBalance(String no) {
		return (BalancePO) session().createCriteria(BalancePO.class).add(Restrictions.eq("no", no)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		query.alias("creater", "creater");

		if (filters != null) {
			for (Filter filter : filters) {

				if (BalancePO.COLUMN_STATUS_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
				} else if (BalancePO.COLUMN_TYPE_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
				} else if (BalancePO.COLUMN_NO_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), String.valueOf(filter.getData()), filter.getOp()));
				}else {
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}
			}
		}

	}

}
