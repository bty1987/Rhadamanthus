package com.fanglin.sales.dao.impl;

import java.util.ArrayList;
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
	@SuppressWarnings("unchecked")
	public List<OalesRecordPO> pageOalesRecord(Paging paging, List<Filter> filters, Long oid) throws FLException {
		// 构建查询条件
		List<Filter> finalFilters = new ArrayList<Filter>();
		if (filters != null) {
			finalFilters.addAll(filters);
		}

		// 如果指定了oid，添加过滤条件
		if (oid != null) {
			finalFilters.add(new Filter("oid", Filter.EQ, oid));
		}

		// 执行分页查询
		return page(paging, finalFilters, Order.desc("operateTime"));
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OalesRecordPO> queryOalesRecordByOid(long oid) {
		return session().createCriteria(OalesRecordPO.class)
				.add(Restrictions.eq("oid", oid))
				.addOrder(Order.desc("operateTime"))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OalesRecordPO> queryOalesRecordByOpid(long opid) {
		return session().createCriteria(OalesRecordPO.class)
				.add(Restrictions.eq("opid", opid))
				.addOrder(Order.desc("operateTime"))
				.list();
	}
}
