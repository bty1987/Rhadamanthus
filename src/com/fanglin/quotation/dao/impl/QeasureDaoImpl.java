package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QeasureDao;
import com.fanglin.quotation.po.QeasurePO;
import com.fanglin.utils.Paging;

@Repository("qeasureDao")
public class QeasureDaoImpl extends DaoImpl<QeasurePO> implements QeasureDao {

	public QeasureDaoImpl() {
		super(QeasurePO.class);
	}

	@Override
	public List<QeasurePO> pageQeasure(Paging paging, List<Filter> filters, int company) {

		PagingQuery<QeasurePO> query = pagingQuery(paging, QeasurePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public QeasurePO queryQeasureByOrderId(String orderId) {
		return (QeasurePO) session().createCriteria(QeasurePO.class).add(Restrictions.eq("orderId", orderId)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

	}

}
