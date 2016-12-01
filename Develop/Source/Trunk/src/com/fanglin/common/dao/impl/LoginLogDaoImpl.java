package com.fanglin.common.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Query;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.common.dao.LoginLogDao;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.LoginLogPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("loginLogDao")
public class LoginLogDaoImpl  extends DaoImpl<LoginLogPO> implements LoginLogDao  {

	@Override
	public List<LoginLogPO> getPageLoginLog(Paging paging, List<Filter> filters){
		
		PagingQuery<LoginLogPO> query = pagingQuery(paging, LoginLogPO.class);
		
		if(filters != null){
			for(Filter fv: filters){
				if("loginTime".equals(fv.getField())){
					if(StringUtils.isNotEmpty(fv.getData())){
						if("between".equals(fv.getOp())){
							
							String sTime = fv.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
				            String eTime = fv.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";

				            Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				            Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

				            Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				            Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
							query.add(query.getCriterion("loginTime", sTimestamp, "ge"));
							query.add(query.getCriterion("loginTime", eTimestamp, "le"));
						}
						else{
							query.add(query.getCriterion("loginTime", fv.getData(), fv.getOp()));
						}
					}
				}else if("loginId".equals(fv.getField())){
					if(StringUtils.isNotEmpty(fv.getData())){
						query.add(query.getCriterion("loginId",fv.getData(), fv.getOp()));
					}
				}else if("sourceIp".equals(fv.getField())){
					if(StringUtils.isNotEmpty(fv.getData())){
						query.add(query.getCriterion("sourceIp",fv.getData(), fv.getOp()));
					}
				}else if("successFlag".equals(fv.getField())){
					if(StringUtils.isNotEmpty(fv.getData())){
						query.add(query.getCriterion("successFlag",Integer.parseInt(fv.getData()), fv.getOp()));
					}
				}
				
			}
		}
		return query.desc("loginTime").list();
	}

	@Override
	public void delteBeforLoginTime(Timestamp beforeTime){

		 Query query = session().createQuery("delete LoginLogPO l where l.loginTime=?");
		 query.setTimestamp(0, beforeTime);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<LoginLogPO> getLoginLogByLoginIdAndStartEndTime(String loginId,Timestamp start, Timestamp end){
		
		return session().createCriteria(LoginLogPO.class)
				.add(Restrictions.eq("loginId", loginId))
				.add(Restrictions.ge("loginTime", start))
				.add(Restrictions.le("loginTime", end))
				.addOrder(Order.desc("loginTime")).list();
	}
	
}
