/**
 * Title: UserSalaryDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.salary.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.dao.UserSalaryDao;
import com.fanglin.salary.po.UserSalaryPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("userSalaryDao")
public class UserSalaryDaoImpl extends DaoImpl<UserSalaryPO> implements UserSalaryDao {
	
	public UserSalaryDaoImpl(){
		super(UserSalaryPO.class);
	}
	
	@Override
	public List<UserSalaryPO> pageUserSalary(Paging paging,  List<FilterVO> filters){
		PagingQuery<UserSalaryPO> query = pagingQuery(paging, UserSalaryPO.class);
		
		queryFilterExcute(query, filters);
		
		query.desc("createTime");
		
		return query.list();
	}

	@Override
	public List<UserSalaryPO> pageUserSalaryByUserId(Paging paging, String userId){
		PagingQuery<UserSalaryPO> query = pagingQuery(paging, UserSalaryPO.class);
		
		if(StringUtils.isNotEmpty(userId)){
			query.add(Restrictions.eq("userId", userId));
		}
		
		query.desc("createTime");
		
		return query.list();
	}
	
	@Override
	public int paySalary(String userId,String createTimeBetween,String dealUserId){
	
		
		String sTime = createTimeBetween.split("-")[0].replaceAll("/", "-") + " 00:00:00";
        String eTime = createTimeBetween.split("-")[1].replaceAll("/", "-") + " 23:59:59";

        Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
        Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

        Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
        Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
		
		String sql = "update platform.usersalary s set s.status=1, s.dealTime=:dealTime, s.dealUserId=:dealUserId where s.userId=:userId and s.createTime>=:sTimestamp and s.createTime<=:eTimestamp";
		
		int res = session().createSQLQuery(sql).setDate("dealTime", DateUtil.getDateToTimestamp(new Date())).setString("dealUserId", dealUserId).setString("userId", userId).setDate("sTimestamp", sTimestamp).setDate("eTimestamp", eTimestamp).executeUpdate();
		
		return res;
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		if(filters!=null){
			for(FilterVO filter: filters){
				query.alias("userPO", "user");
				
				if("userId".equals(filter.getField())){
					query.add(query.getCriterion("user.userId", (filter.getData()), filter.getOp()));
				}else if("userName".equals(filter.getField())){
					query.add(query.getCriterion("user.userName", (filter.getData()), filter.getOp()));
				}else if("deptType".equals(filter.getField())){
					query.add(query.getCriterion("user.deptType", (filter.getData()), filter.getOp()));
		        }else if("deptId".equals(filter.getField())){
		        	query.alias("user.dept", "dept");
					query.add(query.getCriterion("dept.deptId", (filter.getData()), filter.getOp()));
				}else if("userSalaryDateRange".equals(filter.getField())){
		            String sTime = filter.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
		            String eTime = filter.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";

		            Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
		            Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

		            Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
		            Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

		            query.add(query.getCriterion("createTime", eTimestamp, "le"));
		            query.add(query.getCriterion("createTime", sTimestamp, "ge"));
		        }else{
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}
			}
		}
	}
}
