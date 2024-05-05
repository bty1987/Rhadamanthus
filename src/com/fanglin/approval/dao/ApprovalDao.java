/**
 * @File Name		: ApprovalDao.java
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

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalDao extends Dao<ApprovalPO> {

	public List<ApprovalPO> pageApproval(Paging paging, List<Filter> filters, int company);

	public List<ApprovalPO> pageApprovalForReceive(Paging paging, List<Filter> filters, String userId, int company);

	public List<ApprovalPO> pageApprovalForSend(Paging paging, List<Filter> filters, String userId, int company);

	public List<ApprovalPO> pageApprovalForReceiveDept(Paging paging, List<Filter> filters, int department, int company);

	public ApprovalPO queryApproval(short status, short type, String ident);

	public ApprovalPO queryApprovalByChange(List<Short> status, short type, String ident);

	public ApprovalPO queryApprovalByProcessinstanceid(String processinstanceid);

	public int countApprovalForInitByIdent(String ident);

	public int countApprovalForInitByOrderId(String orderId);

	public int countApprovalForReceive(short status, int ruid, int company);

	public int countApprovalForSend(short status, int suid, int company);

}
