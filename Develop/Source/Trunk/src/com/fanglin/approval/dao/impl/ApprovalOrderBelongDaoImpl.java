/**
 * @File Name		: ApprovalOrderBelongDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalOrderBelongDao;
import com.fanglin.approval.po.ApprovalOrderBelongPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalOrderBelongDao")
public class ApprovalOrderBelongDaoImpl extends DaoImpl<ApprovalOrderBelongPO> implements ApprovalOrderBelongDao {

	public ApprovalOrderBelongDaoImpl(){
		super(ApprovalOrderBelongPO.class);
	}

	@Override
	public ApprovalOrderBelongPO queryApprovalOrderBelongByAId(int aId) {
		return (ApprovalOrderBelongPO) session().createCriteria(ApprovalOrderBelongPO.class).add(Restrictions.eq(ApprovalOrderBelongPO.COLUMN_AID_STR, aId)).uniqueResult();
	}
	
}
