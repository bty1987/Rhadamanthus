package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.data.quotation.dao.NormoodDao;
import com.fanglin.utils.Paging;

@Repository("normoodDao")
public class NormoodDaoImpl extends DaoImpl<NormoodPO> implements NormoodDao{

	public NormoodDaoImpl() {
		super(NormoodPO.class);
	}
	
	@Override
	public List<NormoodPO> pageNormood(Paging paging, List<Filter> filters) {

		PagingQuery<NormoodPO> query = pagingQuery(paging, NormoodPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormoodPO> queryNormoodByQiid(Long qiid) {
		return createCriteria(NormoodPO.class).createAlias("quotationItem", "quotationItem").add(Restrictions.eq(NormoodPO.COLUMN_QIID_STR, qiid)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("qiid".equals(field)) {
				query.add(query.getCriterion("qiid", data, op));
			}
			
			if ("versionId".equals(field)) {
				query.alias("quotationItem","quotationItem");
				query.alias("quotationItem.quotationVersion","quotationVersion");
				query.add(query.getCriterion("quotationVersion.no", data, op));
			}
		}
	}

}
