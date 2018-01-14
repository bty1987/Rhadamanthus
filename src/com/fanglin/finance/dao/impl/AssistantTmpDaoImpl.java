/**
 * @File Name		: AssistantTmpDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-4-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.finance.dao.AssistantTmpDao;
import com.fanglin.finance.po.AssistantTmpPO;

@Repository("assistantTmpDao")
public class AssistantTmpDaoImpl extends DaoImpl<AssistantTmpPO> implements AssistantTmpDao {
	
	public AssistantTmpDaoImpl(){
		super(AssistantTmpPO.class);
	}

}
