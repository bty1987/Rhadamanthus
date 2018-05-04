/**
 * @File Name		: ApprovalMaterialFullPaymentDao.java
 * @Package   	: com.fanglin.approval.dao
 * @Version		: 1.0
 * @Date			: 2015-11-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalMaterialFullPaymentPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalMaterialFullPaymentDao extends Dao<ApprovalMaterialFullPaymentPO> {
	
	public ApprovalMaterialFullPaymentPO queryApprovalMaterialFullPaymentByAId(long aId);

}
