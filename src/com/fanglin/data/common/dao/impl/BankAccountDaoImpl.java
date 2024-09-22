package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.BankAccountDao;
import com.fanglin.data.po.BankAccountPO;
import com.fanglin.utils.Paging;

@Repository("bankAccountDao")
public class BankAccountDaoImpl extends DaoImpl<BankAccountPO> implements BankAccountDao {

	public BankAccountDaoImpl() {
		super(BankAccountPO.class);
	}

	@Override
	public List<BankAccountPO> pageBankAccount(Paging paging, List<Filter> filters) {

		PagingQuery<BankAccountPO> query = pagingQuery(paging, BankAccountPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (BankAccountPO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (BankAccountPO.COLUMN_BANKNAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (BankAccountPO.COLUMN_BANKNO_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (BankAccountPO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if (BankAccountPO.COLUMN_COMPANY_STR.equals(field)) {
				query.add(query.getCriterion(field, Integer.valueOf(data), op));
			}
		}
	}

}
