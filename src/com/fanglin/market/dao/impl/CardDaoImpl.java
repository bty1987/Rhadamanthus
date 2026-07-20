package com.fanglin.market.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.CardDao;
import com.fanglin.market.po.CardPO;
import com.fanglin.utils.Paging;

@Repository("cardDao")
public class CardDaoImpl extends DaoImpl<CardPO> implements CardDao {

	public CardDaoImpl(){
		super(CardPO.class);
	}

	@Override
	public CardPO queryCardByCuid(long cuid) {
		return (CardPO) session().createCriteria(CardPO.class).createAlias("cuser", "cuser").add(Restrictions.eq(CardPO.COLUMN_CUID_STR, cuid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public List<CardPO> pageCard(Paging paging, List<Filter> filter) {
		
		PagingQuery<CardPO> query = pagingQuery(paging, CardPO.class);

		queryFilterExcute(query, filter);

		return query.list();
	}
	
	private void queryFilterExcute(PagingQuery<CardPO> query,List<Filter> filters) {
		
		if (filters != null) {
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals("name")){
					query.add(query.getCriterion("userName", data, op));
				}else if(field.equals("phone")){
					query.add(query.getCriterion("phone", data, op));
				}else if(field.equals("industry")){
					query.add(query.getCriterion("industry", data, op));
				}
			}
		}
	}

}
