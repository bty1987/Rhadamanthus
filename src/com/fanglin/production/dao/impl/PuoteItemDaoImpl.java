package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.PuoteItemDao;
import com.fanglin.production.po.PuoteItemPO;
import com.fanglin.utils.Paging;

@Repository("PuoteItemDao")
public class PuoteItemDaoImpl extends DaoImpl<PuoteItemPO> implements PuoteItemDao {

	public PuoteItemDaoImpl() {
		super(PuoteItemPO.class);
	}

	@Override
	public List<PuoteItemPO> pageQuoteItem(Paging paging, List<Filter> filters) {
		
		PagingQuery<PuoteItemPO> query = pagingQuery(paging, PuoteItemPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<PuoteItemPO> queryQuoteItemByPinyin(Paging paging, String pinyin, Integer company) {
		PagingQuery<PuoteItemPO> query = pagingQuery(paging, PuoteItemPO.class);

		query.add(Restrictions.or(Restrictions.ilike(PuoteItemPO.COLUMN_NAME_STR, pinyin, MatchMode.ANYWHERE), Restrictions.ilike(PuoteItemPO.COLUMN_PINYIN_STR, pinyin, MatchMode.ANYWHERE)));
		if(company != null){
			query.add(Restrictions.eq("company", company));
		}

		return query.list();
	}

	public void queryFilterExcute(PagingQuery<PuoteItemPO> query, List<Filter> filters) {
		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				query.alias("quoteType", "quoteType");

				if (PuoteItemPO.COLUMN_NAME_STR.equals(field)) {
					query.add(query.getCriterion(PuoteItemPO.COLUMN_NAME_STR, data, op));
				} else if (PuoteItemPO.COLUMN_QUOTETYPENAME_STR.equals(field)) {
					query.add(query.getCriterion(PuoteItemPO.COLUMN_QUOTETYPENAME_STR, data, op));
				}
			}
		}
	}

}
