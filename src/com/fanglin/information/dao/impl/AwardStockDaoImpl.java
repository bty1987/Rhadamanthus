package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.utils.Paging;

@Repository("awardStockDao")
public class AwardStockDaoImpl extends DaoImpl<AwardStockPO> implements AwardStockDao {

	public AwardStockDaoImpl() {
		super(AwardStockPO.class);
	}

	@Override
	public List<AwardStockPO> pageAwardStock(Paging paging, List<Filter> filters, int company) {

		PagingQuery<AwardStockPO> query = pagingQuery(paging, AwardStockPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AwardStockPO> queryAwardStock(short type, short storeroom, int company) {
		return session().createCriteria(AwardStockPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("storeroom", storeroom)).add(Restrictions.eq(AwardStockPO.COLUMN_STATUS_STR, AwardStockPO.STATUS_ABLE_SHORT)).add(Restrictions.eq(AwardStockPO.STATUS_TYPE_STR, type)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AwardStockPO> queryAwardStockByName(String name, int limit, int company) {

		return session().createCriteria(AwardStockPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(AwardStockPO.COLUMN_STATUS_STR, AwardStockPO.STATUS_ABLE_SHORT)).add(Restrictions.ilike(AwardStockPO.COLUMN_NAME_STR, name, MatchMode.ANYWHERE)).setMaxResults(limit).list();

	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {
				if (AwardStockPO.COLUMN_NO_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				} else if (AwardStockPO.COLUMN_NAME_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				} else if (AwardStockPO.STATUS_TYPE_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
				} else if (AwardStockPO.STATUS_STOREROOM_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
				} else if (AwardStockPO.COLUMN_SUBTYPE_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
				} else if (AwardStockPO.COLUMN_STATUS_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
				}
			}
		}
	}

}
