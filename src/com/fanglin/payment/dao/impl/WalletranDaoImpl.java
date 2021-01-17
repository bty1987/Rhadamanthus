package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.WalletranDao;
import com.fanglin.payment.po.WalletranPO;
import com.fanglin.utils.Paging;

@Repository("walletranDao")
public class WalletranDaoImpl extends DaoImpl<WalletranPO> implements WalletranDao {

	public WalletranDaoImpl(){
		super(WalletranPO.class);
	}

	@Override
	public List<WalletranPO> pageWalletran(Paging paging, List<Filter> filters) {
		
		PagingQuery<WalletranPO> query = pagingQuery(paging, WalletranPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WalletranPO> querywalletran(Long wid) {
		return session().createCriteria(WalletranPO.class).createAlias("wallet", "wallet").add(Restrictions.eq("wallet.wid", wid)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			query.alias("wallet", "wallet");
			query.alias("tallet", "tallet");
			
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if ("wallet".equals(field)) {
					query.add(query.getCriterion("wallet.wid", Long.valueOf(data), op));
				} else if ("tallet".equals(field)) {
					query.add(query.getCriterion("tallet.wid", Long.valueOf(data), op));
				} else if ("type".equals(field)) {
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				} else if ("status".equals(field)) {
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}
			}
		}
	}

}
