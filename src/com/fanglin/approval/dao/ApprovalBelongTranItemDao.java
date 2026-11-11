/**
 * @File Name		: ApprovalBelongTranItemDao.java
 * @Package   	: com.fanglin.approval.dao
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalBelongTranItemPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalBelongTranItemDao extends Dao<ApprovalBelongTranItemPO> {

	public List<ApprovalBelongTranItemPO> queryApprovalBelongTranItemByAbtId(int abtId);

	public int countApprovalBelongTranItemForInit(String orderId, short belongType);

}
