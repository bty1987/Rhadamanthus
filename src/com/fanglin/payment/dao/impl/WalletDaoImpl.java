package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.WalletDao;
import com.fanglin.payment.po.WalletPO;
import com.fanglin.utils.Paging;

@Repository("walletDao")
public class WalletDaoImpl extends DaoImpl<WalletPO> implements WalletDao {

	public WalletDaoImpl() {
		super(WalletPO.class);
	}

	@Override
	public List<WalletPO> pageWallet(Paging paging, List<Filter> filters) {

		PagingQuery<WalletPO> query = pagingQuery(paging, WalletPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public WalletPO queryWalletByNo(String no) {
		return (WalletPO) session().createCriteria(WalletPO.class).add(Restrictions.eq("no", no)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int decreaseWallet(long wid, long delta) {
		String sql = "update payment.wallet set balance = balance - :delta where wid = :wid and balance >= :delta";
		return session().createSQLQuery(sql).setLong("delta", delta).setLong("wid", wid).executeUpdate();
	}

	@Override
	public int increaseWallet(long wid, long delta) {
		String sql = "update payment.wallet set balance = balance + :delta where wid = :wid";
		return session().createSQLQuery(sql).setLong("delta", delta).setLong("wid", wid).executeUpdate();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {

			query.alias("belonger", "belonger");

			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("belonger".equals(field)) {
					query.add(query.getCriterion("belonger.userId", data, op));
				} else if ("phone".equals(field)) {
					query.add(query.getCriterion(field, data, op));
				}
			}
		}
	}

}
