package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceCutpayDao;
import com.fanglin.balance.po.BalanceCutpayPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceCutpayDao")
public class BalanceCutpayDaoImpl extends DaoImpl<BalanceCutpayPO> implements BalanceCutpayDao {

	public BalanceCutpayDaoImpl() {
		super(BalanceCutpayPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<BalanceCutpayPO> queryBalanceCutpay(long bid) {

		return session().createCriteria(BalanceCutpayPO.class).add(Restrictions.eq("balance.bid", bid)).list();
	}

	@Override
	public List<BalanceCutpayPO> pageBalanceCutpay(Paging paging, List<Filter> filters, Long bdid) {

		PagingQuery<BalanceCutpayPO> query = pagingQuery(paging, BalanceCutpayPO.class);

		query.add(Restrictions.eq("dccount.bdid", bdid));

		return query.list();
	}

}
