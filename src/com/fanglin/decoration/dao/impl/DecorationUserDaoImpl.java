package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationUserDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.po.DecorationUserPO;
import com.fanglin.utils.Paging;

@Repository("DecorationUserDao")
public class DecorationUserDaoImpl extends DaoImpl<DecorationUserPO> implements DecorationUserDao {

	public DecorationUserDaoImpl() {
		super(DecorationUserPO.class);
	}

	@Override
	public List<DecorationPO> pageDecorationForUser(Paging paging, List<Filter> filters, int uid) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		// 以装修单为根实体, exists 子查询圈定"当前人员在其服务团队中"的订单:
		// 同一人在同单存在多个 type 行(自动+手工)时天然去重, 分页计数也正确
		DetachedCriteria sub = DetachedCriteria.forClass(DecorationUserPO.class, "du");
		sub.createAlias("du.user", "duu").add(Restrictions.eq("duu.uid", uid));
		sub.setProjection(Projections.property("du.orderId"));

		query.add(Subqueries.propertyIn("orderId", sub));

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	public List<DecorationUserPO> queryDecorationUser(Paging paging, List<Filter> filters, String orderId, Short isShow) {

		PagingQuery<DecorationUserPO> query = pagingQuery(paging, DecorationUserPO.class);

		query.add(query.getCriterion(DecorationUserPO.DECORATION_ORDERID_STR, orderId, "eq"));

		if (isShow != null) {
			query.add(query.getCriterion("isShow", isShow, "eq"));
		}

		return query.list();
	}

	@Override
	public long countDecorationUser(String orderId, int user, Short type) {

		Criteria criteria = session().createCriteria(DecorationUserPO.class).createAlias("user", "user").add(Restrictions.eq(DecorationUserPO.DECORATION_ORDERID_STR, orderId)).add(Restrictions.eq("user.uid", user));

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		Long count = (Long) criteria.setProjection(Projections.rowCount()).uniqueResult();

		return count == null ? 0 : count.longValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		DecorationDaoImpl.queryFilterExcute(query, filters, "");

	}

}
