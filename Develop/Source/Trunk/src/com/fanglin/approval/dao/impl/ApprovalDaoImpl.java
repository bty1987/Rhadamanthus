/**
 * @File Name		: ApprovalDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("approvalDao")
public class ApprovalDaoImpl extends DaoImpl<ApprovalPO> implements ApprovalDao {

	public ApprovalDaoImpl(){
		super(ApprovalPO.class);
	}

	@Override
	public List<ApprovalPO> pageApprovalByReceiveId(Paging paging, List<Filter> filters, String userId,int company) {
		
		PagingQuery<ApprovalPO> query = pagingQuery(paging, ApprovalPO.class);
		
		query.alias("receiver", "receiver");
		query.add(Restrictions.eq("receiver.userId", userId));
		query.add(Restrictions.eq("company", company));
		
		if(filters != null){
			approvalQuery(filters, query);
		}
		
		query.asc("status");
		query.desc("createTime");
		
		return query.list();
	}

	@Override
	public List<ApprovalPO> pageApprovalBySenderId(Paging paging, List<Filter> filters, String userId,int company) {
		
		PagingQuery<ApprovalPO> query = pagingQuery(paging, ApprovalPO.class);
		
		query.alias("sender", "sender");
		query.add(Restrictions.eq("sender.userId", userId));
		query.add(Restrictions.eq("company", company));
		
		if(filters != null){
			approvalQuery(filters, query);
		}
		
		query.asc("status");
		query.desc("createTime");
		
		return query.list();
	}	
	

	public void approvalQuery( List<Filter> filters,PagingQuery<ApprovalPO> query){

		for(Filter filter: filters){
			if("status".equals(filter.getField())){
				query.add(query.getCriterion("status", Short.valueOf(filter.getData()), filter.getOp()));
			}else if("type".equals(filter.getField())){
				query.add(query.getCriterion("type", Short.valueOf(filter.getData()), filter.getOp()));
			}else if("userName".equals(filter.getField())){
				query.alias("sender", "sender");
				query.add(query.getCriterion("sender.currentName", filter));
			}else if("receiverName".equals(filter.getField())){
				query.alias("receiver", "receiver");
				query.add(query.getCriterion("receiver.currentName", filter));
			}else if("dateRange".equals(filter.getField())){
				String sTime = filter.getData().split("-")[0].replaceAll("/", "-");
				String eTime = filter.getData().split("-")[1].replaceAll("/", "-");
				query.add(query.getCriterion("createTime", eTime, "le"));
				query.add(query.getCriterion("createTime", sTime, "ge"));
			}else if("dateRange".equals(filter.getField())){
				String sTime = filter.getData().split("-")[0].replaceAll("/", "-");
				String eTime = filter.getData().split("-")[1].replaceAll("/", "-");
				query.add(query.getCriterion("createTime", eTime, "le"));
				query.add(query.getCriterion("createTime", sTime, "ge"));
			}else if(ApprovalPO.COLUMN_CREATETIME_STR.equals(filter.getField())){
				String data = filter.getData();
				
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(ApprovalPO.COLUMN_CREATETIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(ApprovalPO.COLUMN_CREATETIME_STR, sTimestamp, "ge"));
			}else if(ApprovalPO.COLUMN_APPROVALTIME_STR.equals(filter.getField())){
				String data = filter.getData();
				
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(ApprovalPO.COLUMN_APPROVALTIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(ApprovalPO.COLUMN_APPROVALTIME_STR, sTimestamp, "ge"));
			}
		}
	
	}
	
//	通过类型识别初始化查询审批
	@Override
	public ApprovalPO queryApprovalForInitByTypeAIdent(short type, String ident) {
		return (ApprovalPO) session().createCriteria(ApprovalPO.class).add(Restrictions.eq(ApprovalPO.COLUMN_TYPE_STR, type))
				.add(Restrictions.eq(ApprovalPO.COLUMN_IDENT_STR, ident))
				.add(Restrictions.eq(ApprovalPO.COLUMN_STATUS_STR, ApprovalPO.APPROVAL_STATUS_INIT_INT))
				.uniqueResult();
	}

	@Override
	public int countApprovalForInitByIdent(String ident) {
		
		String sql = "select count(*) from approval.approval where ident = :ident and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("ident", ident).uniqueResult();
		
		return count.intValue();
	}
	
}
