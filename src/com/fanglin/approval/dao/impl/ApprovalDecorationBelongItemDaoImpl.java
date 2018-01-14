/**
 * @File Name		: ApprovalDecorationBelongItemDaoImpl.java
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

import com.fanglin.approval.dao.ApprovalDecorationBelongItemDao;
import com.fanglin.approval.po.ApprovalDecorationBelongItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationBelongItemDao")
public class ApprovalDecorationBelongItemDaoImpl extends DaoImpl<ApprovalDecorationBelongItemPO> implements ApprovalDecorationBelongItemDao {

	public ApprovalDecorationBelongItemDaoImpl(){
		super(ApprovalDecorationBelongItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ApprovalDecorationBelongItemPO> queryApprovalDecorationBelongItemByAobId(int aobId) {
		return session().createCriteria(ApprovalDecorationBelongItemPO.class).add(Restrictions.eq(ApprovalDecorationBelongItemPO.COLUMN_AOBID_STR, aobId)).list();
	}
	
}
