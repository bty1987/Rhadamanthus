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
		
		if(StringUtils.isNotEmpty(pinyinName)){
			
			query.add(Restrictions.or(Restrictions.like("userName", pinyinName, MatchMode.START), Restrictions.like("userNamePinYin", pinyinName, MatchMode.START)));
				
		}

		query.add(Restrictions.like("duty", duty, MatchMode.START));
		
		query.add(Restrictions.eq("status", "在职"));
		
		query.add(Restrictions.sqlRestriction("roleId <> ?", RolePO.SUPER_ROLEID_STR, Hibernate.STRING));
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("deprecation")
	public List<UserPO> pageUserForNameByPinyinNameADutysAO(Paging paging, String pinyinName, List<String> dutysA, List<String> dutysO){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		if(StringUtils.isNotEmpty(pinyinName)){
			
			query.add(Restrictions.or(Restrictions.like("userName", pinyinName, MatchMode.START), Restrictions.like("userNamePinYin", pinyinName, MatchMode.START)));
		
		}
		
		Criterion criterionA = null;

		if(dutysA != null){
			for(String duty: dutysA){
				if(criterionA == null){
					criterionA = Restrictions.like("duty", duty, MatchMode.START);
				} else {
					criterionA = Restrictions.and(Restrictions.like("duty", duty, MatchMode.START), criterionA);
				}
			}
		}

		Criterion criterionO = null;

		if(dutysO != null){
			for(String duty: dutysO){
				if(criterionO == null){
					criterionO = Restrictions.like("duty", duty, MatchMode.START);
				} else {
					criterionO = Restrictions.or(Restrictions.like("duty", duty, MatchMode.START), criterionO);
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
		return createCriteria(UserPO.class).add(Restrictions.eq("duty", duty)).add(Restrictions.eq("dept.deptId", deptId)).list();
	}
	
	@Override
	public List<UserPO> pageUserForWorking(Paging paging, List<Filter> filters,Integer company){
		
		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		queryFilterExcute(query, filters);
		
		query.add(Restrictions.eq("company", company));
		
		query.add(Restrictions.eq("status", "在职"));
		
		return query.list();
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
			
			for(Filter filter: filters){
				
				String field = filter.getField();
				
				if("userId".equals(field)){
					query.add(query.getCriterion("userId", filter));
				}else if("userName".equals(field)){
					query.add(query.getCriterion("currentName", filter));
				}else if("roleId".equals(field)){
					query.add(query.getCriterion("role.roleId", filter));
				}else if("deptType".equals(field)){
					query.add(query.getCriterion("dept.type", filter));
				}else if("deptId".equals(field)){
					query.add(query.getCriterion("dept.deptId", filter));
				}else if("status".equals(field)){
					query.add(query.getCriterion("status", filter));
				}else if("duty".equals(field)){
					query.add(query.getCriterion("duty", filter));
				}else if("identity".equals(field)){
					query.add(query.getCriterion("identity", filter));
				}
			}
		}
	}
	
}
