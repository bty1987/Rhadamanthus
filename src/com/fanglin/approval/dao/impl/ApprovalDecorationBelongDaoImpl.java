/**
 * @File Name		: ApprovalDecorationBelongDaoImpl.java
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

import com.fanglin.approval.dao.ApprovalDecorationBelongDao;
import com.fanglin.approval.po.ApprovalDecorationBelongPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationBelongDao")
public class ApprovalDecorationBelongDaoImpl extends DaoImpl<ApprovalDecorationBelongPO> implements ApprovalDecorationBelongDao {

	public ApprovalDecorationBelongDaoImpl() {
		super(ApprovalDecorationBelongPO.class);
	}

	@Override
	public ApprovalDecorationBelongPO queryApprovalDecorationBelongByAId(long aId) {
		return (ApprovalDecorationBelongPO) session().createCriteria(ApprovalDecorationBelongPO.class).add(Restrictions.eq(ApprovalDecorationBelongPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
