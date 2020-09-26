package com.fanglin.store.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.MgoodsDao;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.utils.Paging;

@Repository("mgoodsDao")
public class MgoodsDaoImpl extends DaoImpl<MgoodsPO> implements MgoodsDao {

	public MgoodsDaoImpl() {
		super(MgoodsPO.class);
	}

	@Override
	public List<MgoodsPO> pageMgoods(Paging paging, List<Filter> filters, boolean flag) {

		PagingQuery<MgoodsPO> query = pagingQuery(paging, MgoodsPO.class);

		queryFilterExcute(query, filters);

		if (flag) {
			query.add(Restrictions.ne("status", MgoodsPO.STATUS_DISABLE_SHORT));
		}

		return query.list();
	}

	@Override
	public List<MgoodsPO> queryMgoodsByPinyin(Paging paging, String name) {

		PagingQuery<MgoodsPO> query = pagingQuery(paging, MgoodsPO.class);

		if (StringUtils.isNotEmpty(name)) {
			query.add(Restrictions.or(Restrictions.like("pinyin", name, MatchMode.START), Restrictions.like("no", name, MatchMode.START))).add(Restrictions.eq("status", MgoodsPO.STATUS_ABLE_SHORT));
		}

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		for (Filter filter : filters) {
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals(MgoodsPO.COLUMN_BID_STR)) {
				if (data != null) {
					query.alias("mbrand", "mbrand");
					query.add(query.getCriterion(field, Long.valueOf(data), op));
				}
			} else if (field.equals("no")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("barcode")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("name")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("pinyin")) {
				if (StringUtils.isNotEmpty(field)) {
					query.add(Restrictions.or(Restrictions.like("pinyin", data, MatchMode.START), Restrictions.like("name", data, MatchMode.START))).add(Restrictions.eq("status", MgoodsPO.STATUS_ABLE_SHORT));
				}
			}
		}
	}

}
