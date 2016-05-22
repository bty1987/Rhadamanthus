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

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

@Repository("approvalDao")
public class ApprovalDaoImpl extends DaoImpl<ApprovalPO> implements ApprovalDao {

	public ApprovalDaoImpl(){
		super(ApprovalPO.class);
	}

	@Override
	public List<ApprovalPO> pageApprovalByReceiveId(Paging paging, List<FilterVO> filters, String userId) {
		
		PagingQuery<ApprovalPO> query = pagingQuery(paging, ApprovalPO.class);
		
		query.alias("receiver", "receiver");
		query.add(Restrictions.eq("receiver.userId", userId));
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("status".equals(filter.getField())){
					query.add(query.getCriterion("status", Short.valueOf(filter.getData()), filter.getOp()));
				}else if("type".equals(filter.getField())){
					query.add(query.getCriterion("type", Short.valueOf(filter.getData()), filter.getOp()));
				}else if("sender".equals(filter.getField())){
					query.alias("sender", "sender");
					query.add(query.getCriterion("sender.currentName", filter));
				}else if("dateRange".equals(filter.getField())){
					String sTime = filter.getData().split("-")[0].replaceAll("/", "-");
					String eTime = filter.getData().split("-")[1].replaceAll("/", "-");
					query.add(query.getCriterion("createTime", eTime, "le"));
					query.add(query.getCriterion("createTime", sTime, "ge"));
				}
			}
		}
		
		query.asc("status");
		query.desc("createTime");
		
		return query.list();
	}

	@Override
	public ApprovalPO queryApprovalForInitByTypeAIdent(short type, String ident) {
		return (ApprovalPO) session().createCriteria(ApprovalPO.class).add(Restrictions.eq(ApprovalPO.COLUMN_TYPE_STR, type))
				.add(Restrictions.eq(ApprovalPO.COLUMN_IDENT_STR, ident))
				.add(Restrictions.eq(ApprovalPO.COLUMN_STATUS_STR, ApprovalPO.APPROVAL_STATUS_INIT_INT))
				.uniqueResult();
	}
	
}
