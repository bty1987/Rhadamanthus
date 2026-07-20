/**
 * @File Name		: UserInfoDaoImpl.java
 * @Package   	: com.fanglin.personel.dao.impl
 * @Version		: 1.0
 * @Date			: 2017-6-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.Paging;

@Repository("userInfoDao")
public class UserInfoDaoImpl extends DaoImpl<UserInfoPO> implements UserInfoDao {
	
	public UserInfoDaoImpl(){
		super(UserInfoPO.class);
	}

	@Override
	public List<UserInfoPO> pageUserInfo(Paging paging, List<Filter> filters, Integer company) {
		
		PagingQuery<UserInfoPO> query = pagingQuery(paging, UserInfoPO.class);

		query.alias("user", "user");
		
		query.add(Restrictions.eq("user.company", company));
		
		query.add(Restrictions.eq("user.type", UserPO.TYPE_USER_INT));

		queryFilterExcute(query, filters);
		
		query.alias("user.role", "role");

		query.add(Restrictions.ne("role.no", RolePO.SUPER_NO_STR));

		query.asc("user.userId");

		return query.list();
	}
	
	@Override
	public UserInfoPO queryUserInfoByUserId(String userId) {
		return (UserInfoPO) session().createCriteria(UserInfoPO.class).createAlias("user", "user").add(Restrictions.eq("user.userId", userId)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		query.alias("user", "user");
		query.alias("user.dept", "dept");
		query.alias("user.role", "role");
		query.alias("user.duty", "duty");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("userId".equals(field)) {
				query.add(query.getCriterion("user.userId", filter));
			} else if ("userName".equals(field)) {
				query.add(query.getCriterion("user.userName", filter));
			} else if ("roleId".equals(field)) {
				query.add(Restrictions.eq("role.rid", Integer.valueOf(data)));
			} else if ("deptId".equals(field)) {
				query.add(Restrictions.eq("dept.did", Integer.valueOf(data)));
			} else if ("status".equals(field)) {
				query.add(Restrictions.eq("user.status", Short.valueOf(data)));
			} else if ("duty.name".equals(field)) {
				query.add(query.getCriterion("duty.name", filter));
			} else if ("identity".equals(field)) {
				query.add(query.getCriterion("user.identity", filter));
			} else if ("phone".equals(field)) {
				query.add(query.getCriterion("user.phone", filter));
			} else if ("no".equals(field)) {
				query.add(Restrictions.eq("dept.no", data));
			} else if ("deptType".equals(field)) {
				query.add(Restrictions.eq("dept.type.dtid", Integer.valueOf(data)));
			} else if ("level".equals(field)) {
				query.add(Restrictions.eq("level", Short.valueOf(data)));
			}
		}
	}
}
