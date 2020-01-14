package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.AccountDao;
import com.fanglin.balance.po.AccountPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("accountDao")
public class AccountDaoImpl extends DaoImpl<AccountPO> implements AccountDao {

	public AccountDaoImpl() {
		super(AccountPO.class);
	}

	@Override
	public List<AccountPO> pageAccount (Paging paging, List<Filter> filters) {

		PagingQuery<AccountPO> query = pagingQuery(paging, AccountPO.class);

		queryFilterExcute(query, filters);
		
		query.desc("aid");
		
		return query.list();

	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<AccountPO> queryAccount(int buid) {
		
		return session().createCriteria(AccountPO.class).createAlias("belonger", "belonger").add(Restrictions.eq(AccountPO.COLUMN_BELONGER_UID_STR, buid)).add(Restrictions.eq(AccountPO.COLUMN_STATUS_STR,AccountPO.STATUS_VALID_SHORT)).add(Restrictions.eq(AccountPO.COLUMN_TYPE_STR,AccountPO.TYPE_VALID_SHORT)).list();
	
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<AccountPO> queryAccountForTeller(int company) {
		  return session().createCriteria(AccountPO.class).add(Restrictions.eq(AccountPO.COLUMN_STATUS_STR,AccountPO.STATUS_VALID_SHORT)).add(Restrictions.eq(AccountPO.COLUMN_TYPE_STR,AccountPO.TYPE_UNVALID_SHORT)).add(Restrictions.eq("company", company)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
			
			if(filters != null){
				for (Filter filter : filters) {
					
					String field = filter.getField();
					String data = filter.getData();
					String op = filter.getOp();
					
					if(field.equals("name")){
						query.add(query.getCriterion(field, data, op));
					}else if(field.equals("status")){
						query.add(query.getCriterion(field, Short.valueOf(data), op));
					}
				}
			}
			
		}
	
}
