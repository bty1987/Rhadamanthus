/**
 * @File Name		: ApprovalDaoImpl.java
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

import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ProcessReferDao;
import com.fanglin.approval.po.ProcessReferPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("processReferDao")
public class ProcessReferDaoImpl extends DaoImpl<ProcessReferPO> implements ProcessReferDao {

	public ProcessReferDaoImpl() {
		super(ProcessReferPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProcessReferPO> queryProcessRefer() {
		return session().createCriteria(ProcessReferPO.class).list();
	}

}
