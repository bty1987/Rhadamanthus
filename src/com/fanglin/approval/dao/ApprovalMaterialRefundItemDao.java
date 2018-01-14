/**
 * @File Name		: ApprovalMaterialRefundItemDao.java
 * @Package   	: com.fanglin.approval.dao
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalMaterialRefundItemPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalMaterialRefundItemDao extends Dao<ApprovalMaterialRefundItemPO> {
	
	public List<ApprovalMaterialRefundItemPO> queryApprovalMaterialRefundItemByAmrId(int amrId);

}
