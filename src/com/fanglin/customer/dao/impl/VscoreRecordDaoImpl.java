package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.VscoreRecordDao;
import com.fanglin.customer.po.VscoreRecordPO;
import com.fanglin.utils.Paging;

@Repository("vscoreRecordDao")
public class VscoreRecordDaoImpl extends DaoImpl<VscoreRecordPO> implements VscoreRecordDao {

	public VscoreRecordDaoImpl() {
		super(VscoreRecordPO.class);
	}

	@Override
	public List<VscoreRecordPO> pageVscoreRecordByUnionId(Paging paging, List<Filter> filters, String unionId) {

		PagingQuery<VscoreRecordPO> query = pagingQuery(paging, VscoreRecordPO.class);

		query.add(Restrictions.eq(VscoreRecordPO.COLUMN_UNIONID_STR, unionId));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("VscoreRecordType".equals(field)) {
				query.add(Restrictions.eq("type", data));
			}
		}
	}

}
