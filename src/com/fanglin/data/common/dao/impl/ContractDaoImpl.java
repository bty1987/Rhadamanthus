package com.fanglin.data.common.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ContractDao;
import com.fanglin.data.po.ContractPO;
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
		return session().createCriteria(ContractPO.class).add(Restrictions.eq(ContractPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(ContractPO.COLUMN_STATUS_STR, ContractPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public int countContract(String no) {

		String sql = "select count(*) from data.contract where no = :no";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("no", no).uniqueResult();

		return count != null ? count.intValue() : 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {

			for (Filter filter : filters) {
				if ("name".equals(filter.getField())) {
					query.add(query.getCriterion("name", filter));
				} else if ("status".equals(filter.getField())) {
					query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
				}
			}
		}
	}

}
