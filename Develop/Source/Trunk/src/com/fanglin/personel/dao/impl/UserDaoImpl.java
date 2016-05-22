package com.fanglin.personel.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
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
	public List<UserPO> pageUser(Paging paging, List<FilterVO> filters){
		
		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		queryFilterExcute(query, filters);
		
		query.add(Restrictions.ne("role.roleId", RolePO.SUPER_ROLEID_STR));
		query.asc("userId");
		
		return query.list();
	}
	
	@Override
	public List<UserPO> pageUserForNameByPinyinName(Paging paging, String pinyinName, Integer company){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		query.alias("role", "role");
		
		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.or(Restrictions.ilike("userName", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("userNamePinYin", pinyinName, MatchMode.ANYWHERE)));
		}
		
		if(company != null){
			query.add(Restrictions.eq("company", company));
		}
		
		query.add(Restrictions.eq("status", "在职"));
		query.add(Restrictions.ne("role.roleId", RolePO.SUPER_ROLEID_STR));
		
		return query.list();
	}
	
	@Override
	public List<UserPO> pageUserForNameByPinyinNameADuty(Paging paging, String pinyinName, String duty){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		query.alias("role", "role");
		
		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.or(Restrictions.ilike("userName", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("userNamePinYin", pinyinName, MatchMode.ANYWHERE)));
		}
		
		query.add(Restrictions.ilike("duty", duty, MatchMode.ANYWHERE));
		query.add(Restrictions.eq("status", "在职"));
		query.add(Restrictions.ne("role.roleId", RolePO.SUPER_ROLEID_STR));
		
		return query.list();
	}
	
	@Override
	public List<UserPO> pageUserForNameByPinyinNameADutys(Paging paging, String pinyinName, List<String> dutys){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		query.alias("role", "role");
		
		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.or(Restrictions.ilike("userName", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("userNamePinYin", pinyinName, MatchMode.ANYWHERE)));
		}

		for(String duty: dutys){
			query.add(Restrictions.ilike("duty", duty, MatchMode.ANYWHERE));
		}

		query.add(Restrictions.eq("status", "在职"));
		query.add(Restrictions.ne("role.roleId", RolePO.SUPER_ROLEID_STR));
		
		return query.list();
	}
	
	@Override
	public List<UserPO> pageUserForNameByPinyinNameADutyADeptId(Paging paging, String pinyinName, String duty, String deptId){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		query.alias("role", "role");
		query.add(Restrictions.eq("dept.deptId", deptId));

		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.or(Restrictions.ilike("userName", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("userNamePinYin", pinyinName, MatchMode.ANYWHERE)));
		}
		
		query.add(Restrictions.ilike("duty", duty, MatchMode.ANYWHERE));
		query.add(Restrictions.eq("status", "在职"));
		query.add(Restrictions.ne("role.roleId", RolePO.SUPER_ROLEID_STR));
		
		return query.list();
	}
	
	@Override
	public List<UserPO> pageUserForNameByPinyinNameADutysADeptId(Paging paging, String pinyinName, List<String> dutys, String deptId){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		query.alias("role", "role");
		query.add(Restrictions.eq("dept.deptId", deptId));

		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.or(Restrictions.ilike("userName", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("userNamePinYin", pinyinName, MatchMode.ANYWHERE)));
		}

		for(String duty : dutys){
			query.add(Restrictions.ilike("duty", duty, MatchMode.ANYWHERE));
		}

		query.add(Restrictions.eq("status", "在职"));
		query.add(Restrictions.ne("role.roleId", RolePO.SUPER_ROLEID_STR));
		
		return query.list();
	}
	
	@Override
	public List<UserPO> pageUserForNameByPinyinNameADutysAO(Paging paging, String pinyinName, List<String> dutysA, List<String> dutysO){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		query.alias("role", "role");
		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.or(Restrictions.ilike("userName", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("userNamePinYin", pinyinName, MatchMode.ANYWHERE)));
		}

		Criterion criterionA = null;

		if(dutysA != null){
			for(String duty: dutysA){
				if(criterionA == null){
					criterionA = Restrictions.ilike("duty", duty, MatchMode.ANYWHERE);
				} else {
					criterionA = Restrictions.and(Restrictions.ilike("duty", duty, MatchMode.ANYWHERE), criterionA);
				}
			}
		}

		Criterion criterionO = null;

		if(dutysO != null){
			for(String duty: dutysO){
				if(criterionO == null){
					criterionO = Restrictions.ilike("duty", duty, MatchMode.ANYWHERE);
				} else {
					criterionO = Restrictions.or(Restrictions.ilike("duty", duty, MatchMode.ANYWHERE), criterionO);
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
		query.add(Restrictions.ne("role.roleId", RolePO.SUPER_ROLEID_STR));
		return query.list();
	}
	
	@Override
	public List<UserPO> pageUserForNameByPinyinNameADutysAODeptId(Paging paging, String pinyinName, List<String> dutysA, List<String> dutysO, String deptId){

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		query.alias("role", "role");
		query.add(Restrictions.eq("dept.deptId", deptId));

		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.or(Restrictions.ilike("userName", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("userNamePinYin", pinyinName, MatchMode.ANYWHERE)));
		}

		Criterion criterionA = null;

		if(dutysA != null){
			for(String duty : dutysA){
				if(criterionA == null){
					criterionA = Restrictions.ilike("duty", duty, MatchMode.ANYWHERE);
				} else {
					criterionA = Restrictions.and(Restrictions.ilike("duty", duty, MatchMode.ANYWHERE), criterionA);
				}
			}
		}

		Criterion criterionO = null;

		if(dutysO != null){
			for(String duty : dutysO){
				if(criterionO == null){
					criterionO = Restrictions.ilike("duty", duty, MatchMode.ANYWHERE);
				} else {
					criterionO = Restrictions.or(Restrictions.ilike("duty", duty, MatchMode.ANYWHERE), criterionO);
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
		query.add(Restrictions.ne("role.roleId", RolePO.SUPER_ROLEID_STR));
		return query.list();
	}
	
	@Override
	public List<UserPO> pageUserForWorking(Paging paging, List<FilterVO> filters){
		
		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);
		
		queryFilterExcute(query, filters);
		
		query.add(Restrictions.eq("status", "在职"));
		
		return query.list();
	}
	
	@Override
	public UserPO queryUserByLoginId(String loginId){
		return (UserPO) createCriteria(UserPO.class).add(Restrictions.eq("loginId", loginId)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByDeptIdADuty(String deptId, String duty){
		return createCriteria(UserPO.class).add(Restrictions.eq("duty", duty)).add(Restrictions.eq("dept.deptId", deptId)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByDutys(List<String> dutys){

		Criteria query = session().createCriteria(UserPO.class);
		
		query.createAlias("role", "role");
		
		for(String duty : dutys){
			query.add(Restrictions.ilike("duty", duty, MatchMode.ANYWHERE));
		}

		query.add(Restrictions.eq("status", "在职"));
		query.add(Restrictions.ne("role.roleId", RolePO.SUPER_ROLEID_STR));
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByUserName(String userName){
		return session().createCriteria(UserPO.class).add(Restrictions.ilike("userName", userName, MatchMode.ANYWHERE)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserPO> queryUserByUserIds(List<String> userIds) {
		return session().createCriteria(UserPO.class).add(Restrictions.in("userId", userIds)).list();
	}
	
	@Override
	public UserPO queryUserByOldUserId(String oldUserId){
	    return (UserPO) createCriteria(UserPO.class).add(Restrictions.eq("oldUserId", oldUserId)).uniqueResult();
	}
	
	@Override
	public void resetPassword(String userId, String password){
		String sql = "update communion.user set password = :password where userId = :userId";
		SQLQuery query = session().createSQLQuery(sql);
		
		query.setString("password", password).setString("userId", userId).executeUpdate();
	}

	@Override
	public int countUserByRoleId(String roleId){
		String sql = "select count(userId) from communion.user where roleId = :roleId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("roleId", roleId).uniqueResult();
		
		return count.intValue();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		if(filters != null){
			query.alias("dept", "dept");
			query.alias("role", "role");
			
			for(FilterVO filter: filters){
				
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
				}else if("company".equals(field)){
					query.add(query.getCriterion("company", Integer.valueOf(filter.getData()), filter.getOp()));
				}
			}
		}
	}
}
