package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PresignProducePO;
import com.fanglin.data.quotation.dao.PresignProduceDao;
import com.fanglin.utils.Paging;

@Repository("presignProduceDao")
public class PresignProduceDaoImpl extends DaoImpl<PresignProducePO> implements PresignProduceDao {

	public PresignProduceDaoImpl() {
		super(PresignProducePO.class);
	}

	@Override
	public List<PresignProducePO> pagePresignProduce(Paging paging, List<Filter> filters, int company) {

		PagingQuery<PresignProducePO> query = pagingQuery(paging, PresignProducePO.class);
		
		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PresignProducePO> queryPresignProduce(int company) {
		return session().createCriteria(PresignProducePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("status", PresignProducePO.STATUS_INIT_INT)).list();
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
			}else if ("name".equals(filter.getField())) {
				query.add(query.getCriterion("name", filter));
			}else if("status".equals(filter.getField())){
				query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
			}
		}
	}

}
