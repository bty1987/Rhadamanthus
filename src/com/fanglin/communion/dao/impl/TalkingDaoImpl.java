package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.TalkingDao;
import com.fanglin.communion.po.TalkingPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("talKingDao")
public class TalkingDaoImpl extends DaoImpl<TalkingPO> implements TalkingDao {
	
	public TalkingDaoImpl(){
		super(TalkingPO.class);
	}

	@Override
	public List<TalkingPO> pageTalking(Paging paging, List<Filter> filters, int company) {
		
		PagingQuery<TalkingPO> query = pagingQuery(paging, TalkingPO.class);
		
		query.add(query.getCriterion("company", company, "eq"));
		
		queryFilterExcute(filters, query);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<TalkingPO> queryTalking(List<Short> types, int company) {
		
		String sql = " SELECT * FROM communion.talking WHERE company = :company AND type IN (:type)";
		
		Query query = session().createSQLQuery(sql).addEntity(TalkingPO.class).setLong("company", company);
		
		if (types != null && types.size() > 0) {
			query.setParameterList("type", types);
		}
		
		return  query.list();
	}

	public void queryFilterExcute(List<Filter> filter, PagingQuery<TalkingPO> query) {

		if (filter != null) {
			for (Filter filters : filter) {
				
				String op = filters.getOp();
				String data = filters.getData();
				String field = filters.getField();
				
				if (TalkingPO.COLUMN_NAME_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if(TalkingPO.COLUMN_TYPE_STR.equals(field)) {
					query.add(query.getCriterion(field, Short.parseShort(data), op));
				} else if(TalkingPO.COLUMN_STATUS_STR.equals(field)) {
					query.add(query.getCriterion(field, Short.parseShort(data), op));
				} 
			}
		}
	}
}
