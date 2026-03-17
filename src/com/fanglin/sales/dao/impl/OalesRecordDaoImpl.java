package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.OalesRecordDao;
import com.fanglin.sales.po.OalesRecordPO;
import com.fanglin.utils.Paging;

/**
 * 外销单操作记录DAO实现
 * 
 * @author AI Assistant
 * @date 2026-03-17
 */
@Repository("oalesRecordDao")
public class OalesRecordDaoImpl extends DaoImpl<OalesRecordPO> implements OalesRecordDao {

	public OalesRecordDaoImpl() {
		super(OalesRecordPO.class);
	}

	@Override
	public List<OalesRecordPO> pageOalesRecord(Paging paging, List<Filter> filters, Long oid) throws FLException {

		PagingQuery<OalesRecordPO> query = pagingQuery(paging, OalesRecordPO.class);

		query.add(query.getCriterion("oid", oid, "eq"));

		queryFilterExecute(query, filters);

		query.desc("opid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OalesRecordPO> queryOalesRecordByOid(long oid) {
		return session().createCriteria(OalesRecordPO.class).add(Restrictions.eq("oid", oid)).addOrder(Order.desc("operateTime")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OalesRecordPO> queryOalesRecordByOpid(long opid) {
		return session().createCriteria(OalesRecordPO.class).add(Restrictions.eq("opid", opid)).addOrder(Order.desc("operateTime")).list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws FLException {

	}
}
