package com.fanglin.personel.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.Paging;

@Repository("userDao")
public class UserDaoImpl extends DaoImpl<UserPO> implements UserDao {

	public UserDaoImpl() {
		super(UserPO.class);
	}

	@Override
	public List<UserPO> pageUser(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);

		query.add(Restrictions.eq("company", company));
		query.add(Restrictions.eq("type", UserPO.TYPE_USER_INT));

		query.alias("role", "role");

		queryFilterExcute(query, filters);

		query.add(Restrictions.ne("role.no", RolePO.SUPER_NO_STR));

		query.asc("userId");

		return query.list();
	}

	@Override
	public List<UserPO> pageUserByPinyin(Paging paging, String pinyin, Short status, Integer company, Integer dtid) {

		pageUserByPinyin(paging, pinyin, status, company, dtid, null, null);

		return null;
	}

	@Override
	public List<UserPO> pageUserByPinyin(Paging paging, String pinyin, Short status, Integer company, Integer dtid, Integer did, Integer rid) {

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);

		if (company != null) {
			query.add(Restrictions.eq("company", company));
		}

		query.add(Restrictions.eq("type", UserPO.TYPE_USER_INT));

		query.alias("role", "role");
		query.alias("dept", "dept");
		query.alias("dept.type", "dept.type");

		if (StringUtils.isNotEmpty(pinyin)) {

			Disjunction disjunction = Restrictions.disjunction();

			disjunction.add(Restrictions.like("currentName", pinyin, MatchMode.ANYWHERE));
			disjunction.add(Restrictions.like("pinYin", pinyin, MatchMode.ANYWHERE));
			disjunction.add(Restrictions.like("userId", pinyin, MatchMode.ANYWHERE));

			query.add(disjunction);
		}

		query.add(Restrictions.ne("role.no", RolePO.SUPER_NO_STR));

		if (dtid != 0) {
			query.add(Restrictions.eq("dept.type.dtid", dtid));
		}

		if (did != null) {
			query.add(Restrictions.eq("dept.did", did));
		}

		if (rid != null) {
			query.alias("dept.fatherDept", "fatherDept").add(Restrictions.eq("fatherDept.did", rid));
		}

		if (status != 3) {
			query.add(Restrictions.eq("status", status));
		}

		return query.list();
	}

	@Override
	public List<UserPO> pageUserByMid(Paging paging, List<Filter> filters, Integer mid, Integer company) {

		String sql = queryFilterExcute(mid, company, filters);

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);

		return query.list("*", "select * ", sql, "");
	}

	@Override
	public UserPO queryUserByLoginId(String loginId) {
		return (UserPO) createCriteria(UserPO.class).add(Restrictions.or(Restrictions.eq("loginId", loginId), Restrictions.eq("userId", loginId))).setMaxResults(1).uniqueResult();
	}

	@Override
	public UserPO queryUserByUserId(String userId) {
		return (UserPO) session().createCriteria(UserPO.class).add(Restrictions.eq("userId", userId)).setMaxResults(1).uniqueResult();
	}

	@Override
	public UserPO queryUserByOldUserId(String oldUserId) {
		return (UserPO) createCriteria(UserPO.class).add(Restrictions.eq("oldUserId", oldUserId)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByPhoneAIdent(String phone, String ident) {
		return session().createCriteria(UserPO.class).add(Restrictions.or(Restrictions.in("phone", SensitiveDataHelper.getAllEncryptedForms(phone)), Restrictions.in("identity", SensitiveDataHelper.getAllEncryptedForms(ident)))).add(Restrictions.eq("type", UserPO.TYPE_USER_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByUserName(String userName) {
		return session().createCriteria(UserPO.class).add(Restrictions.like("currentName", userName, MatchMode.START)).add(Restrictions.eq("type", UserPO.TYPE_USER_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByUserIds(List<String> userIds) {
		return session().createCriteria(UserPO.class).add(Restrictions.in("userId", userIds)).add(Restrictions.eq("type", UserPO.TYPE_USER_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByUids(List<Integer> uids) {
		return session().createCriteria(UserPO.class).add(Restrictions.in("uid", uids)).add(Restrictions.eq("type", UserPO.TYPE_USER_INT)).list();
	}

	@Override
	public int countUserByCompany(int company) {

		String sql = "select count(*) from communion.user where company = :company and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).setShort("type", UserPO.TYPE_USER_INT).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countUserByRoleId(Integer rid) {

		String sql = "select count(*) from communion.user where roleId = :roleId and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("roleId", rid).setShort("type", UserPO.TYPE_USER_INT).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countUserByDid(Integer deptId, Long did, Integer company) {

		String sql = "select count(*) from communion.user where deptId =:deptId and did = :did and company = :company and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("deptId", deptId).setLong("did", did).setInteger("company", company).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countUserByDeptId(Integer deptId) {

		String sql = "select count(*) from communion.user where deptId =:deptId and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("deptId", deptId).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("dept", "dept");
		query.alias("role", "role");
		query.alias("duty", "duty");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("userId".equals(field)) {
				query.add(query.getCriterion("userId", filter));
			} else if ("userName".equals(field)) {
				query.add(query.getCriterion("userName", filter));
			} else if ("roleId".equals(field)) {
				query.add(Restrictions.eq("role.rid", Integer.valueOf(data)));
			} else if ("deptId".equals(field)) {
				query.add(Restrictions.eq("dept.did", Integer.valueOf(data)));
			} else if ("status".equals(field)) {
				query.add(Restrictions.eq("status", Short.valueOf(data)));
			} else if ("duty.name".equals(field)) {
				query.add(query.getCriterion("duty.name", filter));
			} else if ("identity".equals(field)) {
				query.add(query.getCriterion("identity", filter));
			} else if ("phone".equals(field)) {
				query.add(query.getCriterion("phone", filter));
			} else if ("no".equals(field)) {
				query.add(Restrictions.eq("dept.no", data));
			} else if ("deptType".equals(field)) {
				query.add(Restrictions.eq("dept.type.dtid", Integer.valueOf(data)));
			}
		}
	}

	private String queryFilterExcute(Integer mid, Integer company, List<Filter> filters) {

		StringBuffer select = new StringBuffer("SELECT u.*");
		StringBuffer from = new StringBuffer(" FROM communion.user u");
		StringBuffer where = new StringBuffer();

		from.append(" LEFT JOIN communion.role r ON u.roleId = r.rid");
		from.append(" LEFT JOIN communion.rolemodule rm ON r.rid = rm.rid");

		where.append(String.format(" WHERE rm.mid = '%s'", mid));
		where.append(String.format(" AND u.company = '%s'", company));

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("userId".equals(field)) {
				where.append(String.format(" AND u.userId like '%%%s%%'", data));
			} else if ("userName".equals(field)) {
				where.append(String.format(" AND u.userName like '%%%s%%'", data));
			} else if ("phone".equals(field)) {
				where.append(String.format(" AND u.phone like '%%%s%%'", data));
			} else if ("roleId".equals(field)) {
				where.append(String.format(" AND roleId like '%%%s%%'", data));
			} else if ("identity".equals(field)) {
				where.append(String.format(" AND identity like '%%%s%%'", data));
			}
		}

		return String.format(" FROM ( %s %s %s GROUP BY u.uid, r.rid) m", select.toString(), from.toString(), where.toString());
	}
}
