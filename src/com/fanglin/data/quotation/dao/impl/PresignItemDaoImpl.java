package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PresignItemPO;
import com.fanglin.data.po.PresignItemPP;
import com.fanglin.data.quotation.dao.PresignItemDao;
import com.fanglin.utils.Paging;

@Repository("presignItemDao")
public class PresignItemDaoImpl extends DaoImpl<PresignItemPO> implements PresignItemDao {

	public PresignItemDaoImpl() {
		super(PresignItemPO.class);
	}

	@Override
	public List<PresignItemPO> pagePresignItem(Paging paging, List<Filter> filters, Long ppid, Short status, List<Short> types) {

		PagingQuery<PresignItemPO> query = pagingQuery(paging, PresignItemPO.class);

		if (ppid != null) {
			query.add(Restrictions.eq("ppid", ppid));
		}

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		if (types != null && types.size() != 0) {
			query.add(Restrictions.in("type", types));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<PresignItemPP> pagePresignItem(Paging paging, List<Filter> filters) {

		PagingQuery<PresignItemPP> query = pagingQuery(paging, PresignItemPP.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PresignItemPO> queryPresignItem(long ppid) {
		return session().createCriteria(PresignItemPO.class).add(Restrictions.eq("ppid", ppid)).add(Restrictions.or(Restrictions.eq("onetype", PresignItemPO.ONETYPE_STANDARD_INT), Restrictions.eq("onetype", PresignItemPO.ONETYPE_MATESUB_INT))).add(Restrictions.eq("status", PresignItemPO.STATUS_ENABLE_INT)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("piid".equals(field)) {
				query.add(query.getCriterion("piid", data, op));
			} else if ("name".equals(filter.getField())) {
				query.add(query.getCriterion("name", filter));
			} else if ("status".equals(filter.getField())) {
				query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
			} else if ("type".equals(filter.getField())) {
				query.add(Restrictions.eq("type", Short.valueOf(filter.getData())));
			}
		}
	}

}
