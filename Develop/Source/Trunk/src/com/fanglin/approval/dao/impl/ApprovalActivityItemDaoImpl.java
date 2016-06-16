/**
 * @File Name		: ApprovalActivityItemDaoImpl.java
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

import com.fanglin.approval.dao.ApprovalActivityItemDao;
import com.fanglin.approval.po.ApprovalActivityItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalActivityItemDao")
public class ApprovalActivityItemDaoImpl extends DaoImpl<ApprovalActivityItemPO> implements ApprovalActivityItemDao {
	
	public ApprovalActivityItemDaoImpl(){
		super(ApprovalActivityItemPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ApprovalActivityItemPO> queryApprovalActivityItemByAaId(long aaId) {
		return session().createCriteria(ApprovalActivityItemPO.class).add(Restrictions.eq(ApprovalActivityItemPO.COLUMN_AAID_STR, aaId)).list();
	}

}
