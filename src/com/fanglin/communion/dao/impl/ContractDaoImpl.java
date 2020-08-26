package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.ContractDao;
import com.fanglin.communion.po.ContractPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("contractDao")
public class ContractDaoImpl extends DaoImpl<ContractPO> implements ContractDao {
	
	public ContractDaoImpl() {
		super(ContractPO.class);
	}

	@Override
	public List<ContractPO> pageContract(Paging paging, List<Filter> filters, int company) {
		
		PagingQuery<ContractPO> query = pagingQuery(paging, ContractPO.class);
		
		query.add(Restrictions.eq(ContractPO.COLUMN_COMPANY_STR, company));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ContractPO> queryContract(int company) {
		return session().createCriteria(ContractPO.class).add(Restrictions.eq(ContractPO.COLUMN_COMPANY_STR, company)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {

			for (Filter filter : filters) {
				if ("name".equals(filter.getField())) {
					query.add(query.getCriterion("name", filter));
				}
			}
		}
	}

}
