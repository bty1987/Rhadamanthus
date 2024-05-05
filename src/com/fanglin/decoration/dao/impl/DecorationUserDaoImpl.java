package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationUserDao;
import com.fanglin.decoration.po.DecorationUserDO;
import com.fanglin.decoration.po.DecorationUserPO;
import com.fanglin.utils.Paging;

@Repository("DecorationUserDao")
public class DecorationUserDaoImpl extends DaoImpl<DecorationUserPO> implements DecorationUserDao {

	public DecorationUserDaoImpl() {
		super(DecorationUserPO.class);
	}

	@Override
	public List<DecorationUserDO> pageDecorationForUser(Paging paging, List<Filter> filters, int uid) throws FLException {

		PagingQuery<DecorationUserDO> query = pagingQuery(paging, DecorationUserDO.class);

		query.alias("user", "user").add(query.getCriterion(DecorationUserDO.DECORATION_USER_STR, uid, "eq"));

		queryFilterExcute(query, filters);

		query.desc("duid");

		return query.list();
	}

	@Override
	public List<DecorationUserPO> queryDecorationUser(Paging paging, List<Filter> filters, String orderId) {

		PagingQuery<DecorationUserPO> query = pagingQuery(paging, DecorationUserPO.class);

		query.add(query.getCriterion(DecorationUserPO.DECORATION_ORDERID_STR, orderId, "eq"));

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

	}

}
