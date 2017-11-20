package com.fanglin.personel.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Hibernate;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.Paging;

@Repository("userDao")
public class UserDaoImpl extends DaoImpl<UserPO> implements UserDao {

	public UserDaoImpl(){
		super(UserPO.class);
	}

	@Override
	public List<UserPO> pageUser(Paging paging, List<Filter> filters,Integer company){
		
		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		queryFilterExcute(query, filters);
		
		query.add(Restrictions.eq("company", company));
		
		query.add(Restrictions.ne("role.roleId", RolePO.SUPER_ROLEID_STR));
		
		query.asc("userId");
	
		return query.list();
	}
	
	@Override
	public UserPO queryUserByLoginId(String loginId){
		return (UserPO) createCriteria(UserPO.class).add(Restrictions.eq("loginId", loginId)).uniqueResult();
	}
	
	@Override
	public UserPO queryUserByUserId(String userId){
		 return (UserPO) createCriteria(UserPO.class).add(Restrictions.eq("userId",userId)).uniqueResult();
	}
		
	@Override
	public UserPO queryUserByOldUserId(String oldUserId){
	    return (UserPO) createCriteria(UserPO.class).add(Restrictions.eq("oldUserId", oldUserId)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("deprecation")
	public List<UserPO> pageUserForNameByPinyinName(Paging paging, String pinyinName, Integer company){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		query.add(Restrictions.eq("company", company));
		
		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.or(Restrictions.like("userName", pinyinName, MatchMode.START), Restrictions.like("userNamePinYin", pinyinName, MatchMode.START)));
		}
		
		query.add(Restrictions.eq("status", "在职"));
		
		query.add(Restrictions.sqlRestriction("roleId <> ?", RolePO.SUPER_ROLEID_STR, Hibernate.STRING));
	
		return query.list();

	}
	
	@Override
	@SuppressWarnings("deprecation")
	public List<UserPO> pageUserForNameByPinyinNameADuty(Paging paging, String pinyinName, String duty){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		query.alias("duty", "duty");
		
		if(StringUtils.isNotEmpty(pinyinName)){
			
			query.add(Restrictions.or(Restrictions.like("userName", pinyinName, MatchMode.START), Restrictions.like("userNamePinYin", pinyinName, MatchMode.START)));
				
		}

		query.add(Restrictions.ilike("duty.name", duty, MatchMode.ANYWHERE));
		
		query.add(Restrictions.eq("status", "在职"));
		
		query.add(Restrictions.sqlRestriction("roleId <> ?", RolePO.SUPER_ROLEID_STR, Hibernate.STRING));

		return query.list();
	}
	
	@Override
	@SuppressWarnings("deprecation")
	public List<UserPO> pageUserForNameByPinyinNameADutysAO(Paging paging, String pinyinName, List<String> dutysA, List<String> dutysO){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		query.alias("duty", "duty");
		
		if(StringUtils.isNotEmpty(pinyinName)){
			
			query.add(Restrictions.or(Restrictions.like("userName", pinyinName, MatchMode.START), Restrictions.like("userNamePinYin", pinyinName, MatchMode.START)));
		
		}
		
		Criterion criterionA = null;

		if(dutysA != null){
			for(String duty: dutysA){
				if(criterionA == null){
					criterionA = Restrictions.ilike("duty.name", duty, MatchMode.ANYWHERE);
				} else {
					criterionA = Restrictions.and(Restrictions.ilike("duty.name", duty, MatchMode.ANYWHERE), criterionA);
				}
			}
		}

		Criterion criterionO = null;

		if(dutysO != null){
			for(String duty: dutysO){
				if(criterionO == null){
					criterionO = Restrictions.ilike("duty.name", duty, MatchMode.ANYWHERE);
				} else {
					criterionO = Restrictions.or(Restrictions.ilike("duty.name", duty, MatchMode.ANYWHERE), criterionO);
				}
			}
		}

		if(criterionA != null){
			query.add(criterionA);
		}

		if(criterionO != null){
			query.add(criterionO);
		}
	
		query.add(Restrictions.eq("status", "在职"));
		
		query.add(Restrictions.sqlRestriction("roleId <> ?", RolePO.SUPER_ROLEID_STR, Hibernate.STRING));
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByPhoneAIdent(String phone, String ident) {
		
		return session().createCriteria(UserPO.class).add(Restrictions.or(Restrictions.eq("phone", phone),Restrictions.eq("identity", ident))).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByDeptIdADuty(String deptId, String duty){
		
		String sql="select * from communion.user ,communion.duty where uid= :uid and duty.name= :duty";
		List<UserPO>  userPOs = session().createSQLQuery(sql).setString("deptId", deptId).setString("duty.name", duty).list();
		
		return userPOs;
		}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByUserName(String userName){
		return session().createCriteria(UserPO.class).add(Restrictions.like("userName", userName, MatchMode.START)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByUserIds(List<String> userIds) {
		return session().createCriteria(UserPO.class).add(Restrictions.in("userId", userIds)).list();
	}

	@Override
	public int countUserByRoleId(String roleId){
		String sql = "select count(*) from communion.user where roleId = :roleId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("roleId", roleId).uniqueResult();
		
		return count.intValue();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			query.alias("dept", "dept");
			query.alias("role", "role");
			query.alias("duty", "duty");
			for(Filter filter: filters){
				
				String field = filter.getField();
				
				if("userId".equals(field)){
					query.add(query.getCriterion("userId", filter));
				}else if("userName".equals(field)){
					query.add(query.getCriterion("currentName", filter));
				}else if("roleId".equals(field)){
					query.add(query.getCriterion("role.roleId", filter));
				}else if("dtid".equals(field)){
					query.add(query.getCriterion("dtid", filter));
				}else if("deptId".equals(field)){
					query.add(query.getCriterion("dept.deptId", filter));
				}else if("status".equals(field)){
					query.add(query.getCriterion("status", filter));
				}else if("duty".equals(field)){
					query.add(query.getCriterion("duty.did", filter));
				}else if("identity".equals(field)){
					query.add(query.getCriterion("identity", filter));
				}
			}
		}
	}
	
}
