/**
 * @File Name		: ApprovalBelongTranItemDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalBelongTranItemDao;
import com.fanglin.approval.po.ApprovalBelongTranItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalBelongTranItemDao")
public class ApprovalBelongTranItemDaoImpl extends DaoImpl<ApprovalBelongTranItemPO> implements ApprovalBelongTranItemDao {

	public ApprovalBelongTranItemDaoImpl() {
		super(ApprovalBelongTranItemPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApprovalBelongTranItemPO> queryApprovalBelongTranItemByAbtId(int abtId) {
		return session().createCriteria(ApprovalBelongTranItemPO.class).add(Restrictions.eq(ApprovalBelongTranItemPO.COLUMN_ABTID_STR, abtId)).list();
	}

}
