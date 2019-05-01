package com.fanglin.personel.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.po.DutyPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("userDao")
public class UserDaoImpl extends DaoImpl<UserPO> implements UserDao {

	public UserDaoImpl() {
		super(UserPO.class);
	}

	@Override
	public List<UserPO> pageUser(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);

		query.alias("role", "role");

		queryFilterExcute(query, filters);

		query.add(Restrictions.eq("company", company));
		query.add(Restrictions.ne("role.no", RolePO.SUPER_NO_STR));

		query.asc("userId");

		return query.list();
	}

	@Override
	public UserPO queryUserByLoginId(String loginId) {
		return (UserPO) createCriteria(UserPO.class).add(Restrictions.eq("loginId", loginId)).uniqueResult();
	}

	@Override
	public UserPO queryUserByUserId(String userId) {
		return (UserPO) session().createCriteria(UserPO.class).add(Restrictions.eq("userId", userId)).uniqueResult();
	}

	@Override
	public UserPO queryUserByOldUserId(String oldUserId) {
		return (UserPO) createCriteria(UserPO.class).add(Restrictions.eq("oldUserId", oldUserId)).uniqueResult();
	}

	@Override
	public List<UserPO> pageUserForNameByPinyinName(Paging paging, String pinyinName, Short status, Integer dtid, Integer company) {

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);

		query.alias("role", "role");
		
		if (StringUtils.isNotEmpty(pinyinName)) {
			
		    Disjunction pinyinDisjunction = Restrictions.disjunction();

		    pinyinDisjunction.add(Restrictions.like("currentName", pinyinName, MatchMode.ANYWHERE));
		    pinyinDisjunction.add(Restrictions.like("pinYin", pinyinName, MatchMode.ANYWHERE));
		    pinyinDisjunction.add(Restrictions.like("userId", pinyinName, MatchMode.ANYWHERE));

		    query.add(pinyinDisjunction);
		}

		query.add(Restrictions.ne("role.no", RolePO.SUPER_NO_STR));

		if (dtid != 0) {
			query.add(Restrictions.eq("dtid", dtid));
		}

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.add(Restrictions.eq("company", company));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByPhoneAIdent(String phone, String ident) {

		return session().createCriteria(UserPO.class).add(Restrictions.or(Restrictions.eq("phone", phone), Restrictions.eq("identity", ident))).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByDeptIdADuty(String deptId, String duty) {

		DutyPO dutyPO = (DutyPO) session().createCriteria(DutyPO.class).add(Restrictions.eq(DutyPO.COLUMN_NAME_STR, duty)).uniqueResult();

		String sql = "select * from communion.user  where deptId= :deptId and did= :did";

		List<UserPO> userPOs = session().createSQLQuery(sql).addEntity(UserPO.class).setString("deptId", deptId).setLong("did", dutyPO.getDid()).list();

		return userPOs;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByUserName(String userName) {
		return session().createCriteria(UserPO.class).add(Restrictions.like("currentName", userName, MatchMode.START)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByUserIds(List<String> userIds) {
		return session().createCriteria(UserPO.class).add(Restrictions.in("userId", userIds)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByUids(List<Integer> uids) {
		return session().createCriteria(UserPO.class).add(Restrictions.in("uid", uids)).list();
	}

	@Override
	public int countUserByCompany(int company) {

		String sql = "select count(*) from communion.user where company = :company";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countUserByRoleId(Integer rid) {

		String sql = "select count(*) from communion.user where roleId = :roleId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("roleId", rid).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			
			query.alias("dept", "dept");
			query.alias("role", "role");
			query.alias("duty", "duty");
			
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();

				if ("userId".equals(field)) {
					query.add(query.getCriterion("userId", filter));
				} else if ("userName".equals(field)) {
					query.add(query.getCriterion("userId", filter));
				} else if ("roleId".equals(field)) {
					query.add(Restrictions.eq("role.rid", Integer.valueOf(data)));
				} else if ("deptId".equals(field)) {
					query.add(query.getCriterion("dept.no", filter));
				} else if ("status".equals(field)) {
					query.add(Restrictions.eq("status", Short.valueOf(data)));
				} else if ("duty.name".equals(field)) {
					query.add(query.getCriterion("duty.name", filter));
				} else if ("identity".equals(field)) {
					query.add(query.getCriterion("identity", filter));
				} else if ("phone".equals(field)) {
					query.add(query.getCriterion("phone", filter));
				} else if ("deptType".equals(field)) {
					query.add(Restrictions.eq("dtid", Integer.valueOf(data)));
				}
			}
		}
	}

}
