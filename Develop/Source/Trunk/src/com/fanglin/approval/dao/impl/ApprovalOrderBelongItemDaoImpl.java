/**
 * @File Name		: ApprovalOrderBelongItemDaoImpl.java
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

import com.fanglin.approval.dao.ApprovalOrderBelongItemDao;
import com.fanglin.approval.po.ApprovalOrderBelongItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalOrderBelongItemDao")
public class ApprovalOrderBelongItemDaoImpl extends DaoImpl<ApprovalOrderBelongItemPO> implements ApprovalOrderBelongItemDao {

	public ApprovalOrderBelongItemDaoImpl(){
		super(ApprovalOrderBelongItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ApprovalOrderBelongItemPO> queryApprovalOrderBelongItemByAobId(int aobId) {
		return session().createCriteria(ApprovalOrderBelongItemPO.class).add(Restrictions.eq(ApprovalOrderBelongItemPO.COLUMN_AOBID_STR, aobId)).list();
	}
	
}
