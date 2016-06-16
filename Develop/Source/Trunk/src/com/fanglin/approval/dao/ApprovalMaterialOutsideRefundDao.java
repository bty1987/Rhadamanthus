/**
 * @File Name		: ApprovalMaterialOutsideRefundDao.java
 * @Package   	: com.fanglin.approval.dao
 * @Version		: 1.0
 * @Date			: 2015-10-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalMaterialOutsideRefundPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalMaterialOutsideRefundDao extends Dao<ApprovalMaterialOutsideRefundPO> {
	
	public ApprovalMaterialOutsideRefundPO queryApprovalMaterialOutsideRefundByAId(int aId);

}
