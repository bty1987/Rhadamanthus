package com.fanglin.production.dao.impl;


import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.QuoteTypeDao;
import com.fanglin.production.po.QuoteTypePO;
import com.fanglin.utils.Paging;

@Repository("quotetypeDao")
public class QuoteTypeDaoImpl extends DaoImpl<QuoteTypePO> implements QuoteTypeDao {

	public QuoteTypeDaoImpl(){
		super(QuoteTypePO.class);
	}
	
	@Override
	public List<QuoteTypePO> pageQuoteType(Paging paging, List<Filter> filters) {
		
		PagingQuery<QuoteTypePO> query = pagingQuery(paging, QuoteTypePO.class);
		
		queryFilterExcute(query,filters);
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<QuoteTypePO> queryQuoteType() {
		return session().createCriteria(QuoteTypePO.class).add(Restrictions.eq(QuoteTypePO.COLUMN_STATUS_STR, QuoteTypePO.STATUS_ENABLE_SHORT)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query ,List<Filter> filters){
		
		if(filters != null){
			
			for(Filter filter : filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(QuoteTypePO.COLUMN_NAME_STR.equals(field)){
					query.add(query.getCriterion(QuoteTypePO.COLUMN_NAME_STR, data, op));
				}
			}
		}
	}

	
	
}
