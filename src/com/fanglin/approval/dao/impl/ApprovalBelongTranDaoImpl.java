/**
 * @File Name		: ApprovalBelongTranDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalBelongTranDao;
import com.fanglin.approval.po.ApprovalBelongTranPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalBelongTranDao")
public class ApprovalBelongTranDaoImpl extends DaoImpl<ApprovalBelongTranPO> implements ApprovalBelongTranDao {

	public ApprovalBelongTranDaoImpl() {
		super(ApprovalBelongTranPO.class);
	}

	@Override
	public ApprovalBelongTranPO queryApprovalBelongTranByAId(long aId) {
		return (ApprovalBelongTranPO) session().createCriteria(ApprovalBelongTranPO.class).add(Restrictions.eq(ApprovalBelongTranPO.COLUMN_AID_STR, aId)).setMaxResults(1).uniqueResult();
	}

}
