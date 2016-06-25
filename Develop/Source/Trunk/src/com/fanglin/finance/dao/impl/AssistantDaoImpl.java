/**
 * @File Name		: AssistantDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.finance.dao.AssistantDao;
import com.fanglin.finance.po.AssistantPO;

@Repository("assistantDao")
public class AssistantDaoImpl extends DaoImpl<AssistantPO> implements AssistantDao {
	
	public AssistantDaoImpl(){
		super(AssistantPO.class);
	}

	@Override
	public AssistantPO merge(AssistantPO assistantPO) {
		return (AssistantPO) financeSession().merge(assistantPO);
	}

}
