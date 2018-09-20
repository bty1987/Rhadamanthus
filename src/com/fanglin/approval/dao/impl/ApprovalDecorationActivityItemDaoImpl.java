/**
 * @File Name		: ApprovalDecorationActivityItemDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalDecorationActivityItemDao;
import com.fanglin.approval.po.ApprovalDecorationActivityItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationActivityItemDao")
public class ApprovalDecorationActivityItemDaoImpl extends DaoImpl<ApprovalDecorationActivityItemPO> implements ApprovalDecorationActivityItemDao {
	
	public ApprovalDecorationActivityItemDaoImpl(){
		super(ApprovalDecorationActivityItemPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ApprovalDecorationActivityItemPO> queryApprovalDecorationActivityItemByAaId(long adaId) {
		return session().createCriteria(ApprovalDecorationActivityItemPO.class).add(Restrictions.eq(ApprovalDecorationActivityItemPO.COLUMN_AAID_STR, adaId)).list();
	}
	

}
