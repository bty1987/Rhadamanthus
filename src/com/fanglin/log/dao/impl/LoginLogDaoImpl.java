package com.fanglin.log.dao.impl;

import java.sql.Timestamp;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.LoginLogDao;
import com.fanglin.log.po.LoginLogPO;
import com.fanglin.utils.Paging;

@Repository("loginLogDao")
public class LoginLogDaoImpl extends DaoImpl<LoginLogPO> implements LoginLogDao {

	@Override
	public List<LoginLogPO> getPageLoginLog(Paging paging, List<Filter> filters) {

		PagingQuery<LoginLogPO> query = pagingQuery(paging, LoginLogPO.class);

		queryFilterExcute(query, filters);

		query.desc("loginTime");

		return query.list();
	}

	@Override
	public void delteBeforLoginTime(Timestamp beforeTime) {

		// Phase 4.4 修复：原代码漏写 executeUpdate()，删除语句从未执行，
		// 导致 loginLog 表的 30 天清理从未生效（recordLoginLogDay 配置形同虚设）。
		// 现补上 executeUpdate()，使 HQL delete 真正提交到数据库。
		Query query = session().createQuery("delete LoginLogPO l where l.loginTime < :beforeTime");
		query.setTimestamp("beforeTime", beforeTime);
		query.executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<LoginLogPO> getLoginLogByLoginIdAndStartEndTime(String loginId, Timestamp start, Timestamp end) {

		return session().createCriteria(LoginLogPO.class).add(Restrictions.eq("loginId", loginId)).add(Restrictions.ge("loginTime", start)).add(Restrictions.le("loginTime", end)).addOrder(Order.desc("loginTime")).list();
	}

	/**
	 * Phase 8: 悲观锁查询，用于防爆破逻辑串行化。
	 *
	 * <p>使用 Criteria 的 setLockMode(LockMode.PESSIMISTIC_WRITE) 对记录加行锁，
	 * 等价于 SELECT ... FOR UPDATE。并发的登录请求会阻塞在此查询上，
	 * 直到前一个事务提交，从而保证防爆破检查的原子性。
	 */
	@Override
	@SuppressWarnings("unchecked")
	public List<LoginLogPO> getLoginLogForUpdateByLoginId(String loginId, Timestamp start, Timestamp end){

		Criteria criteria = session().createCriteria(LoginLogPO.class)
				.add(Restrictions.eq("loginId", loginId))
				.add(Restrictions.ge("loginTime", start))
				.add(Restrictions.le("loginTime", end))
				.addOrder(Order.desc("loginTime"));

		// 行锁：PESSIMISTIC_WRITE 等价于 SELECT ... FOR UPDATE
		criteria.setLockMode(org.hibernate.LockMode.PESSIMISTIC_WRITE);

		return criteria.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (!StringUtils.isNotEmpty(data))
				continue;

			if ("loginId".equals(field)) {
				query.add(query.getCriterion("loginId", data, op));
			} else if ("sourceIp".equals(field)) {
				query.add(query.getCriterion("sourceIp", data, op));
			} else if ("successFlag".equals(field)) {
				query.add(query.getCriterion("successFlag", Integer.parseInt(data), op));
			} else if ("loginTime".equals(field) && "between".equals(op)) {
				query.timeranges("loginTime", data);
			} else if ("loginTime".equals(field)) {
				query.add(query.getCriterion("loginTime", data, op));
			} else if ("operateType".equals(field)) {
				// Phase 8: 登录方式过滤
				query.add(query.getCriterion("operateType", data, op));
			} else if ("resultState".equals(field)) {
				// Phase 8: 结果状态过滤
				query.add(query.getCriterion("resultState", Short.valueOf(data), op));
			} else if ("companyId".equals(field)) {
				// Phase 8: 公司过滤
				query.add(query.getCriterion("companyId", Integer.valueOf(data), op));
			}
		}
	}

}
